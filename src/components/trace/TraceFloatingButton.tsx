"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useUser";
import { FreeTraceChat } from "@/components/trace/FreeTraceChat";
import { ProTraceChat } from "@/components/trace/ProTraceChat";
import { TraceAiLogo } from "@/components/trace/TraceAiLogo";

const BUBBLE_AUTO_HIDE_MS = 16_000;

/** Welcome bubble — redesigned dark card with Trace AI logo, greeting, stats. */
function TraceFabBubble({
  onOpen,
  visible,
}: {
  onOpen: () => void;
  visible: boolean;
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

  // Re-trigger pop-in animation when bubble becomes visible again
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
        {/* Close button */}
        <button
          type="button"
          className="sc-trace__bubble-close"
          onClick={handleClose}
          aria-label={t("close")}
        >
          ✕
        </button>

        {/* Logo area */}
        <div className="sc-trace__bubble-logo-wrap">
          <TraceAiLogo size="md" />
        </div>

        {/* Head: name + online status */}
        <div className="sc-trace__bubble-head">
          <div className="sc-trace__bubble-head-name">Trace AI</div>
          <div className="sc-trace__bubble-head-status">
            <span className="sc-trace__bubble-green-dot" />
            {t("bubbleOnline")}
          </div>
        </div>

        {/* Main greeting text */}
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

        {/* Stats divider */}
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

export function TraceFloatingButton() {
  const t = useTranslations("trace");
  const { user, userRole, loading } = useUser();
  const isPro = userRole === "premium" && Boolean(user);
  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("trace:open", openHandler);
    return () => window.removeEventListener("trace:open", openHandler);
  }, []);

  useEffect(() => {
    if (open) setBubbleVisible(false);
  }, [open]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleFabClick = useCallback(() => {
    if (bubbleVisible) {
      setBubbleVisible(false);
      setOpen(true);
    } else if (open) {
      setOpen(false);
      setTimeout(() => setBubbleVisible(true), 300);
    } else {
      setBubbleVisible(true);
    }
  }, [bubbleVisible, open]);

  return (
    <div data-trace-assistant="true" className="sc-trace">
      {open ? (
        <div className="sc-trace__panel sc-trace__panel--open" role="dialog" aria-label={t("launcher")}>
          {isPro ? (
            <ProTraceChat onClose={() => setOpen(false)} />
          ) : (
            <FreeTraceChat onClose={() => setOpen(false)} />
          )}
        </div>
      ) : null}

      <TraceFabBubble
        onOpen={handleOpen}
        visible={bubbleVisible}
      />

      <button
        id="trace-fab"
        type="button"
        className={open ? "sc-trace__fab sc-trace__fab--open" : "sc-trace__fab"}
        aria-expanded={open}
        aria-label={t("launcher")}
        onClick={handleFabClick}
        disabled={loading}
      >
        {/* Online badge */}
        <span className="sc-trace__fab-online-badge" aria-hidden="true" />

        {/* Trace AI animated logo */}
        <TraceAiLogo size="fab" />

        {open ? <X className="sc-trace__fab-close-icon" aria-hidden="true" /> : null}
      </button>
    </div>
  );
}
