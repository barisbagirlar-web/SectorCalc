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
import { TraceErrorBoundary } from "@/components/trace/TraceErrorBoundary";

// Always use FreeTraceChat — no Pro mode.
// Root cause of "unauthorized": ProTraceChat calls /api/trace/pro which
// requires Firebase auth. When token is missing/expired it returns 401.
// FreeTraceChat uses /api/trace/free which has ZERO auth checks.
const TraceChat = lazy(() =>
  import("@/components/trace/FreeTraceChat").then((m) => ({
    default: m.FreeTraceChat,
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
  readonly onClose: () => void;
  readonly panelRef: (node: HTMLDivElement | null) => void;
};

function ChatPanelWrapper({ onClose, panelRef }: ChatPanelWrapperProps) {
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
          <TraceChat onClose={onClose} />
        </Suspense>
      </div>
    </TraceErrorBoundary>
  );
}

export function TraceFloatingButton() {
  const t = useTranslations("trace");
  const { loading } = useUser();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelContainerRef = useRef<HTMLDivElement | null>(null);

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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{color:'#fff'}}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
