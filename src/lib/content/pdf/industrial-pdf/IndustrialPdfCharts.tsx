/**
 * Industrial PDF Charts - SVG-powered dynamic charts for @react-pdf/renderer.
 * Each chart renders entirely through react-pdf's <Svg> primitive.
 * No canvas, no external libs, zero runtime dependencies.
 */

import { Svg, Rect, Line, Text as SvgText, G } from "@react-pdf/renderer";
import type { PdfBarChartData } from "@/lib/content/pdf/industrial-pdf/types";
import type { PdfReportLabels } from "@/lib/content/pdf/industrial-pdf/i18n";

const NAVY = "#0F172A";
const NAVY_LIGHT = "#1E40AF";
const SLATE = "#64748B";
const GREEN = "#059669";
const RED = "#DC2626";
const AMBER = "#D97706";
const BORDER = "#E2E8F0";

const CHART_WIDTH = 480;
const CHART_HEIGHT = 200;
const MARGIN_LEFT = 80;
const MARGIN_RIGHT = 20;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 40;
const PLOT_WIDTH = CHART_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const PLOT_HEIGHT = CHART_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

/* ─── Horizontal bar chart ────────────────────────────────── */

interface BarChartProps {
  readonly data: readonly PdfBarChartData[];
  readonly labels: PdfReportLabels;
}

export function IndustrialBarChart({ data, labels }: BarChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barHeight = Math.min(18, (PLOT_HEIGHT - (data.length - 1) * 8) / data.length);
  const totalBarsHeight = data.length * barHeight + (data.length - 1) * 8;
  const chartStartY = MARGIN_TOP + (PLOT_HEIGHT - totalBarsHeight) / 2;
  const gridLines = [0, 25, 50, 75, 100];
  const tickWidth = PLOT_WIDTH / 100;

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
      {gridLines.map((pct) => {
        const x = MARGIN_LEFT + pct * tickWidth;
        return (
          <G key={`grid-${pct}`}>
            <Line x1={x} y1={MARGIN_TOP} x2={x} y2={CHART_HEIGHT - MARGIN_BOTTOM} stroke={BORDER} strokeWidth={0.5} />
            <SvgText x={x} y={CHART_HEIGHT - MARGIN_BOTTOM + 14} fill={SLATE} textAnchor="middle" style={{ fontSize: 6 }}>
              {`${pct}%`}
            </SvgText>
          </G>
        );
      })}

      {data.map((item, index) => {
        const barWidth = (item.value / maxValue) * PLOT_WIDTH;
        const y = chartStartY + index * (barHeight + 8);
        return (
          <G key={item.label}>
            <Rect x={MARGIN_LEFT} y={y} width={Math.max(barWidth, 2)} height={barHeight} fill={item.color || NAVY_LIGHT} rx={2} ry={2} />
            <SvgText x={MARGIN_LEFT + Math.max(barWidth, 2) + 4} y={y + barHeight / 2 + 2.5} fill={NAVY} textAnchor="start" style={{ fontSize: 7 }}>
              {item.formatted}
            </SvgText>
            <SvgText x={MARGIN_LEFT - 4} y={y + barHeight / 2 + 2.5} fill={SLATE} textAnchor="end" style={{ fontSize: 7 }}>
              {item.label.length > 18 ? item.label.substring(0, 17) + "..." : item.label}
            </SvgText>
          </G>
        );
      })}

      <SvgText x={CHART_WIDTH / 2} y={12} fill={NAVY} textAnchor="middle" style={{ fontSize: 8, fontWeight: 700 }}>
        {labels.analysisChart}
      </SvgText>
    </Svg>
  );
}

/* ─── Severity distribution ───────────────────────────────── */

interface SeverityDistributionProps {
  readonly thresholds: readonly { level: string }[];
  readonly labels: PdfReportLabels;
}

export function IndustrialSeverityDistribution({ thresholds, labels }: SeverityDistributionProps) {
  const counts: Record<string, number> = { critical: 0, warning: 0, acceptable: 0, safe: 0 };
  for (const t of thresholds) {
    counts[t.level.toLowerCase()] = (counts[t.level.toLowerCase()] ?? 0) + 1;
  }

  const colorMap: Record<string, string> = {
    critical: RED,
    warning: AMBER,
    acceptable: GREEN,
    safe: NAVY_LIGHT,
  };

  const data = Object.entries(counts).filter(([, count]) => count > 0);
  const barWidth = 60;
  const maxBarHeight = 100;
  const maxCount = Math.max(...data.map(([, c]) => c), 1);
  const startX = 50;

  return (
    <Svg width={CHART_WIDTH} height={150} viewBox={`0 0 ${CHART_WIDTH} 150`}>
      {data.map(([level, count], index) => {
        const barH = (count / maxCount) * maxBarHeight;
        const x = startX + index * (barWidth + 20);
        const y = 130 - barH;
        return (
          <G key={level}>
            <Rect x={x} y={y} width={barWidth - 8} height={barH} fill={colorMap[level] ?? SLATE} rx={3} ry={3} />
            <SvgText x={x + (barWidth - 8) / 2} y={y - 6} fill={NAVY} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700 }}>
              {String(count)}
            </SvgText>
            <SvgText x={x + (barWidth - 8) / 2} y={144} fill={SLATE} textAnchor="middle" style={{ fontSize: 7 }}>
              {level === "critical" ? labels.critical : level === "warning" ? labels.warning : labels.acceptable}
            </SvgText>
          </G>
        );
      })}

      <SvgText x={CHART_WIDTH / 2} y={12} fill={NAVY} textAnchor="middle" style={{ fontSize: 8, fontWeight: 700 }}>
        {labels.severityDistribution}
      </SvgText>
    </Svg>
  );
}
