import {
  GUIDANCE_COLORS,
  isGraphicFieldActive,
  rgLabel,
  rgLine,
  rgShape,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function BendRadiusGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const thicknessActive = isGraphicFieldActive("materialThickness", activeFieldKey, fieldMap);
  const radiusActive = isGraphicFieldActive("insideRadius", activeFieldKey, fieldMap);
  const angleActive = isGraphicFieldActive("bendAngle", activeFieldKey, fieldMap);
  const neutralActive = isGraphicFieldActive("neutralAxis", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img" data-template="bend-radius">
      <path
        d="M60 170 H200"
        stroke={GUIDANCE_COLORS.line}
        strokeWidth="8"
        {...rgShape("materialThickness", thicknessActive)}
      />
      <path d="M200 170 A70 70 0 0 0 270 100" fill="none" stroke={GUIDANCE_COLORS.line} strokeWidth="8" />
      <line x1="200" y1="170" x2="200" y2="100" strokeWidth="2" strokeDasharray="3 3" {...rgLine("insideRadius", radiusActive)} />
      <text x="175" y="145" {...rgLabel("insideRadius", radiusActive)}>
        {labelFor("insideRadius")}
      </text>
      <path d="M200 170 A40 40 0 0 0 230 140" fill="none" strokeWidth="2" {...rgLine("bendAngle", angleActive)} />
      <text x="235" y="155" {...rgLabel("bendAngle", angleActive)}>
        {labelFor("bendAngle")}
      </text>
      <line x1="130" y1="145" x2="190" y2="145" strokeWidth="1.5" strokeDasharray="4 3" {...rgLine("neutralAxis", neutralActive)} />
      <text x="55" y="158" {...rgLabel("materialThickness", thicknessActive)}>
        {labelFor("materialThickness")}
      </text>
    </svg>
  );
}
