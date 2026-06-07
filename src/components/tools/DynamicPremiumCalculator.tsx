"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { stripLocalePrefix } from "@/i18n/locales";
import { trackSectorCalcEvent } from "@/lib/analytics/event-taxonomy";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import {
  BigNumberSummary,
  ExecutiveVerdictBlock,
  LossDriverBreakdown,
  PremiumDecisionReportPreview,
  SuggestedActionSection,
  ThresholdStatusSection,
  buildPremiumDecisionReportData,
} from "@/components/reports/PremiumDecisionReportPreview";
import type {
  PremiumCalculatorSchema,
  SchemaInputValues,
} from "@/lib/premium-schema/premium-calculator-schema";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import type { BenchmarkSnapshotValue } from "@/lib/benchmarks/benchmark-types";
import { usePremiumSchemaEntitlement } from "@/lib/entitlements/use-premium-schema-entitlement";
import { limitPreviewThresholdCount } from "@/lib/entitlements/premium-entitlements";

export interface DynamicPremiumCalculatorProps {
  schema: PremiumCalculatorSchema;
  locale?: string;
}

/**
 * Karar Masası — schema-driven premium UI. Renders only; math in Safe Formula Registry.
 */
export function DynamicPremiumCalculator({ schema, locale: localeProp }: DynamicPremiumCalculatorProps) {
  const intlLocale = useLocale();
  const locale = localeProp ?? intlLocale;
  const pathname = usePathname();
  const attribution = useAttributionContext();
  const pagePath = stripLocalePrefix(pathname);
  const t = useTranslations("premiumDecisionReport");
  const { entitlement, checkoutHref } = usePremiumSchemaEntitlement(schema);
  const isFullReport = entitlement.canViewFullReport;
  const [values, setValues] = useState<SchemaInputValues>(() => buildDefaultSchemaInputs(schema));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackSectorCalcEvent({
      eventName: "premium_analyzer_open",
      locale,
      pagePath,
      premiumSlug: schema.id,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
    });
  }, [
    attribution.utmCampaign,
    attribution.utmMedium,
    attribution.utmSource,
    locale,
    pagePath,
    schema.id,
  ]);

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }
    return runPremiumSchemaEngine(schema, values);
  }, [submitted, schema, values]);

  const reportData = useMemo(() => {
    if (!result) {
      return null;
    }
    return buildPremiumDecisionReportData(schema, result);
  }, [schema, result]);

  const feedbackSnapshots = useMemo(() => {
    if (!result) {
      return null;
    }
    const inputSnapshot: Record<string, BenchmarkSnapshotValue> = {};
    for (const [key, value] of Object.entries(values)) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        inputSnapshot[key] = value;
      }
    }
    const resultSnapshot: Record<string, BenchmarkSnapshotValue> = {
      bigNumber: result.bigNumber.raw,
      p90Exposure: result.p90Exposure,
      minimumSafePrice: result.minimumSafePrice,
    };
    for (const output of result.outputs) {
      resultSnapshot[output.id] = output.raw;
    }
    return { inputSnapshot, resultSnapshot };
  }, [result, values]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="sc-ledger-karar-masasi mt-4">
      {result && reportData ? (
        <div className="sc-ledger-karar-masasi__decision-stack">
          <div className="sc-ledger-karar-masasi__verdict min-w-0" aria-live="polite">
            <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress">
              <ExecutiveVerdictBlock
                verdict={reportData.verdict}
                statusLabel={t(`status.${reportData.verdict.status}`)}
              />
            </div>
          </div>

          <div className="sc-ledger-karar-masasi__big-number min-w-0">
            <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress">
              <BigNumberSummary result={result} meaningLabel={t("whatThisMeans")} />
            </div>
          </div>

          <div className="sc-ledger-karar-masasi__threshold min-w-0">
            <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress p-4 sm:p-5">
              <ThresholdStatusSection
                items={
                  isFullReport
                    ? reportData.thresholdItems
                    : limitPreviewThresholdCount(reportData.thresholdItems, 2)
                }
                title={t("thresholdTitle")}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="sc-ledger-karar-masasi__decision-stack">
          <div className="sc-ledger-karar-masasi__big-number min-w-0">
            <div className="sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-5">
              <p className="sc-ledger-eyebrow">{t("decisionDesk")}</p>
              <p className="mt-2 text-sm text-body-charcoal">{schema.painStatement}</p>
              <p className="mt-4 text-sm text-body-charcoal">{t("runPrompt")}</p>
            </div>
          </div>
        </div>
      )}

      {result && reportData && isFullReport ? (
        <>
          <div className="sc-ledger-karar-masasi__drivers min-w-0 xl:hidden">
            <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress p-4 sm:p-5">
              <LossDriverBreakdown
                result={result}
                title={t("hiddenDriversTitle")}
                intro={t("hiddenDriversIntro")}
              />
            </div>
          </div>

          <div className="sc-ledger-karar-masasi__action min-w-0 xl:hidden">
            <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress p-4 sm:p-5">
              <SuggestedActionSection
                severity={reportData.severity}
                engineAction={result.suggestedAction}
                title={t("suggestedActionTitle")}
                immediateLabel={t("actionImmediate")}
                monitoringLabel={t("actionMonitoring")}
                decisionLabel={t("actionDecision")}
              />
            </div>
          </div>
        </>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="sc-ledger-karar-masasi__entries sc-industrial-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-4 sm:p-5"
        noValidate
      >
        <p className="sc-ledger-eyebrow">{t("ledgerEntries")}</p>
        <h2 className="mt-1 text-base font-semibold text-premium-velvet">{schema.name}</h2>
        <hr className="sc-ledger-divider" />

        {schema.inputs.map((input) => {
          const id = `schema-input-${schema.id}-${input.id}`;
          const value = values[input.id];

          if (input.type === "select" && input.options) {
            return (
              <div key={input.id} className="sc-industrial-field sc-industrial-field--full">
                <div className="sc-industrial-field__label-row">
                  <label htmlFor={id} className="sc-ledger-label sc-industrial-field__label">
                    {input.label}
                  </label>
                  {input.unit ? (
                    <span className="sc-industrial-field__unit">{input.unit}</span>
                  ) : null}
                </div>
                <select
                  id={id}
                  value={String(value ?? "")}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, [input.id]: e.target.value }));
                    setSubmitted(false);
                  }}
                  className="sc-ledger-input-boxed min-h-[44px]"
                >
                  {input.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="sc-ledger-helper sc-industrial-field__helper">{input.helper}</p>
              </div>
            );
          }

          if (input.type === "boolean") {
            return (
              <div key={input.id} className="sc-industrial-field sc-industrial-field--full">
                <label className="flex min-h-[44px] items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, [input.id]: e.target.checked }));
                      setSubmitted(false);
                    }}
                  />
                  <span className="text-sm text-premium-velvet">{input.label}</span>
                </label>
                <p className="sc-ledger-helper sc-industrial-field__helper">{input.helper}</p>
              </div>
            );
          }

          return (
            <div key={input.id} className="sc-industrial-field sc-industrial-field--full">
              <div className="sc-industrial-field__label-row">
                <label htmlFor={id} className="sc-ledger-label sc-industrial-field__label">
                  {input.label}
                </label>
                {input.unit ? (
                  <span className="sc-industrial-field__unit">{input.unit}</span>
                ) : null}
              </div>
              <input
                id={id}
                type={input.type === "slider" ? "range" : "text"}
                inputMode="decimal"
                min={input.validation?.min}
                max={input.validation?.max}
                step={input.validation?.step}
                value={String(value ?? "")}
                onChange={(e) => {
                  if (input.type === "slider") {
                    setValues((prev) => ({ ...prev, [input.id]: Number(e.target.value) }));
                  } else {
                    const { numeric } = handleNumericInputChange(e.target.value);
                    setValues((prev) => ({ ...prev, [input.id]: numeric }));
                  }
                  setSubmitted(false);
                }}
                className="sc-ledger-input-boxed sc-industrial-input min-h-[44px]"
              />
              <p className="sc-ledger-helper sc-industrial-field__helper">{input.helper}</p>
            </div>
          );
        })}

        <div className="sc-industrial-form-actions">
          <button type="submit" className="sc-ledger-cta-primary sc-cta-primary min-h-[44px]">
            {t("runAnalysis")}
          </button>
        </div>
      </form>

      <div className="sc-ledger-karar-masasi__report min-w-0">
        {result ? (
          <>
            <PremiumDecisionReportPreview
              schema={schema}
              result={result}
              locale={locale}
              compact
              entitlement={entitlement}
              checkoutHref={checkoutHref}
            />
            {feedbackSnapshots ? (
              <PremiumReportFeedback
                schemaSlug={schema.id}
                sectorSlug={schema.sectorSlug}
                reportSlug={schema.id}
                inputSnapshot={feedbackSnapshots.inputSnapshot}
                resultSnapshot={feedbackSnapshots.resultSnapshot}
              />
            ) : null}
          </>
        ) : (
          <aside className="sc-ledger-panel sc-industrial-panel p-4 sm:p-5">
            <p className="sc-ledger-eyebrow">Premium analyzer</p>
            <p className="mt-2 text-xs text-body-charcoal">{schema.painStatement}</p>
          </aside>
        )}
      </div>
    </div>
  );
}
