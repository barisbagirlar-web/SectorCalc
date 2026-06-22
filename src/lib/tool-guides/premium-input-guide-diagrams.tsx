import type { JSX } from "react";
import type { ToolGuideSpec } from "@/lib/tool-guides/tool-guide-spec";
import { getShapeDimensionGuide } from "@/lib/tool-guides/shape-dimension-guides";

const LINE = "#1a1915";
const ACCENT = "#003366";
const BG = "#faf9f5";

function NodeBox({
  x,
  y,
  w,
  h,
  label,
  role,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  role: string;
}) {
  const fill =
    role === "output"
      ? "#e8f4ea"
      : role === "constraint"
        ? "#fff4e5"
        : role === "primary"
          ? "#eef3f8"
          : "#f8fafc";
  return (
    <g data-guide-node={label}>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={ACCENT} strokeWidth="1.2" />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontFamily="system-ui,sans-serif"
        fontSize="10"
        fill={LINE}
        fontWeight={role === "primary" ? "600" : "500"}
      >
        {label}
      </text>
    </g>
  );
}

function CostBreakdownDiagram({ spec }: { spec: ToolGuideSpec }) {
  const nodes = spec.inputMap.slice(0, 5);
  return (
    <svg viewBox="0 0 420 220" width="100%" role="img" aria-hidden="true">
      <rect width="420" height="220" fill={BG} />
      {nodes.map((entry, index) => (
        <NodeBox
          key={entry.nodeId}
          x={20 + index * 78}
          y={index % 2 === 0 ? 40 : 110}
          w={72}
          h={44}
          label={entry.inputKey}
          role={entry.visualRole}
        />
      ))}
      <path
        d="M 56 84 L 56 110 M 134 84 L 134 110 M 212 84 L 212 110"
        stroke={ACCENT}
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      <text x="210" y="200" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="600">
        cost stack → price target → margin guard
      </text>
    </svg>
  );
}

function ProcessFlowDiagram({ spec }: { spec: ToolGuideSpec }) {
  const nodes = spec.inputMap.slice(0, 4);
  return (
    <svg viewBox="0 0 420 220" width="100%" role="img" aria-hidden="true">
      <rect width="420" height="220" fill={BG} />
      {nodes.map((entry, index) => (
        <g key={entry.nodeId}>
          <NodeBox
            x={30 + index * 95}
            y={70}
            w={80}
            h={44}
            label={entry.inputKey}
            role={entry.visualRole}
          />
          {index < nodes.length - 1 ? (
            <line
              x1={110 + index * 95}
              y1={92}
              x2={125 + index * 95}
              y2={92}
              stroke={ACCENT}
              strokeWidth="1.5"
              markerEnd="url(#flow-arrow)"
            />
          ) : null}
        </g>
      ))}
      <defs>
        <marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} />
        </marker>
      </defs>
      <text x="210" y="170" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="600">
        input drivers → process loss → cost impact
      </text>
    </svg>
  );
}

function QuoteRiskDiagram({ spec }: { spec: ToolGuideSpec }) {
  const nodes = spec.inputMap.slice(0, 6);
  return (
    <svg viewBox="0 0 420 220" width="100%" role="img" aria-hidden="true">
      <rect width="420" height="220" fill={BG} />
      <rect x="30" y="30" width="160" height="150" rx="6" fill="#f5f8fb" stroke={LINE} strokeWidth="1.2" />
      <text x="110" y="52" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="600">
        OEE + time drivers
      </text>
      {nodes.slice(0, 3).map((entry, index) => (
        <text
          key={entry.nodeId}
          x={50}
          y={78 + index * 22}
          fontSize="9"
          fontFamily="monospace"
          fill={LINE}
        >
          {entry.inputKey}
        </text>
      ))}
      <rect x="220" y="55" width="170" height="100" rx="6" fill="#eef3f8" stroke={ACCENT} strokeWidth="1.2" />
      {nodes.slice(3).map((entry, index) => (
        <text
          key={entry.nodeId}
          x={240}
          y={82 + index * 22}
          fontSize="9"
          fontFamily="monospace"
          fill={LINE}
        >
          {entry.inputKey}
        </text>
      ))}
      <line x1="190" y1="105" x2="220" y2="105" stroke={ACCENT} strokeWidth="1.5" />
    </svg>
  );
}

export function PremiumInputGuideDiagram({
  spec,
  locale,
}: {
  spec: ToolGuideSpec;
  locale: string;
}): JSX.Element | null {
  if (spec.guideType === "shape_dimension") {
    const shape = getShapeDimensionGuide(spec.slug);
    if (!shape) {
      return null;
    }
    return <shape.Svg locale={locale} />;
  }

  if (spec.guideType === "cost_breakdown") {
    return <CostBreakdownDiagram spec={spec} />;
  }

  if (spec.guideType === "process_flow") {
    return <ProcessFlowDiagram spec={spec} />;
  }

  if (spec.guideType === "quote_risk") {
    return <QuoteRiskDiagram spec={spec} />;
  }

  return null;
}
