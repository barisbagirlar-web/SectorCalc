"use client";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useUser";
import { TraceAiLogo } from "@/components/trace/TraceAiLogo";
import { TraceErrorBoundary } from "@/components/trace/TraceErrorBoundary";

const FreeTraceChat = lazy(() =>
  import("@/components/trace/FreeTraceChat").then((m) => ({
    default: m.FreeTraceChat,
  })),
);
const ProTraceChat = lazy(() =>
  import("@/components/trace/ProTraceChat").then((m) => ({
    default: m.ProTraceChat,
  })),
);

const PANEL_TRANSITION_MS = 260;
const FAB_BG_GRADIENT = "linear-gradient(135deg,#2563eb,#1e3a8a)";

function ChatSkeleton() {
  return (
    <div className="sc-trace__skeleton" aria-hidden="true">
      <div className="sc-trace__skeleton-header" />
      <div className="sc-trace__skeleton-body">
        <div className="sc-trace__skeleton-line sc-trace__skeleton-line--short" />
        <div className="sc-trace__skeleton-line sc-trace__skeleton-line--medium" />
        <div className="sc-trace__skeleton-line sc-trace__skeleton-line--long" />
      </div>
      <div className="sc-trace__skeleton-footer" />
    </div>
  );
}

type ChatPanelWrapperProps = {
  readonly isPro: boolean;
  readonly onClose: () => void;
  readonly panelRef: (node: HTMLDivElement | null) => void;
};

function ChatPanelWrapper({ isPro, onClose, panelRef }: ChatPanelWrapperProps) {
  return (
    <TraceErrorBoundary onRetry={onClose}>
      <div
        ref={panelRef}
        className="sc-trace__panel sc-trace__panel--open"
        role="dialog"
        aria-modal="true"
        aria-label="Trace AI Chat"
      >
        <Suspense fallback={<ChatSkeleton />}>
          {isPro ? (
            <ProTraceChat onClose={onClose} />
          ) : (
            <FreeTraceChat onClose={onClose} />
          )}
        </Suspense>
      </div>
    </TraceErrorBoundary>
  );
}

export function TraceFloatingButton() {
  const t = useTranslations("trace");
  const { user, userRole, loading } = useUser();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelContainerRef = useRef<HTMLDivElement | null>(null);
  // Lock mode on first open so late auth state doesn't swap
  // FreeTraceChat <-> ProTraceChat mid-conversation.
  const lockedProRef = useRef<boolean | null>(null);
  const isPro =
    lockedProRef.current !== null
      ? lockedProRef.current
      : userRole === "premium" && Boolean(user);

  useEffect(() => {
    if (open && lockedProRef.current === null) {
      lockedProRef.current = userRole === "premium" && Boolean(user);
    }
  }, [open, user, userRole]);

  useEffect(() => {
    const openHandler = () => {
      setOpen(true);
    };
    window.addEventListener("trace:open", openHandler);
    return () => window.removeEventListener("trace:open", openHandler);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(".sc-trace__input");
        input?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const closePanel = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      fabRef.current?.focus();
    }, PANEL_TRANSITION_MS);
  }, []);

  const handleFabClick = useCallback(() => {
    if (open || closing) {
      closePanel();
    } else {
      setOpen(true);
    }
  }, [open, closing, closePanel]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closePanel();
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [open, closePanel]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        open &&
        panelContainerRef.current &&
        !panelContainerRef.current.contains(e.target as Node)
      ) {
        closePanel();
      }
    },
    [open, closePanel],
  );

  const setPanelRef = useCallback((node: HTMLDivElement | null) => {
    panelContainerRef.current = node;
  }, []);

  const showPanel = open || closing;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      data-trace-assistant="true"
      className="sc-trace"
      onClick={handleBackdropClick}
    >
      {showPanel ? (
        <div
          className={`sc-trace__panel-wrap ${closing ? "sc-trace__panel-wrap--closing" : "sc-trace__panel-wrap--open"}`}
        >
          <ChatPanelWrapper
            isPro={isPro}
            onClose={closePanel}
            panelRef={setPanelRef}
          />
        </div>
      ) : null}

      <button
        id="trace-fab"
        ref={fabRef}
        type="button"
        className={`sc-trace__fab${open ? " sc-trace__fab--open" : ""}${closing ? " sc-trace__fab--closing" : ""}`}
        aria-expanded={open}
        aria-label={open ? t("close") : t("launcher")}
        aria-controls="trace-chat-panel"
        onClick={handleFabClick}
        disabled={loading}
        style={{ background: FAB_BG_GRADIENT }}
      >
        <span className="sc-trace__fab-online-badge" aria-hidden="true" />
        {open || closing ? (
          <X className="sc-trace__fab-close-icon" aria-hidden="true" />
        ) : (
          <TraceAiLogo size="fab" />
        )}
      </button>
    </div>
  );
}
