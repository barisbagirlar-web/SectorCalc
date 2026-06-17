"use client";

import type { ReactNode } from "react";
import { formatGeneratedNumericValue } from "@/lib/generated-tools/format-generated-numeric";
import { resolveGeneratedBreakdownLabel } from "@/lib/generated-tools/resolve-generated-display-text";
import {
  resolveBreakdownOutputUnit,
  resolvePrimaryOutputUnit,
} from "@/lib/generated-tools/resolve-output-unit";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";

export type ResultPanelProps = {
  readonly result: GeneratedToolResult | null;
  readonly schema: GeneratedToolSchema;
  readonly locale: string;
  readonly primaryOutputKey: string;
  readonly titleLabel: string;
  readonly emptyLabel: string;
  readonly loading?: boolean;
  readonly statusLabel?: string;
};

function resolvePrimaryNumericValue(
  result: GeneratedToolResult,
  primaryOutputKey: string,
): number | null {
  const candidates = [
    result[primaryOutputKey],
    result.totalWasteCost,
    result.dataConfidenceAdjusted,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }
  return null;
}

function formatPrimaryDisplayValue(
  value: number,
  primaryOutputKey: string,
  unit: string,
  locale: string,
): string {
  if (unit === "%") {
    const asFraction = Math.abs(value) > 1 ? value / 100 : value;
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(asFraction);
  }

  if (unit === "USD" || unit === "EUR" || unit === "TRY") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: unit,
      maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
  }).format(value);
}

function shouldShowSeparateUnit(unit: string): boolean {
  return unit !== "—" && unit !== "%" && unit !== "USD" && unit !== "EUR" && unit !== "TRY";
}

export function ResultPanel({
  result,
  schema,
  locale,
  primaryOutputKey,
  titleLabel,
  emptyLabel,
  loading = false,
  statusLabel,
}: ResultPanelProps) {
  if (loading) {
    return (
      <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
        <div className="sc-premium-dtf-result">
          <div className="animate-pulse space-y-2">
            <div className="mx-auto h-4 w-20 rounded bg-gray-200" />
            <div className="mx-auto h-10 w-28 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
        <div className="sc-premium-dtf-result">
          <div className="sc-premium-dtf-result__title">{emptyLabel}</div>
        </div>
      </div>
    );
  }

  const primaryValue = resolvePrimaryNumericValue(result, primaryOutputKey);
  const unit = resolvePrimaryOutputUnit(schema);
  const formattedPrimary =
    primaryValue !== null
      ? formatPrimaryDisplayValue(primaryValue, primaryOutputKey, unit, locale)
      : null;
  const breakdown = result.breakdown ?? null;
  const showUnitLine = shouldShowSeparateUnit(unit);

  let breakdownSection: ReactNode = null;
  if (breakdown && Object.keys(breakdown).length > 0) {
    breakdownSection = (
      <div className="sc-premium-dtf-result__breakdown">
        {Object.entries(breakdown).map(([key, value]) => {
          if (typeof value !== "number" || !Number.isFinite(value)) {
            return null;
          }
          const breakdownUnit = resolveBreakdownOutputUnit(schema, key);
          const label = resolveGeneratedBreakdownLabel(key, schema.outputs.breakdown, locale);
          const formattedValue = formatGeneratedNumericValue(value, key, locale, breakdownUnit);
          return (
            <div key={key}>
              <span>{label}</span>
              <span>{formattedValue}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (formattedPrimary === null) {
    return (
      <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
        <div className="sc-premium-dtf-result">
          <div className="sc-premium-dtf-result__title">{emptyLabel}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sc-premium-dtf-result-panel sc-premium-dtf-feedback-area">
      <div className="sc-premium-dtf-result sc-premium-dtf-result--pass">
        <div className="sc-premium-dtf-result__title">{titleLabel}</div>
        <div className="sc-premium-dtf-result__value result-value">{formattedPrimary}</div>
        {showUnitLine ? (
          <p className="mt-1 text-sm text-text-secondary">{unit}</p>
        ) : null}
        {statusLabel ? (
          <div className="sc-premium-dtf-result__status">{statusLabel}</div>
        ) : null}
        {breakdownSection}
      </div>
    </div>
  );
}
