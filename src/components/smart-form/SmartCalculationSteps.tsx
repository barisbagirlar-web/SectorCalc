"use client";

import type { SmartFormCalculationStep } from "@/lib/smart-form/types";

export type SmartCalculationStepsProps = {
  readonly steps: readonly SmartFormCalculationStep[];
};

export function SmartCalculationSteps({ steps }: SmartCalculationStepsProps) {
  if (steps.length === 0) {
    return (
      <p className="text-xs leading-relaxed text-text-secondary">
        Calculation steps will appear when this contract exposes deterministic trace.
      </p>
    );
  }

  return (
    <details className="rounded-sm border border-border-subtle bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold text-text-primary">
        Calculation steps
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
