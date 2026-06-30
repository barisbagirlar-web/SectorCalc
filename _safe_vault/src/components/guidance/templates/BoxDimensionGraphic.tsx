import {
  GUIDANCE_COLORS,
  isGraphicFieldActive,
  labelClass,
  rgLabel,
  rgLine,
  rgShape,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function BoxDimensionGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const lengthActive = isGraphicFieldActive("length", activeFieldKey, fieldMap);
  const widthActive = isGraphicFieldActive("width", activeFieldKey, fieldMap);
  const heightActive =
    isGraphicFieldActive("height", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("depth", activeFieldKey, fieldMap);
  const volumeActive = isGraphicFieldActive("volume", activeFieldKey, fieldMap);
  const verticalCanonical = Object.values(fieldMap).includes("depth") ? "depth" : "height";
  const verticalLabel = labelFor(verticalCanonical);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img" data-template="box-dimension">
      <rect
        x="40"
        y="70"
        width="160"
        height="100"
        fill={GUIDANCE_COLORS.softFill}
        stroke={GUIDANCE_COLORS.border}
        strokeWidth="1.5"
        {...rgShape("volume", volumeActive)}
      />
      <line x1="40" y1="180" x2="200" y2="180" strokeWidth="2" markerEnd="url(#grg-arrow-box)" {...rgLine("length", lengthActive)} />
      <text x="120" y="198" {...rgLabel("length", lengthActive)}>
        {labelFor("length")}
      </text>
      <line x1="210" y1="70" x2="210" y2="170" strokeWidth="2" {...rgLine("width", widthActive)} />
      <text x="218" y="125" {...rgLabel("width", widthActive)}>
        {labelFor("width")}
      </text>
      <line x1="200" y1="60" x2="200" y2="70" strokeWidth="2" {...rgLine(verticalCanonical, heightActive)} />
      <line x1="40" y1="60" x2="200" y2="60" strokeWidth="2" markerEnd="url(#grg-arrow-box)" {...rgLine(verticalCanonical, heightActive)} />
      <text x="115" y="52" {...rgLabel(verticalCanonical, heightActive)}>
        {verticalLabel}
      </text>
      <defs>
        <marker id="grg-arrow-box" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}
