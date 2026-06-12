import {
  GUIDANCE_COLORS,
  isGraphicFieldActive,
  rgLabel,
  rgLine,
  rgShape,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function OeeFlowGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const plannedActive =
    isGraphicFieldActive("plannedHours", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("runtime", activeFieldKey, fieldMap);
  const runActive =
    isGraphicFieldActive("availability", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("runHours", activeFieldKey, fieldMap);
  const productionActive =
    isGraphicFieldActive("performance", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("totalProduction", activeFieldKey, fieldMap);
  const qualityActive =
    isGraphicFieldActive("quality", activeFieldKey, fieldMap) ||
    isGraphicFieldActive("goodParts", activeFieldKey, fieldMap);
  const downtimeActive = isGraphicFieldActive("downtimeHours", activeFieldKey, fieldMap);
  const slowActive = isGraphicFieldActive("performance", activeFieldKey, fieldMap);
  const scrapActive = isGraphicFieldActive("scrapRate", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 240" className="grg-svg" role="img" data-template="oee-flow">
      <rect x="24" y="48" width="72" height="44" rx="4" {...rgShape("plannedHours", plannedActive)} fill={GUIDANCE_COLORS.surface} stroke={GUIDANCE_COLORS.border} />
      <text x="32" y="74" {...rgLabel("plannedHours", plannedActive)}>{labelFor("plannedHours")}</text>
      <line x1="96" y1="70" x2="118" y2="70" strokeWidth="2" {...rgLine("availability", runActive)} />
      <rect x="118" y="48" width="72" height="44" rx="4" {...rgShape("availability", runActive)} fill={GUIDANCE_COLORS.softFill} stroke={GUIDANCE_COLORS.border} />
      <text x="126" y="74" {...rgLabel("availability", runActive)}>{labelFor("availability")}</text>
      <line x1="190" y1="70" x2="212" y2="70" strokeWidth="2" {...rgLine("performance", productionActive)} />
      <rect x="212" y="48" width="84" height="44" rx="4" {...rgShape("performance", productionActive)} fill={GUIDANCE_COLORS.softOrange} stroke={GUIDANCE_COLORS.border} />
      <text x="220" y="74" {...rgLabel("performance", productionActive)}>{labelFor("performance")}</text>
      <line x1="150" y1="92" x2="150" y2="118" strokeWidth="2" {...rgLine("quality", qualityActive)} />
      <rect x="108" y="118" width="84" height="44" rx="4" {...rgShape("quality", qualityActive)} fill={GUIDANCE_COLORS.softFill} stroke={GUIDANCE_COLORS.active} />
      <text x="116" y="144" {...rgLabel("quality", qualityActive)}>{labelFor("quality")}</text>
      <rect x="24" y="178" width="88" height="36" rx="4" {...rgShape("downtimeHours", downtimeActive)} fill={GUIDANCE_COLORS.surface} stroke={GUIDANCE_COLORS.border} />
      <text x="32" y="200" {...rgLabel("downtimeHours", downtimeActive)}>{labelFor("downtimeHours")}</text>
      <rect x="118" y="178" width="88" height="36" rx="4" {...rgShape("performance", slowActive)} fill={GUIDANCE_COLORS.surface} stroke={GUIDANCE_COLORS.border} />
      <text x="126" y="200" {...rgLabel("performance", slowActive)}>{labelFor("cycleTime")}</text>
      <rect x="212" y="178" width="84" height="36" rx="4" {...rgShape("scrapRate", scrapActive)} fill={GUIDANCE_COLORS.surface} stroke={GUIDANCE_COLORS.border} />
      <text x="220" y="200" {...rgLabel("scrapRate", scrapActive)}>{labelFor("quality")}</text>
    </svg>
  );
}
