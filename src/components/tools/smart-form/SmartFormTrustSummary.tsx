"use client";

import { useTranslations } from "next-intl";

type SmartFormTrustSummaryProps = {
  readonly decisionGoal: string;
  readonly assumptions: readonly string[];
  readonly validationRuleCount: number;
};

export function SmartFormTrustSummary({
  decisionGoal,
  assumptions,
  validationRuleCount,
}: SmartFormTrustSummaryProps) {
  const t = useTranslations("freeToolUi");

  return (
    <aside
      className="rounded border border-border-subtle bg-surface-muted p-3"
      data-component-kind="smart_form_trust_summary"
      aria-label={t("contractFormTrustAria")}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {t("contractFormEyebrow")}
      </p>
      <p className="mt-1 text-sm text-text-primary">{decisionGoal}</p>
      {assumptions.length > 0 ? (
        <p className="mt-2 text-xs text-text-secondary">
          {t("contractFormAssumptionsRules", {
            assumptionCount: assumptions.length,
            ruleCount: validationRuleCount,
          })}
        </p>
      ) : (
        <p className="mt-2 text-xs text-text-secondary">
          {t("contractFormRulesOnly", { ruleCount: validationRuleCount })}
        </p>
      )}
    </aside>
  );
}
