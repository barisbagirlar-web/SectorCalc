import {
  GUIDANCE_COLORS,
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function AreaGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const lengthActive = isGraphicFieldActive("length", activeFieldKey, fieldMap);
  const widthActive = isGraphicFieldActive("width", activeFieldKey, fieldMap);
  const areaActive = isGraphicFieldActive("area", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      <rect
        x="60"
        y="60"
        width="180"
        height="110"
        fill={areaActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.softOrange}
        stroke={areaActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        strokeWidth={areaActive ? 2 : 1.5}
        className={areaActive ? "grg-region grg-region--active" : "grg-region"}
      />
      <line x1="60" y1="185" x2="240" y2="185" className={dimClass(lengthActive)} strokeWidth="2" />
      <text x="145" y="202" className={labelClass(lengthActive)}>{labelFor("length")}</text>
      <line x1="250" y1="60" x2="250" y2="170" className={dimClass(widthActive)} strokeWidth="2" />
      <text x="258" y="120" className={labelClass(widthActive)}>{labelFor("width")}</text>
      <text x="130" y="120" className={labelClass(areaActive)}>{labelFor("area")}</text>
    </svg>
  );
}
