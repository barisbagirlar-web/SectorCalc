import {
  GUIDANCE_COLORS,
  isGraphicFieldActive,
  rgLabel,
  rgLine,
  rgShape,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function CompressorLeakGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const pressureActive = isGraphicFieldActive("pressure", activeFieldKey, fieldMap);
  const leakActive = isGraphicFieldActive("leakDiameter", activeFieldKey, fieldMap);
  const runtimeActive = isGraphicFieldActive("runtime", activeFieldKey, fieldMap);
  const energyActive = isGraphicFieldActive("energy", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img" data-template="compressor-leak">
      <line x1="40" y1="110" x2="220" y2="110" strokeWidth="8" stroke={GUIDANCE_COLORS.line} {...rgLine("pressure", pressureActive)} />
      <circle cx="160" cy="110" r="8" fill={leakActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.accent} {...rgShape("leakDiameter", leakActive)} />
      <text x="150" y="95" {...rgLabel("leakDiameter", leakActive)}>
        {labelFor("leakDiameter")}
      </text>
      <rect
        x="230"
        y="70"
        width="60"
        height="36"
        rx="4"
        fill={pressureActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface}
        stroke={pressureActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        {...rgShape("pressure", pressureActive)}
      />
      <text x="238" y="92" {...rgLabel("pressure", pressureActive)}>
        {labelFor("pressure")}
      </text>
      <line x1="40" y1="170" x2="280" y2="170" strokeWidth="2" {...rgLine("runtime", runtimeActive)} />
      <text x="130" y="188" {...rgLabel("runtime", runtimeActive)}>
        {labelFor("runtime")}
      </text>
      <rect
        x="40"
        y="40"
        width="90"
        height="34"
        rx="4"
        fill={energyActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface}
        stroke={energyActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        {...rgShape("energy", energyActive)}
      />
      <text x="52" y="62" {...rgLabel("energy", energyActive)}>
        {labelFor("energy")}
      </text>
    </svg>
  );
}
