"use client";

import { useId } from "react";

type TraceLivingAvatarSize = "sm" | "md" | "lg" | "fab";

type TraceLivingAvatarProps = {
  readonly size?: TraceLivingAvatarSize;
  readonly className?: string;
};

const SIZE_CLASS: Record<TraceLivingAvatarSize, string> = {
  sm: "sc-trace-living--sm",
  md: "sc-trace-living--md",
  lg: "sc-trace-living--lg",
  fab: "sc-trace-living--fab",
};

export function TraceLivingAvatar({ size = "md", className }: TraceLivingAvatarProps) {
  const rawId = useId();
  const safeId = rawId.replace(/:/g, "");
  const nodeGradientId = `traceLivingNode-${safeId}`;
  const glowFilterId = `traceLivingGlow-${safeId}`;

  return (
    <div
      className={["sc-trace-living", SIZE_CLASS[size], className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div className="sc-trace-living__aura" />
      <div className="sc-trace-living__ripple sc-trace-living__ripple--1" />
      <div className="sc-trace-living__ripple sc-trace-living__ripple--2" />
      <div className="sc-trace-living__ripple sc-trace-living__ripple--3" />

      <div className="sc-trace-living__blob">
        <div className="sc-trace-living__blob-core" />
        <div className="sc-trace-living__blob-depth" />
        <div className="sc-trace-living__blob-shimmer" />
        <div className="sc-trace-living__blob-shimmer sc-trace-living__blob-shimmer--alt" />
        <div className="sc-trace-living__cyan-rim" />
        <div className="sc-trace-living__caustics" />
        <div className="sc-trace-living__droplet" />
      </div>

      <svg className="sc-trace-living__glyph" viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id={nodeGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0B78FF">
              <animate
                attributeName="stop-color"
                values="#0B78FF;#22E6FF;#7B5CFF;#0B78FF"
                dur="3.6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#22E6FF">
              <animate
                attributeName="stop-color"
                values="#22E6FF;#6DF0FF;#A78BFA;#22E6FF"
                dur="3.6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#6DF0FF">
              <animate
                attributeName="stop-color"
                values="#6DF0FF;#0B78FF;#34D399;#6DF0FF"
                dur="3.6s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <filter id={glowFilterId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#001B4D" floodOpacity="0.35">
              <animate
                attributeName="flood-opacity"
                values="0.25;0.55;0.25"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </feDropShadow>
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22E6FF" floodOpacity="0.2">
              <animate
                attributeName="flood-opacity"
                values="0.1;0.45;0.1"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </feDropShadow>
          </filter>
        </defs>

        <g className="sc-trace-living__glyph-orbit">
          <path
            className="sc-trace-living__bubble"
            d="M33 86V72.5C22.5 61.5 25.5 41.5 41 31.5C59.5 19.5 88.5 27.5 94.5 50.5C101.5 77.5 70.5 92.5 51 80.5L33 86Z"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${glowFilterId})`}
          />

          <g className="sc-trace-living__wave-group">
            <path
              className="sc-trace-living__wave"
              d="M36 78C42 56 52 57 64 51.5C76 46 84 48.5 92 34"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        <circle
          className="sc-trace-living__node sc-trace-living__node--1"
          cx="45"
          cy="58"
          r="5.8"
          fill={`url(#${nodeGradientId})`}
          stroke="white"
          strokeWidth="4"
        />
        <circle
          className="sc-trace-living__node sc-trace-living__node--2"
          cx="72"
          cy="55"
          r="5.8"
          fill={`url(#${nodeGradientId})`}
          stroke="white"
          strokeWidth="4"
        />
        <circle
          className="sc-trace-living__node sc-trace-living__node--3"
          cx="90"
          cy="38"
          r="5.8"
          fill={`url(#${nodeGradientId})`}
          stroke="white"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}
