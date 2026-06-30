"use client";

import { useId } from "react";

type TraceAiLogoSize = "sm" | "md" | "lg" | "fab";

type TraceAiLogoProps = {
  readonly size?: TraceAiLogoSize;
  readonly className?: string;
};

const SIZE_MAP: Record<TraceAiLogoSize, { w: number; v: number }> = {
  sm: { w: 28, v: 28 },
  md: { w: 44, v: 44 },
  lg: { w: 64, v: 64 },
  fab: { w: 56, v: 56 },
};

/**
 * Trace AI animated logo — Firebase-inspired warm gradient (yellow → orange → coral).
 * Outer rotating ring + pulsing glow + inner "T" trailblazer icon.
 */
export function TraceAiLogo({ size = "md", className }: TraceAiLogoProps) {
  const rawId = useId();
  const s = rawId.replace(/:/g, "");
  const dims = SIZE_MAP[size];
  const vw = dims.v;

  return (
    <div
      className={["sc-trace-ai-logo", `sc-trace-ai-logo--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      {/* Pulsing glow behind the logo */}
      <div className="sc-trace-ai-logo__glow" />

      {/* Rotating gradient ring */}
      <svg
        className="sc-trace-ai-logo__ring"
        viewBox={`0 0 ${vw} ${vw}`}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`ringGrad-${s}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFCA28" />
            <stop offset="35%" stopColor="#FF9100" />
            <stop offset="70%" stopColor="#DD2C00" />
            <stop offset="100%" stopColor="#FFCA28" />
          </linearGradient>
        </defs>
        <circle
          cx={vw / 2}
          cy={vw / 2}
          r={vw / 2 - 1.5}
          stroke={`url(#ringGrad-${s})`}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${vw * 0.65} ${vw * 0.35}`}
          className="sc-trace-ai-logo__ring-path"
        />
      </svg>

      {/* Inner body */}
      <svg
        className="sc-trace-ai-logo__body"
        viewBox={`0 0 ${vw} ${vw}`}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`bodyGrad-${s}`} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFCA28" />
            <stop offset="45%" stopColor="#FF9100" />
            <stop offset="85%" stopColor="#DD2C00" />
            <stop offset="100%" stopColor="#BF360C" />
          </radialGradient>
          <filter id={`bodyShadow-${s}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#DD2C00" floodOpacity="0.4" />
          </filter>
        </defs>
        <circle
          cx={vw / 2}
          cy={vw / 2}
          r={vw / 2 - 4}
          fill={`url(#bodyGrad-${s})`}
          filter={`url(#bodyShadow-${s})`}
          className="sc-trace-ai-logo__body-circle"
        />
        {/* Inner highlight */}
        <ellipse
          cx={vw * 0.38}
          cy={vw * 0.34}
          rx={vw * 0.18}
          ry={vw * 0.12}
          fill="rgba(255,255,255,0.3)"
          className="sc-trace-ai-logo__highlight"
        />
        {/* Trailblazer "T" mark */}
        <g className="sc-trace-ai-logo__glyph">
          <path
            d={`M${vw * 0.32} ${vw * 0.3} L${vw * 0.68} ${vw * 0.3} M${vw * 0.5} ${vw * 0.3} L${vw * 0.5} ${vw * 0.72} M${vw * 0.34} ${vw * 0.72} L${vw * 0.66} ${vw * 0.72}`}
            stroke="white"
            strokeWidth={vw * 0.07}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sc-trace-ai-logo__mark"
          />
          {/* Trail dot */}
          <circle
            cx={vw * 0.5}
            cy={vw * 0.72}
            r={vw * 0.05}
            fill="white"
            className="sc-trace-ai-logo__dot"
          />
        </g>
      </svg>
    </div>
  );
}
