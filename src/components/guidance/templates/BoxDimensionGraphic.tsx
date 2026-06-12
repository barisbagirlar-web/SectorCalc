import {
  GUIDANCE_COLORS,
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function BoxDimensionGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const lengthActive = isGraphicFieldActive("length", activeFieldKey, fieldMap);
  const widthActive = isGraphicFieldActive("width", activeFieldKey, fieldMap);
  const heightActive =
    isGraphicFieldActive("height", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("depth", activeFieldKey, fieldMap);
  const verticalLabel = Object.values(fieldMap).includes("depth")
    ? labelFor("depth")
    : labelFor("height");

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img" aria-labelledby="grg-box-title">
      <title id="grg-box-title">{labelFor("length")}</title>
      <rect x="40" y="70" width="160" height="100" fill={GUIDANCE_COLORS.softFill} stroke={GUIDANCE_COLORS.border} strokeWidth="1.5" />
      <line x1="40" y1="180" x2="200" y2="180" className={dimClass(lengthActive)} strokeWidth="2" markerEnd="url(#grg-arrow)" />
      <text x="120" y="198" className={labelClass(lengthActive)}>{labelFor("length")}</text>
      <line x1="210" y1="70" x2="210" y2="170" className={dimClass(widthActive)} strokeWidth="2" />
      <text x="218" y="125" className={labelClass(widthActive)}>{labelFor("width")}</text>
      <line x1="200" y1="60" x2="200" y2="70" className={dimClass(heightActive)} strokeWidth="2" />
      <line x1="40" y1="60" x2="200" y2="60" className={dimClass(heightActive)} strokeWidth="2" markerEnd="url(#grg-arrow)" />
      <text x="115" y="52" className={labelClass(heightActive)}>{verticalLabel}</text>
      <defs>
        <marker id="grg-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}
