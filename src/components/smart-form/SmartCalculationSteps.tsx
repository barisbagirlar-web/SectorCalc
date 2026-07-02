"use client";

import { useTranslations } from "@/lib/i18n-stub";
import type { SmartFormCalculationStep } from "@/lib/features/smart-form/types";

export type SmartCalculationStepsProps = {
  readonly steps: readonly SmartFormCalculationStep[];
};

export function SmartCalculationSteps({ steps }: SmartCalculationStepsProps) {
  const t = useTranslations("freeToolUi");

  if (steps.length === 0) {
    return (
      <p className="text-xs leading-relaxed text-text-secondary">
        {t("calculationStepsEmpty")}
      </p>
    );
  }

  return (
    <details className="rounded-sm border border-border-subtle bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold text-text-primary">
        {t("calculationSteps")}
      </summary>
      <ol className="mt-3 space-y-3">
        {steps.map((step, index) => (
          <li key={step.id} className="text-xs leading-relaxed text-body-charcoal">
            <span className="font-semibold text-text-primary">
              {index + 1}. {step.label}
            </span>
            {step.formulaText ? (
              <p className="mt-1 font-mono text-[11px] text-text-secondary">{step.formulaText}</p>
            ) : null}
            {step.description ? <p className="mt-1">{step.description}</p> : null}
          </li>
        ))}
      </ol>
    </details>
  );
}
