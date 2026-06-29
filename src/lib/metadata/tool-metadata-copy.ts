/* eslint-disable */
// @ts-nocheck

import type { AppLocale } from "@/i18n/routing";

type ToolTier = "free" | "premium";

const TOOL_TIER_LABEL: Record<AppLocale, Record<ToolTier, string>> = {
  en: { free: "Free", premium: "Premium" },
  tr: { free: "Ücretsiz", premium: "Premium" },
  de: { free: "Kostenlos", premium: "Premium" },
  fr: { free: "Gratuit", premium: "Premium" },
  es: { free: "Gratis", premium: "Premium" },
  ar: { free: "مجاني", premium: "مميز" },
};

function buildToolDescription(
  locale: AppLocale,
  tierLabel: string,
  toolTitle: string,
  sectorName: string,
): string {
  const title = toolTitle.toLowerCase();
  const sector = sectorName.toLowerCase();

  switch (locale) {
    case "tr":
      return `${sectorName} için ${tierLabel.toLowerCase()} hesaplama aracı. Maliyetleri hesaplayın, kayıpları tespit edin ve karar raporu alın.`;
    case "de":
      return `${tierLabel}-Rechner für ${sectorName}. Kosten berechnen, Verluste erkennen und belastbare Entscheidungsberichte erhalten.`;
    case "fr":
      return `Calculateur ${tierLabel.toLowerCase()} pour ${sectorName}. Calculez les coûts, détectez les pertes et obtenez des rapports de décision.`;
    case "es":
      return `Calculadora ${tierLabel.toLowerCase()} para ${sectorName}. Calcule costos, detecte pérdidas y obtenga informes de decisión.`;
    case "ar":
      return `أداة ${tierLabel} لقطاع ${sectorName}. احسب التكاليف، اكتشف الخسائر، واحصل على تقارير قرار موثوقة.`;
    default:
      return `${tierLabel} ${title} for ${sector}. Calculate costs, detect losses, and get expert-level decision reports.`;
  }
}

export function resolveToolTierLabel(locale: AppLocale, tier: ToolTier): string {
  return TOOL_TIER_LABEL[locale][tier];
}

export function resolveToolMetadataDescription(
  locale: AppLocale,
  tier: ToolTier,
  toolTitle: string,
  sectorName: string,
): string {
  const tierLabel = resolveToolTierLabel(locale, tier);
  return buildToolDescription(locale, tierLabel, toolTitle, sectorName);
}
