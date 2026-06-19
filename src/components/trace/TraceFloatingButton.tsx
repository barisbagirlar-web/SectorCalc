"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useUser";
import { FreeTraceChat } from "@/components/trace/FreeTraceChat";
import { ProTraceChat } from "@/components/trace/ProTraceChat";

const BUBBLE_AUTO_HIDE_MS = 16_000;

/** Simple orb avatar — matches the dark bubble head. */
function TraceBubbleAvatar() {
  const id = useRef(`traceAvatarGrad-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="sc-trace__bubble-avatar-svg">
      <defs>
        <radialGradient id={id} cx="62%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="15.5" fill={`url(#${id})`} stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" />
      <rect x="9" y="12" width="14" height="2" rx="1" fill="#93c5fd" />
      <rect x="11.5" y="14.5" width="2.5" height="7" rx="1.25" fill="#93c5fd" />
      <circle cx="16" cy="24" r="1.5" fill="#bfdbfe" />
    </svg>
  );
}

/** Welcome bubble — dark card with close, avatar head, and rich greeting text. */
function TraceFabBubble({
  text,
  onOpen,
  visible,
}: {
  text: string;
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
      // Force reflow
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

        {/* Head: avatar + name + online status */}
        <div className="sc-trace__bubble-head">
          <div className="sc-trace__bubble-head-avatar">
            <TraceBubbleAvatar />
          </div>
          <div>
            <div className="sc-trace__bubble-head-name">Trace AI</div>
            <div className="sc-trace__bubble-head-status">
              <span className="sc-trace__bubble-green-dot" />
              {t("bubbleOnline")}
            </div>
          </div>
        </div>

        {/* Message body */}
        <button
          type="button"
          className="sc-trace__bubble-text"
          onClick={handleBubbleClick}
          aria-label={text.replace(/<[^>]*>/g, "")}
          dangerouslySetInnerHTML={{ __html: text }}
        />
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
  const bubbleText = t.raw("fabBubble");

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
      // Bubble is showing → close it and open chat
      setBubbleVisible(false);
      setOpen(true);
    } else if (open) {
      // Chat is open → close it, mark bubble as visible again
      setOpen(false);
      // Show bubble after a short delay
      setTimeout(() => setBubbleVisible(true), 300);
    } else {
      // Neither bubble nor chat → show bubble
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
        text={bubbleText}
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

        {/* Simple white icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="sc-trace__fab-icon"
        >
          <rect x="7" y="8" width="10" height="1.5" rx="0.75" fill="white" />
          <rect x="10.25" y="9.5" width="2" height="6" rx="1" fill="white" />
          <circle cx="12" cy="17.5" r="1.2" fill="rgba(255,255,255,0.7)" />
        </svg>

        {open ? <X className="sc-trace__fab-close-icon" aria-hidden="true" /> : null}
      </button>
    </div>
  );
}
