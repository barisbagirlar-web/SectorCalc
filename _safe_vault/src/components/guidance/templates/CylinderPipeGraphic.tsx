import {
  GUIDANCE_COLORS,
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function CylinderPipeGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const diameterActive =
    isGraphicFieldActive("diameter", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("radius", activeFieldKey, fieldMap);
  const lengthActive = isGraphicFieldActive("length", activeFieldKey, fieldMap);
  const pressureActive = isGraphicFieldActive("pressure", activeFieldKey, fieldMap);
  const flowActive = isGraphicFieldActive("flow", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      <ellipse cx="90" cy="110" rx="28" ry="48" fill={GUIDANCE_COLORS.softFill} stroke={GUIDANCE_COLORS.border} strokeWidth="1.5" />
      <rect x="90" y="62" width="150" height="96" fill={GUIDANCE_COLORS.surface} stroke={GUIDANCE_COLORS.border} />
      <ellipse cx="240" cy="110" rx="28" ry="48" fill={GUIDANCE_COLORS.softOrange} stroke={GUIDANCE_COLORS.border} strokeWidth="1.5" />
      <line x1="62" y1="110" x2="118" y2="110" className={dimClass(diameterActive)} strokeWidth="2" />
      <text x="55" y="95" className={labelClass(diameterActive)}>{labelFor("diameter")}</text>
      <line x1="90" y1="175" x2="240" y2="175" className={dimClass(lengthActive)} strokeWidth="2" />
      <text x="150" y="192" className={labelClass(lengthActive)}>{labelFor("length")}</text>
      <circle cx="265" cy="55" r="18" fill={pressureActive ? GUIDANCE_COLORS.softFill : "none"} stroke={pressureActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.mutedLine} />
      <text x="252" y="59" className={labelClass(pressureActive)}>{labelFor("pressure")}</text>
      <path d="M20 110 H50" className={dimClass(flowActive)} strokeWidth="2" markerEnd="url(#grg-flow)" />
      <text x="8" y="95" className={labelClass(flowActive)}>{labelFor("flow")}</text>
      <defs>
        <marker id="grg-flow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}
