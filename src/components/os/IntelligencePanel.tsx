"use client";

import { Flame, ShieldAlert, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { regionalFormatLocale, getRegionProfile } from "@/config/regions";
import { useRegion } from "@/lib/compliance/region-context";
import {
  MANUFACTURING_OS_I18N_NS,
  smartModulesToExpertFeatures,
  type SmartModuleId,
} from "@/lib/os/registry/sectors";
import type { SectorIntelligenceResult } from "@/lib/os/core/intelligence-layer";

export interface IntelligencePanelProps {
  intelligence: SectorIntelligenceResult;
  features: readonly SmartModuleId[];
  className?: string;
}

function formatCurrency(value: number, locale: string, region: ReturnType<typeof useRegion>["region"]): string {
  const { currency } = getRegionProfile(region);
  const formatLocale = regionalFormatLocale(region, locale);
  return value.toLocaleString(formatLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

function formatCarbon(value: number, locale: string): string {
  const base = locale.split("-")[0] ?? "en";
  const map: Record<string, string> = {
    en: "en-US",
    tr: "tr-TR",
    de: "de-DE",
    es: "es-ES",
    ar: "ar-SA",
  };
  const formatLocale = map[base] ?? locale;
  return `${value.toLocaleString(formatLocale, { maximumFractionDigits: 1 })} kg CO₂e`;
}

export function IntelligencePanel({
  intelligence,
  features,
  className = "",
}: IntelligencePanelProps) {
  const locale = useLocale();
  const { region } = useRegion();
  const t = useTranslations(MANUFACTURING_OS_I18N_NS);
  const expertFeatures = smartModulesToExpertFeatures(features);
  const isActionRequired = intelligence.actionPlan.code === "IMMEDIATE_CALIBRATION";

  const showHiddenLoss =
    expertFeatures.hiddenLoss === true || expertFeatures.deadhead === true;
  const showCarbon =
    expertFeatures.energyOpt === true || expertFeatures.carbonCbam === true;
  const showDecisionSupport = expertFeatures.decisionSupport === true;

  const metricCount =
    (showHiddenLoss ? 1 : 0) + (showCarbon ? 1 : 0) + (showDecisionSupport ? 1 : 0);

  if (metricCount === 0 && features.length === 0) {
    return null;
  }

  return (
    <div
      className={`mt-6 border border-technical-gray bg-white p-6 font-sans ${className}`.trim()}
    >
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-body-charcoal" aria-hidden />
        <h3 className="label-badge text-body-charcoal">{t("intelligencePanel.title")}</h3>
      </div>

      {metricCount > 0 ? (
        <div
          className={`grid gap-4 ${
            metricCount === 3
              ? "sm:grid-cols-3"
              : metricCount === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-1"
          }`}
        >
          {showHiddenLoss ? (
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase text-body-charcoal">
                <ShieldAlert className="h-3 w-3" aria-hidden />
                {expertFeatures.deadhead
                  ? t("intelligencePanel.deadheadLoss")
                  : t("intelligencePanel.hiddenLoss")}
              </div>
              <div className="data-value text-lg font-bold text-premium-velvet">
                {formatCurrency(intelligence.hiddenLoss, locale, region)}
              </div>
            </div>
          ) : null}

          {showCarbon ? (
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase text-body-charcoal">
                <Flame className="h-3 w-3" aria-hidden />
                {t("intelligencePanel.carbonImpact")}
              </div>
              <div className="data-value text-lg font-bold text-premium-velvet">
                {formatCarbon(intelligence.carbonImpact, locale)}
              </div>
            </div>
          ) : null}

          {showDecisionSupport ? (
            <div>
              <span className="text-[10px] uppercase text-body-charcoal">
                {t("intelligencePanel.actionPlan")}
              </span>
              <div
                className={`mt-1 text-xs font-bold uppercase tracking-wider ${
                  isActionRequired ? "text-crit-red status-crit" : "text-safe-green status-safe"
                }`}
              >
                {isActionRequired
                  ? t("intelligencePanel.actionRequired")
                  : t("intelligencePanel.monitorOptimal")}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {showDecisionSupport ? (
        <p className="mt-4 text-xs leading-relaxed text-body-charcoal">
          {isActionRequired
            ? t("intelligencePanel.actionRequiredDetail")
            : t("intelligencePanel.monitorOptimalDetail")}
        </p>
      ) : null}

      {features.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {features.map((moduleId) => (
            <span
              key={moduleId}
              className="border border-technical-gray px-2 py-1 text-[10px] uppercase tracking-wider text-body-charcoal"
              title={t(`smartModules.${moduleId}`)}
            >
              {t(`smartModules.${moduleId}`)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
