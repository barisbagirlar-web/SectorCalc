"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { evaluateInputGuideDecision } from "@/lib/tool-guides/input-guide-policy";
import { PremiumInputGuideDiagram } from "@/lib/tool-guides/premium-input-guide-diagrams";
import { resolveToolFormInputKeys } from "@/lib/tool-guides/resolve-tool-form-input-keys";

type Props = {
  readonly slug: string;
  readonly locale: string;
  readonly formInputKeys?: readonly string[];
  readonly className?: string;
};

export function PremiumInputGuide({ slug, locale, formInputKeys, className }: Props) {
  const t = useTranslations("inputGuide");
  const keys = useMemo(
    () => formInputKeys ?? resolveToolFormInputKeys(slug),
    [formInputKeys, slug],
  );

  const decision = useMemo(
    () => evaluateInputGuideDecision(slug, keys),
    [slug, keys],
  );

  if (!decision.shouldRender || !decision.spec) {
    return null;
  }

  const titleKey = decision.spec.titleKey.replace(/^inputGuide\./, "");
  const descriptionKey = decision.spec.descriptionKey.replace(/^inputGuide\./, "");

  return (
    <section
      className={`rounded-sm border border-technical-gray/40 bg-premium-surface p-4 sm:p-5 ${className ?? ""}`}
      aria-labelledby={`premium-input-guide-title-${slug}`}
      data-premium-input-guide="true"
      data-premium-input-guide-slug={slug}
      data-premium-input-guide-type={decision.guideType}
    >
      <div className="w-full min-w-0 overflow-x-auto">
        <PremiumInputGuideDiagram spec={decision.spec} locale={locale} />
      </div>
      <h3
        id={`premium-input-guide-title-${slug}`}
        className="mt-4 text-sm font-semibold text-premium-velvet"
      >
        {t(titleKey)}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-body-charcoal">{t(descriptionKey)}</p>
    </section>
  );
}
