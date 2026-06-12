import {
  GUIDANCE_COLORS,
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function BendRadiusGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const thicknessActive = isGraphicFieldActive("materialThickness", activeFieldKey, fieldMap);
  const radiusActive = isGraphicFieldActive("insideRadius", activeFieldKey, fieldMap);
  const angleActive = isGraphicFieldActive("bendAngle", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      <path d="M60 170 H200" stroke={GUIDANCE_COLORS.line} strokeWidth="8" className={thicknessActive ? "grg-region grg-region--active" : "grg-region"} />
      <path d="M200 170 A70 70 0 0 0 270 100" fill="none" stroke={GUIDANCE_COLORS.line} strokeWidth="8" />
      <line x1="200" y1="170" x2="200" y2="100" className={dimClass(radiusActive)} strokeWidth="2" strokeDasharray="3 3" />
      <text x="175" y="145" className={labelClass(radiusActive)}>{labelFor("radius")}</text>
      <path d="M200 170 A40 40 0 0 0 230 140" fill="none" className={dimClass(angleActive)} strokeWidth="2" />
      <text x="235" y="155" className={labelClass(angleActive)}>{labelFor("angle")}</text>
      <text x="55" y="158" className={labelClass(thicknessActive)}>{labelFor("thickness")}</text>
    </svg>
  );
}
