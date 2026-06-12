import {
  GUIDANCE_COLORS,
  isGraphicFieldActive,
  rgLabel,
  rgLine,
  rgShape,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function AreaGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const lengthActive = isGraphicFieldActive("length", activeFieldKey, fieldMap);
  const widthActive = isGraphicFieldActive("width", activeFieldKey, fieldMap);
  const heightActive = isGraphicFieldActive("height", activeFieldKey, fieldMap);
  const areaActive = isGraphicFieldActive("area", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img" data-template="wall-area">
      <rect
        x="60"
        y="60"
        width="180"
        height="110"
        fill={areaActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.softOrange}
        stroke={areaActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        strokeWidth={areaActive ? 2 : 1.5}
        {...rgShape("area", areaActive)}
      />
      <line x1="60" y1="185" x2="240" y2="185" strokeWidth="2" {...rgLine("length", lengthActive)} />
      <text x="145" y="202" {...rgLabel("length", lengthActive)}>
        {labelFor("length")}
      </text>
      <line x1="250" y1="60" x2="250" y2="170" strokeWidth="2" {...rgLine("height", heightActive || widthActive)} />
      <text x="258" y="120" {...rgLabel("height", heightActive || widthActive)}>
        {labelFor("height")}
      </text>
      <text x="130" y="120" {...rgLabel("area", areaActive)}>
        {labelFor("area")}
      </text>
    </svg>
  );
}
