"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { resolveDecisionEngineContext } from "@/lib/features/decision-engine/decision-engine-resolver";
import { resolveDisclaimer } from "@/lib/content/disclaimer/disclaimer-resolver";

type UsageAgreementNoticeProps = {
  readonly toolSlug: string;
  readonly tier?: "free" | "premium" | "premium-schema";
  readonly sector?: string;
  readonly category?: string;
  readonly region?: string;
};

export function UsageAgreementNotice({
  toolSlug,
  tier = "free",
  sector,
  category,
  region,
}: UsageAgreementNoticeProps) {
  const locale = useLocale();
  const t = useTranslations("disclaimer");

  const resolved = useMemo(() => {
    const ctx = resolveDecisionEngineContext({
      toolSlug,
      locale,
      tier,
      sector,
      category,
      region,
    });
    return resolveDisclaimer({
      archetype: ctx.caseState.archetype,
      decisionLevel: ctx.caseState.decisionLevel,
      riskLevel: ctx.caseState.riskLevel,
    });
  }, [toolSlug, locale, tier, sector, category, region]);

  if (!resolved.showUsageAgreement) {
    return null;
  }

  const titleKey = resolved.titleKey.replace("disclaimer.", "") as "standard.title" | "elevated.title" | "engineering.title";
  const bodyKey = resolved.bodyKey.replace("disclaimer.", "") as "standard.body" | "elevated.body" | "engineering.body";

  return (
    <aside
      className="rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-xs leading-relaxed text-slate-700"
      data-usage-agreement-notice="true"
      data-disclaimer-depth={resolved.depth}
    >
      <p className="font-semibold text-slate-900">{t(titleKey)}</p>
      <p className="mt-1">{t(bodyKey)}</p>
    </aside>
  );
}
