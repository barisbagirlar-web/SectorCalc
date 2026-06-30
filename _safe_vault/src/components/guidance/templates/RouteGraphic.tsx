import {
  GUIDANCE_COLORS,
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function RouteGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const distanceActive = isGraphicFieldActive("distance", activeFieldKey, fieldMap);
  const fuelActive = isGraphicFieldActive("fuel", activeFieldKey, fieldMap);
  const stopsActive = isGraphicFieldActive("stops", activeFieldKey, fieldMap);
  const costActive = isGraphicFieldActive("routeCost", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      <circle cx="60" cy="110" r="10" fill={GUIDANCE_COLORS.line} />
      <circle cx="160" cy="70" r="8" fill={stopsActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.mutedLine} className={stopsActive ? "grg-region grg-region--active" : "grg-region"} />
      <circle cx="260" cy="120" r="10" fill={GUIDANCE_COLORS.line} />
      <path d="M70 108 Q120 40 155 72 T250 115" fill="none" className={dimClass(distanceActive)} strokeWidth="2.5" />
      <text x="125" y="42" className={labelClass(distanceActive)}>{labelFor("distance")}</text>
      <rect x="40" y="165" width="70" height="28" rx="4" fill={fuelActive ? GUIDANCE_COLORS.softFill : "none"} stroke={fuelActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border} />
      <text x="52" y="183" className={labelClass(fuelActive)}>{labelFor("fuel")}</text>
      <text x="200" y="185" className={labelClass(stopsActive)}>{labelFor("stops")}</text>
      <text x="230" y="60" className={labelClass(costActive)}>{labelFor("cost")}</text>
    </svg>
  );
}
