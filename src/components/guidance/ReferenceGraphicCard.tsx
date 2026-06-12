"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GuidedReferenceGraphic } from "@/components/guidance/GuidedReferenceGraphic";
import { useGuidanceContext } from "@/components/guidance/GuidanceContext";
import type { AppLocale } from "@/i18n/routing";

export function ReferenceGraphicCard() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("guidance.inputGuide");
  const ctx = useGuidanceContext();

  const activeLabel = useMemo(() => {
    if (!ctx?.activeFieldKey) {
      return null;
    }
    return ctx.fieldLabels[ctx.activeFieldKey] ?? ctx.activeFieldKey;
  }, [ctx?.activeFieldKey, ctx?.fieldLabels]);

  if (!ctx?.resolvedGraphic) {
    return null;
  }

  return (
    <aside
      className="guided-reference reference-graphic-card grg-card"
      data-guided-reference="true"
      data-reference-graphic={ctx.resolvedGraphic.template}
      data-confidence={ctx.resolvedGraphic.confidence}
      aria-label={t("title")}
    >
      <header className="grg-card__header">
        <h3 className="grg-card__title">{t("title")}</h3>
        <p className="grg-card__description">{t("description")}</p>
      </header>
      <div className="grg-card__graphic">
        <GuidedReferenceGraphic
          resolvedGraphic={ctx.resolvedGraphic}
          activeFieldKey={ctx.activeFieldKey}
          locale={locale}
        />
      </div>
      {activeLabel ? (
        <p className="grg-card__active" data-active-field="true">
          {t("activeField", { fieldLabel: activeLabel })}
        </p>
      ) : null}
    </aside>
  );
}
