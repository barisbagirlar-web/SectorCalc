import {
  GUIDANCE_COLORS,
  isGraphicFieldActive,
  rgLabel,
  rgLine,
  rgShape,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function MachineTimeGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const setupActive = isGraphicFieldActive("setupTime", activeFieldKey, fieldMap);
  const cycleActive = isGraphicFieldActive("cycleTime", activeFieldKey, fieldMap);
  const quantityActive = isGraphicFieldActive("quantity", activeFieldKey, fieldMap);
  const downtimeActive = isGraphicFieldActive("downtime", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img" data-template="machine-time">
      <rect
        x="40"
        y="100"
        width="50"
        height="40"
        fill={setupActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface}
        stroke={setupActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        {...rgShape("setupTime", setupActive)}
      />
      <text x="48" y="125" {...rgLabel("setupTime", setupActive)}>
        {labelFor("setupTime")}
      </text>
      <rect
        x="110"
        y="90"
        width="90"
        height="50"
        fill={cycleActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.softOrange}
        stroke={cycleActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        {...rgShape("cycleTime", cycleActive)}
      />
      <text x="125" y="122" {...rgLabel("cycleTime", cycleActive)}>
        {labelFor("cycleTime")}
      </text>
      <rect
        x="220"
        y="100"
        width="60"
        height="40"
        fill={quantityActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface}
        stroke={quantityActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        {...rgShape("quantity", quantityActive)}
      />
      <text x="232" y="125" {...rgLabel("quantity", quantityActive)}>
        {labelFor("quantity")}
      </text>
      <line x1="40" y1="165" x2="280" y2="165" strokeWidth="2" strokeDasharray="6 4" {...rgLine("downtime", downtimeActive)} />
      <text x="120" y="185" {...rgLabel("downtime", downtimeActive)}>
        {labelFor("downtime")}
      </text>
    </svg>
  );
}
