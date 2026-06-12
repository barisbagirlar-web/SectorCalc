import {
  GUIDANCE_COLORS,
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function VolumeGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const lengthActive = isGraphicFieldActive("length", activeFieldKey, fieldMap);
  const widthActive = isGraphicFieldActive("width", activeFieldKey, fieldMap);
  const heightActive =
    isGraphicFieldActive("height", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("depth", activeFieldKey, fieldMap);
  const volumeActive = isGraphicFieldActive("volume", activeFieldKey, fieldMap);
  const verticalLabel = Object.values(fieldMap).includes("depth")
    ? labelFor("depth")
    : labelFor("height");

  return (
    <svg viewBox="0 0 320 240" className="grg-svg" role="img">
      <polygon points="70,90 190,90 210,70 90,70" fill={GUIDANCE_COLORS.softFill} stroke={GUIDANCE_COLORS.border} />
      <polygon points="70,90 190,90 190,180 70,180" fill={GUIDANCE_COLORS.surface} stroke={GUIDANCE_COLORS.border} />
      <polygon points="190,90 210,70 210,160 190,180" fill={GUIDANCE_COLORS.softOrange} stroke={GUIDANCE_COLORS.border} />
      <line x1="70" y1="195" x2="190" y2="195" className={dimClass(lengthActive)} strokeWidth="2" />
      <text x="120" y="212" className={labelClass(lengthActive)}>{labelFor("length")}</text>
      <line x1="200" y1="90" x2="200" y2="180" className={dimClass(widthActive)} strokeWidth="2" />
      <text x="208" y="140" className={labelClass(widthActive)}>{labelFor("width")}</text>
      <line x1="55" y1="90" x2="55" y2="180" className={dimClass(heightActive)} strokeWidth="2" />
      <text x="20" y="140" className={labelClass(heightActive)}>{verticalLabel}</text>
      <rect
        x="230"
        y="100"
        width="60"
        height="60"
        rx="4"
        fill={volumeActive ? GUIDANCE_COLORS.softFill : "none"}
        stroke={volumeActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.mutedLine}
        className={volumeActive ? "grg-region grg-region--active" : "grg-region"}
      />
      <text x="238" y="135" className={labelClass(volumeActive)}>{labelFor("volume")}</text>
    </svg>
  );
}
