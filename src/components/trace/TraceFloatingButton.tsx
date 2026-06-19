"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useUser";
import { FreeTraceChat } from "@/components/trace/FreeTraceChat";
import { ProTraceChat } from "@/components/trace/ProTraceChat";

const BUBBLE_AUTO_HIDE_MS = 10_000;

function TraceFabBubble({
  text,
  onOpen,
  visible,
}: {
  text: string;
  onOpen: () => void;
  visible: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleClick = useCallback(() => {
    setDismissed(true);
    onOpen();
  }, [onOpen]);

  if (!visible || dismissed) return null;

  return (
    <div className="sc-trace__bubble-greeting" role="status" aria-live="polite">
      <div className="sc-trace__bubble-greeting-inner">
        <div className="sc-trace__bubble-greeting-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" className="sc-trace__bubble-greeting-avatar-svg">
            <circle cx="12" cy="12" r="10" fill="url(#bubbleGrad)" />
            <path
              d="M8 14c1.5-1.5 3.5-2 7-.5s4 2.5 1 5"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="9.5" cy="10.5" r="0.9" fill="white" />
            <circle cx="14.5" cy="10.5" r="0.9" fill="white" />
          </svg>
        </div>
        <button
          type="button"
          className="sc-trace__bubble-greeting-text"
          onClick={handleClick}
          aria-label={text}
        >
          {text}
        </button>
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
  const bubbleText = t("fabBubble");

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
    setBubbleVisible(false);
    setOpen((value) => !value);
  }, []);

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
        <svg
          viewBox="0 0 512 512"
          role="img"
          aria-hidden="true"
          className="sc-trace__fab-svg"
        >
          <style>{`
            @keyframes fabHue1 {
              0%, 100% { fill: #FF4438; }
              14% { fill: #FF6D00; }
              28% { fill: #FF9100; }
              42% { fill: #FFC107; }
              57% { fill: #FF6D00; }
              71% { fill: #FF4438; }
              85% { fill: #D50000; }
            }
            @keyframes fabHue2 {
              0%, 100% { fill: #FF9100; }
              14% { fill: #FFC107; }
              28% { fill: #FF6D00; }
              42% { fill: #FF4438; }
              57% { fill: #D50000; }
              71% { fill: #FF9100; }
              85% { fill: #FFC107; }
            }
            @keyframes fabHue3 {
              0%, 100% { fill: #D50000; }
              14% { fill: #FF4438; }
              28% { fill: #FFC107; }
              42% { fill: #FF9100; }
              57% { fill: #FFC107; }
              71% { fill: #D50000; }
              85% { fill: #FF4438; }
            }
            @keyframes fabHue4 {
              0%, 100% { fill: #FFC107; }
              14% { fill: #D50000; }
              28% { fill: #FF4438; }
              42% { fill: #FF6D00; }
              57% { fill: #FF9100; }
              71% { fill: #FFC107; }
              85% { fill: #FF4438; }
            }
            @keyframes fabPulse {
              0%, 100% { filter: drop-shadow(0 0 8px rgba(255,68,56,0.5)) drop-shadow(0 0 20px rgba(255,145,0,0.3)); }
              25% { filter: drop-shadow(0 0 14px rgba(255,193,7,0.6)) drop-shadow(0 0 30px rgba(255,68,56,0.35)); }
              50% { filter: drop-shadow(0 0 10px rgba(255,109,0,0.5)) drop-shadow(0 0 25px rgba(255,193,7,0.3)); }
              75% { filter: drop-shadow(0 0 16px rgba(213,0,0,0.5)) drop-shadow(0 0 35px rgba(255,109,0,0.35)); }
            }
            .fab-shape-1 { animation: fabHue1 3.2s ease-in-out infinite; }
            .fab-shape-2 { animation: fabHue2 3.2s ease-in-out infinite; }
            .fab-shape-3 { animation: fabHue3 3.2s ease-in-out infinite; }
            .fab-shape-4 { animation: fabHue4 3.2s ease-in-out infinite; }
          `}</style>
          <g className="sc-trace__fab-svg-group">
            <rect className="fab-shape-1" x="101" y="209" width="58" height="20" rx="4" />
            <rect className="fab-shape-2" x="355" y="209" width="58" height="20" rx="4" />
            <path className="fab-shape-3" d="M254 111H197V91H276V340H254V111Z" />
            <rect className="fab-shape-4" x="196" y="374" width="119" height="20" rx="4" />
          </g>
        </svg>

        {open ? <X className="sc-trace__fab-close-icon" aria-hidden="true" /> : null}
      </button>
    </div>
  );
}
