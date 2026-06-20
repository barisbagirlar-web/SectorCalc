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

// ─── Lazy-loaded chat panel (code split — ~2.6 kB gzipped) ──────
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

const BUBBLE_AUTO_HIDE_MS = 16_000;
const BUBBLE_SESSION_KEY = "sectorcalc-trace-bubble-dismissed";
const PANEL_TRANSITION_MS = 260;
const FAB_BG_GRADIENT =
  "linear-gradient(135deg,#2563eb,#1e3a8a)";

// ─── Loading skeleton for lazy-loaded chat ──────────────────────
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

// ─── Welcome bubble ─────────────────────────────────────────────
function TraceFabBubble({
  onOpen,
  visible,
}: {
  readonly onOpen: () => void;
  readonly visible: boolean;
}) {
  const t = useTranslations("trace");
  const [dismissed, setDismissed] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animKeyRef = useRef(0);

  useEffect(() => {
    if (!visible) {
      setDismissed(false);
      return;
    }
    timerRef.current = setTimeout(() => setDismissed(true), BUBBLE_AUTO_HIDE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  const handleClose = useCallback(() => {
    setDismissed(true);
  }, []);

  const handleBubbleClick = useCallback(() => {
    setDismissed(true);
    onOpen();
  }, [onOpen]);

  const isHidden = !visible || dismissed;

  useEffect(() => {
    if (!isHidden && bubbleRef.current) {
      animKeyRef.current += 1;
      const el = bubbleRef.current;
      el.style.animation = "none";
      void el.offsetHeight;
      el.style.animation = "";
    }
  }, [isHidden]);

  if (isHidden) return null;

  return (
    <div
      className="sc-trace__bubble-greeting"
      role="status"
      aria-live="polite"
      key={animKeyRef.current}
    >
      <div className="sc-trace__bubble-greeting-card" ref={bubbleRef}>
        <button
          type="button"
          className="sc-trace__bubble-close"
          onClick={handleClose}
          aria-label={t("close")}
        >
          ✕
        </button>

        <div className="sc-trace__bubble-logo-wrap">
          <TraceAiLogo size="md" />
        </div>

        <div className="sc-trace__bubble-head">
          <div className="sc-trace__bubble-head-name">Trace AI</div>
          <div className="sc-trace__bubble-head-status">
            <span className="sc-trace__bubble-green-dot" />
            {t("bubbleOnline")}
          </div>
        </div>

        <button
          type="button"
          className="sc-trace__bubble-text"
          onClick={handleBubbleClick}
        >
          <p className="sc-trace__bubble-greeting-paragraph">
            {t("bubbleGreeting")}
          </p>
          <p className="sc-trace__bubble-cta">{t("bubbleCta")}</p>
        </button>

        <div className="sc-trace__bubble-stats">
          <div className="sc-trace__bubble-stats-divider" />
          <div className="sc-trace__bubble-stats-row">
            <span className="sc-trace__bubble-stat">
              {t("bubbleFreeTools")}
            </span>
            <span className="sc-trace__bubble-stat sc-trace__bubble-stat--premium">
              {t("bubblePremiumTools")}
            </span>
          </div>
        </div>
      </div>
      <div className="sc-trace__bubble-greeting-tail" aria-hidden="true" />
    </div>
  );
}

// ─── Chat panel with ErrorBoundary + lazy loading ───────────────
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

// ─── Main FAB component ─────────────────────────────────────────
export function TraceFloatingButton() {
  const t = useTranslations("trace");
  const { user, userRole, loading } = useUser();
  const isPro = userRole === "premium" && Boolean(user);

  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelContainerRef = useRef<HTMLDivElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // ── Session-persistent bubble: hide after first open ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(BUBBLE_SESSION_KEY)) {
      setBubbleVisible(false);
    }
    setInitialLoad(false);
  }, []);

  // ── Listen for trace:open event (from homepage TraceIntro) ──
  useEffect(() => {
    const openHandler = () => {
      setBubbleVisible(false);
      sessionStorage.setItem(BUBBLE_SESSION_KEY, "1");
      setOpen(true);
    };
    window.addEventListener("trace:open", openHandler);
    return () => window.removeEventListener("trace:open", openHandler);
  }, []);

  // ── Hide bubble when panel is open ──
  useEffect(() => {
    if (open) {
      setBubbleVisible(false);
      sessionStorage.setItem(BUBBLE_SESSION_KEY, "1");
    }
  }, [open]);

  // ── Save/restore focus for a11y ──
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      // Defer focus to the input inside the panel
      const timer = setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(
          ".sc-trace__input",
        );
        input?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ── Close animation sequence ──
  const closePanel = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      // Restore focus to FAB
      fabRef.current?.focus();
      // Re-show bubble after short delay
      setTimeout(() => {
        const seen = sessionStorage.getItem(BUBBLE_SESSION_KEY);
        if (!seen) setBubbleVisible(true);
      }, 400);
    }, PANEL_TRANSITION_MS);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleFabClick = useCallback(() => {
    if (open || closing) {
      closePanel();
    } else if (bubbleVisible) {
      setBubbleVisible(false);
      setOpen(true);
    } else {
      setOpen(true);
    }
  }, [open, closing, bubbleVisible, closePanel]);

  // ── Escape key to close ──
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

  // ── Backdrop click to close (click outside panel) ──
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

  // ── Panel ref callback ──
  const setPanelRef = useCallback((node: HTMLDivElement | null) => {
    panelContainerRef.current = node;
  }, []);

  const showPanel = open || closing;
  const loadingUser = loading && initialLoad;

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

      <TraceFabBubble onOpen={handleOpen} visible={bubbleVisible} />

      <button
        id="trace-fab"
        ref={fabRef}
        type="button"
        className={`sc-trace__fab${open ? " sc-trace__fab--open" : ""}${closing ? " sc-trace__fab--closing" : ""}`}
        aria-expanded={open}
        aria-label={open ? t("close") : t("launcher")}
        aria-controls="trace-chat-panel"
        onClick={handleFabClick}
        disabled={loadingUser}
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
