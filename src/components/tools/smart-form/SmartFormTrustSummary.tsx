"use client";

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
  return (
    <aside
      className="rounded border border-border-subtle bg-surface-muted p-3"
      data-component-kind="smart_form_trust_summary"
      aria-label="Smart form trust summary"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Contract-driven form
      </p>
      <p className="mt-1 text-sm text-text-primary">{decisionGoal}</p>
      {assumptions.length > 0 ? (
        <p className="mt-2 text-xs text-text-secondary">
          {assumptions.length} governed assumption{assumptions.length === 1 ? "" : "s"} ·{" "}
          {validationRuleCount} validation rule{validationRuleCount === 1 ? "" : "s"}
        </p>
      ) : (
        <p className="mt-2 text-xs text-text-secondary">
          {validationRuleCount} validation rule{validationRuleCount === 1 ? "" : "s"} active
        </p>
      )}
    </aside>
  );
}
