"use client";

import type { ReactNode } from "react";
import { SmartCalculationSteps } from "@/components/smart-form/SmartCalculationSteps";
import type { SmartFormCalculationStep, SmartFormResult } from "@/lib/smart-form/types";

export type SmartResultPanelProps = {
  readonly result?: SmartFormResult | null;
  readonly calculationSteps?: readonly SmartFormCalculationStep[];
  readonly trustTraceSlot?: ReactNode;
  readonly children?: ReactNode;
  readonly exportPlaceholder?: string;
  readonly verifyPlaceholder?: string;
};

const STATUS_CLASS: Record<NonNullable<SmartFormResult["status"]>, string> = {
  safe: "text-safe-green",
  watch: "text-watch-amber",
  danger: "text-crit-red",
  neutral: "text-text-primary",
};

export function SmartResultPanel({
  result,
  calculationSteps = [],
  trustTraceSlot,
  children,
  exportPlaceholder = "PDF export uses existing entitlement and report pipeline.",
  verifyPlaceholder = "Verification link will appear when report verification is enabled for this tool.",
}: SmartResultPanelProps) {
  return (
    <section className="sc-smart-form-output sc-ledger-panel sc-industrial-panel min-w-0 space-y-4 rounded-sm border border-border-subtle bg-white p-4 sm:p-5">
      <header>
        <p className="sc-ledger-eyebrow text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Decision output
        </p>
        {result?.primaryLabel && result.primaryValue ? (
          <div className="mt-2">
            <p className="text-xs text-text-secondary">{result.primaryLabel}</p>
            <p
              className={`sc-ledger-big-number text-2xl font-bold ${result.status ? STATUS_CLASS[result.status] : "text-text-primary"}`}
            >
              {result.primaryValue}
            </p>
          </div>
        ) : null}
      </header>

      {result?.secondaryMetrics && result.secondaryMetrics.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {result.secondaryMetrics.map((metric) => (
            <div key={metric.id} className="rounded-sm border border-border-subtle bg-off-white p-3">
              <p className="text-[11px] text-text-secondary">{metric.label}</p>
              <p className={`text-sm font-semibold ${metric.tone ? STATUS_CLASS[metric.tone] : "text-text-primary"}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {result?.actionRecommendation ? (
        <p className="rounded-sm border border-border-subtle bg-off-white p-3 text-sm text-body-charcoal">
          {result.actionRecommendation}
        </p>
      ) : null}

      {children}

      <SmartCalculationSteps steps={calculationSteps} />

      {trustTraceSlot ? (
        <div data-smart-form-trust-trace="true" className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Trust trace
          </p>
          {trustTraceSlot}
        </div>
      ) : null}

      <div className="grid gap-2 border-t border-border-subtle pt-3 text-xs text-text-secondary md:grid-cols-2">
        <p><strong className="text-text-primary">Export:</strong> {exportPlaceholder}</p>
        <p><strong className="text-text-primary">Verify:</strong> {verifyPlaceholder}</p>
      </div>
    </section>
  );
}
