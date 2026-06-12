import {
  GUIDANCE_COLORS,
  isGraphicFieldActive,
  rgLabel,
  rgShape,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function GenericCalculatorGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const inputActive = isGraphicFieldActive("input", activeFieldKey, fieldMap);
  const processActive = isGraphicFieldActive("process", activeFieldKey, fieldMap);
  const resultActive = isGraphicFieldActive("result", activeFieldKey, fieldMap);
  const decisionActive = isGraphicFieldActive("decision", activeFieldKey, fieldMap);

  const node = (x: number, y: number, active: boolean, canonical: string) => (
    <g key={canonical}>
      <rect
        x={x}
        y={y}
        width="64"
        height="40"
        rx="6"
        fill={active ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface}
        stroke={active ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        {...rgShape(canonical, active)}
      />
      <text x={x + 8} y={y + 24} {...rgLabel(canonical, active)}>
        {labelFor(canonical)}
      </text>
    </g>
  );

  return (
    <svg viewBox="0 0 320 200" className="grg-svg" role="img" data-template="generic">
      {node(30, 80, inputActive, "input")}
      {node(110, 80, processActive, "process")}
      {node(190, 80, resultActive, "result")}
      {node(270, 80, decisionActive, "decision")}
      <path d="M94 100 H110 M174 100 H190 M254 100 H270" stroke={GUIDANCE_COLORS.mutedLine} strokeWidth="2" markerEnd="url(#grg-generic)" />
      <defs>
        <marker id="grg-generic" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={GUIDANCE_COLORS.mutedLine} />
        </marker>
      </defs>
    </svg>
  );
}
