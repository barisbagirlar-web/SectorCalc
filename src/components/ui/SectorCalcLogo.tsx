"use client";

import { memo } from "react";

interface SectorCalcLogoProps {
  width?: number;
  height?: number;
  className?: string;
  /** When true, stroke uses currentColor (for dark/inverted backgrounds). */
  inverted?: boolean;
}

const STROKE_COLOR = "#1a1915";

/**
 * SectorCalc brand logo - vector bracket/sector symbol.
 *
 * ViewBox: 0 0 120 120 | stroke-width: 4 | strokeLinecap: round
 * Industrial-grade SVG, suitable for header, chatbot, popup, and favicon contexts.
 */
export const SectorCalcLogo = memo(function SectorCalcLogo({
  width = 120,
  height = 120,
  className = "",
  inverted = false,
}: SectorCalcLogoProps) {
  const stroke = inverted ? "currentColor" : STROKE_COLOR;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="SectorCalc Logo"
    >
      {/* Center vertical spine */}
      <line
        x1="60"
        y1="35"
        x2="60"
        y2="85"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Top horizontal bracket */}
      <line
        x1="50"
        y1="35"
        x2="60"
        y2="35"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Left dash */}
      <line
        x1="25"
        y1="60"
        x2="45"
        y2="60"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Right dash */}
      <line
        x1="75"
        y1="60"
        x2="95"
        y2="60"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Bottom horizontal */}
      <line
        x1="50"
        y1="85"
        x2="70"
        y2="85"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
});
