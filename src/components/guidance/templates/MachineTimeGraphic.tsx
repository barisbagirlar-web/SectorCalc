import {
  GUIDANCE_COLORS,
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function MachineTimeGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const setupActive =
    isGraphicFieldActive("setupTime", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("setup", activeFieldKey, fieldMap);
  const cycleActive = isGraphicFieldActive("cycleTime", activeFieldKey, fieldMap);
  const quantityActive = isGraphicFieldActive("quantity", activeFieldKey, fieldMap);
  const downtimeActive = isGraphicFieldActive("downtime", activeFieldKey, fieldMap);
  const availabilityActive = isGraphicFieldActive("availability", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      <rect x="40" y="100" width="50" height="40" fill={setupActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface} stroke={setupActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border} />
      <text x="48" y="125" className={labelClass(setupActive)}>{labelFor("setup")}</text>
      <rect x="110" y="90" width="90" height="50" fill={cycleActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.softOrange} stroke={cycleActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border} />
      <text x="125" y="122" className={labelClass(cycleActive)}>{labelFor("time")}</text>
      <rect x="220" y="100" width="60" height="40" fill={quantityActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface} stroke={quantityActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border} />
      <text x="232" y="125" className={labelClass(quantityActive)}>{labelFor("quantity")}</text>
      <line x1="40" y1="165" x2="280" y2="165" className={dimClass(downtimeActive)} strokeWidth="2" strokeDasharray="6 4" />
      <text x="120" y="185" className={labelClass(downtimeActive)}>{labelFor("time")}</text>
      <text x="230" y="75" className={labelClass(availabilityActive)}>{labelFor("time")}</text>
    </svg>
  );
}
