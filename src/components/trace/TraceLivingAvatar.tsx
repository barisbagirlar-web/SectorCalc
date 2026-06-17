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

/** Displacement intensity — fab must read clearly at 72–84px. */
const LIQUID_SCALE: Record<TraceLivingAvatarSize, number> = {
  sm: 5,
  md: 14,
  lg: 18,
  fab: 24,
};

const BLOB_PATH =
  "M60,16 C92,6 116,30 110,62 C104,96 70,112 42,100 C14,86 4,54 22,28 C36,10 48,20 60,16Z";

export function TraceLivingAvatar({ size = "md", className }: TraceLivingAvatarProps) {
  const rawId = useId();
  const safeId = rawId.replace(/:/g, "");
  const liquidFilterId = `traceLiquid-${safeId}`;
  const glowFilterId = `traceLivingGlow-${safeId}`;
  const bodyGradId = `traceBodyGrad-${safeId}`;
  const spinGradId = `traceSpinGrad-${safeId}`;
  const nodeGradientId = `traceLivingNode-${safeId}`;
  const liquidScale = LIQUID_SCALE[size];
  const liquidScaleMax = Math.round(liquidScale * 1.45);

  return (
    <div
      className={["sc-trace-living", SIZE_CLASS[size], className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div className="sc-trace-living__aura" />
      <div className="sc-trace-living__aura sc-trace-living__aura--alt" />
      <div className="sc-trace-living__ripple sc-trace-living__ripple--1" />
      <div className="sc-trace-living__ripple sc-trace-living__ripple--2" />
      <div className="sc-trace-living__ripple sc-trace-living__ripple--3" />

      <svg className="sc-trace-living__stage" viewBox="0 0 120 120" fill="none">
        <defs>
          <filter
            id={liquidFilterId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" numOctaves="4" seed="3" result="noiseA">
              <animate
                attributeName="baseFrequency"
                values="0.007 0.013;0.015 0.008;0.010 0.017;0.018 0.009;0.007 0.013"
                dur="5.5s"
                repeatCount="indefinite"
              />
              <animate attributeName="seed" values="1;6;3;9;5;1" dur="9s" repeatCount="indefinite" />
            </feTurbulence>
            <feTurbulence type="turbulence" numOctaves="2" seed="8" result="noiseB">
              <animate
                attributeName="baseFrequency"
                values="0.018 0.006;0.009 0.015;0.014 0.011;0.018 0.006"
                dur="3.8s"
                repeatCount="indefinite"
              />
              <animate attributeName="seed" values="8;2;11;7;8" dur="6.2s" repeatCount="indefinite" />
            </feTurbulence>
            <feBlend in="noiseA" in2="noiseB" mode="screen" result="noise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={liquidScale}
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                values={`${liquidScale};${liquidScaleMax};${Math.round(liquidScale * 0.85)};${liquidScaleMax};${liquidScale}`}
                dur="4.2s"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>

          <radialGradient id={bodyGradId} cx="68%" cy="24%" r="72%">
            <stop offset="0%" stopColor="#6DF0FF" />
            <stop offset="28%" stopColor="#116CFF" />
            <stop offset="58%" stopColor="#004DFF" />
            <stop offset="82%" stopColor="#05245E" />
            <stop offset="100%" stopColor="#031331" />
          </radialGradient>

          <linearGradient id={spinGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(25,216,255,0.55)" />
            <stop offset="35%" stopColor="rgba(123,92,255,0.42)" />
            <stop offset="68%" stopColor="rgba(52,211,153,0.28)" />
            <stop offset="100%" stopColor="rgba(11,120,255,0.18)" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 0.5 0.5"
              to="360 0.5 0.5"
              dur="7s"
              repeatCount="indefinite"
            />
          </linearGradient>

          <linearGradient id={nodeGradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0B78FF">
              <animate
                attributeName="stop-color"
                values="#0B78FF;#22E6FF;#7B5CFF;#0B78FF"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#22E6FF">
              <animate
                attributeName="stop-color"
                values="#22E6FF;#6DF0FF;#A78BFA;#22E6FF"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#6DF0FF">
              <animate
                attributeName="stop-color"
                values="#6DF0FF;#0B78FF;#34D399;#6DF0FF"
                dur="3.2s"
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

        <g className="sc-trace-living__liquid-orbit">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 58"
            to="360 60 58"
            dur="13s"
            repeatCount="indefinite"
          />
          <g filter={`url(#${liquidFilterId})`}>
            <path className="sc-trace-living__liquid-body" d={BLOB_PATH} fill={`url(#${bodyGradId})`} />
            <path className="sc-trace-living__liquid-sheen" d={BLOB_PATH} fill={`url(#${spinGradId})`} />
            <ellipse
              className="sc-trace-living__liquid-highlight"
              cx="82"
              cy="30"
              rx="14"
              ry="10"
              fill="rgba(255,255,255,0.72)"
            />
            <ellipse
              className="sc-trace-living__liquid-depth"
              cx="34"
              cy="86"
              rx="22"
              ry="16"
              fill="rgba(0,8,28,0.45)"
            />
          </g>
        </g>

        <g className="sc-trace-living__glyph" filter={`url(#${glowFilterId})`}>
          <path
            className="sc-trace-living__bubble"
            d="M33 86V72.5C22.5 61.5 25.5 41.5 41 31.5C59.5 19.5 88.5 27.5 94.5 50.5C101.5 77.5 70.5 92.5 51 80.5L33 86Z"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
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
        </g>
      </svg>
    </div>
  );
}
