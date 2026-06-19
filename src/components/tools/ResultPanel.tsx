"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  calculateCBAM,
  resolveCarbonEmissionsKg,
  schemaCbamEnabled,
} from "@/lib/cbam/compliance";
import { formatGeneratedNumericValue } from "@/lib/generated-tools/format-generated-numeric";
import { resolveGeneratedBreakdownLabel } from "@/lib/generated-tools/resolve-generated-display-text";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import {
  resolveBreakdownOutputUnit,
  resolvePrimaryOutputUnit,
} from "@/lib/generated-tools/resolve-output-unit";
import type { GeneratedToolResult, GeneratedToolSchema } from "@/lib/generated-tools/types";
import type { FeedbackSnapshotValue } from "@/lib/feedback/types";

export type ResultPanelProps = {
  readonly result: GeneratedToolResult | null;
  readonly schema: GeneratedToolSchema;
  readonly locale: string;
  readonly primaryOutputKey: string;
  readonly titleLabel: string;
  readonly emptyLabel: string;
  readonly loading?: boolean;
  readonly statusLabel?: string;
  readonly toolSlug?: string;
  readonly userId?: string | null;
  readonly enableEnterpriseActions?: boolean;
  readonly routePath?: string;
  readonly toolType?: "free" | "premium";
  readonly inputSnapshot?: Readonly<Record<string, FeedbackSnapshotValue>>;
  readonly onPrintReport?: () => void;
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

  if (unit && unit !== "—") {
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
    }).format(value);
    return `${formatted} ${unit}`;
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
  }).format(value);
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
  toolSlug,
  userId,
  enableEnterpriseActions,
  routePath,
  toolType = "premium",
  inputSnapshot,
  onPrintReport,
}: ResultPanelProps) {

  const showEnterpriseActions =
    enableEnterpriseActions ?? schema.premiumRequired === true;

  const carbonEmissionsKg = useMemo(
    () => (result ? resolveCarbonEmissionsKg(result as Record<string, unknown>) : null),
    [result],
  );

  const cbamReport = useMemo(() => {
    if (!carbonEmissionsKg) {
      return null;
    }
    const carbonTool =
      schemaCbamEnabled(schema) || /carbon|co2|emission|cbam/i.test(schema.toolName);
    if (!carbonTool) {
      return null;
    }
    return calculateCBAM(carbonEmissionsKg, "DE");
  }, [carbonEmissionsKg, schema]);


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
        <div className="sc-premium-dtf-result__value sc-result-nowrap result-value">{formattedPrimary}</div>
        {statusLabel ? (
          <div className="sc-premium-dtf-result__status">{statusLabel}</div>
        ) : null}
        {breakdownSection}
        {cbamReport ? (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-sm">
            <p className="font-semibold text-slate-800">
              {translateCalculatorPhrase("CBAM Compliance Summary", locale)}
            </p>
            <dl className="mt-2 space-y-1 text-slate-600">
              <div className="flex justify-between gap-3">
                <dt>{translateCalculatorPhrase("Carbon Footprint", locale)}</dt>
                <dd className="sc-result-nowrap">{cbamReport.productCarbonFootprint.toFixed(0)} kg CO2e</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{translateCalculatorPhrase("CBAM Adjustment", locale)}</dt>
                <dd className="sc-result-nowrap">
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(cbamReport.cbamAdjustment)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{translateCalculatorPhrase("Status", locale)}</dt>
                <dd className="sc-result-nowrap capitalize">{translateCalculatorPhrase(cbamReport.complianceStatus, locale)}</dd>
              </div>
            </dl>
            {cbamReport.recommendations.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-xs text-slate-500">
                {cbamReport.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        {showEnterpriseActions && onPrintReport ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPrintReport}
              className="sc-ledger-cta-primary min-h-[44px] px-4 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>⬇</span> {translateCalculatorPhrase("Print Full Report", locale)}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
