"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { stripLocalePrefix } from "@/i18n/locales";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
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
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import type { BenchmarkSnapshotValue } from "@/lib/benchmarks/benchmark-types";
import { usePremiumSchemaEntitlement } from "@/lib/entitlements/use-premium-schema-entitlement";
import { limitPreviewThresholdCount } from "@/lib/entitlements/premium-entitlements";
import { GuidanceFieldFocus } from "@/components/guidance/GuidanceFieldFocus";
import { ToolGuidanceLayout } from "@/components/guidance/ToolGuidanceLayout";
import { CalculationWorkspace } from "@/components/smart-form/CalculationWorkspace";
import { SmartFormShell } from "@/components/smart-form/SmartFormShell";
import { resolveCalculatorInputDisplay } from "@/lib/i18n/free-tool-form-i18n";
import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/i18n/premium-schema-display-i18n";

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
  const tUi = useTranslations("freeToolUi");
  const displayName = resolvePremiumSchemaDisplayName(schema.id, schema.name, locale);
  const displayPain = resolvePremiumSchemaPainStatement(schema.id, schema.painStatement, locale);
  const { entitlement, checkoutHref } = usePremiumSchemaEntitlement(schema);
  const isFullReport = entitlement.canViewFullReport;
  const [values, setValues] = useState<SchemaInputValues>(() => buildDefaultSchemaInputs(schema));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackConversionEvent({
      stage: "premium_preview",
      eventName: "premium_analyzer_open",
      locale,
      pagePath,
      premiumSlug: schema.id,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      valueType: "premium",
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
    return runPremiumSchemaEngine(schema, values, locale);
  }, [locale, submitted, schema, values]);

  const reportData = useMemo(() => {
    if (!result) {
      return null;
    }
    return buildPremiumDecisionReportData(schema, result, locale);
  }, [locale, schema, result]);

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

  const schemaGuidanceFields = useMemo(
    () =>
      schema.inputs.map((input) => {
        const display = resolveCalculatorInputDisplay(schema.id, input.id, locale, {
          label: input.label,
          helper: input.helper,
        });
        return {
          key: input.id,
          label: display.label,
          type: input.type,
          unitGroup: input.unit,
        };
      }),
    [schema, locale],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    trackConversionEvent({
      stage: "premium_preview",
      eventName: "premium_calculate",
      locale,
      pagePath,
      premiumSlug: schema.id,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      valueType: "premium",
    });
  };

  return (
    <SmartFormShell
      title={displayName}
      description={displayPain}
      tier="premium"
      layout="workspace"
      fallback
      formContent={
        <ToolGuidanceLayout
          toolSlug={schema.id}
          tier="premium-schema"
          fields={schemaGuidanceFields}
          toolTitle={displayName}
          toolSector={schema.sectorSlug}
        >
        <CalculationWorkspace
          variant="triple"
          inputs={
      <form
        onSubmit={handleSubmit}
        className="sc-form-shell sc-form-grid sc-industrial-form sc-ledger-letterpress min-h-0 flex-1 flex-col"
        noValidate
        data-calculation-form="true"
      >
        <p className="sc-ledger-eyebrow">{t("ledgerEntries")}</p>
        <hr className="sc-ledger-divider mt-1" />

        {schema.inputs.map((input) => {
          const id = `schema-input-${schema.id}-${input.id}`;
          const value = values[input.id];
          const display = resolveCalculatorInputDisplay(schema.id, input.id, locale, {
            label: input.label,
            helper: input.helper,
          });

          if (input.type === "select" && input.options) {
            return (
              <GuidanceFieldFocus key={input.id} fieldKey={input.id}>
                {({ onFocus, onBlur }) => (
              <div className="sc-industrial-field sc-industrial-field--full">
                <div className="sc-industrial-field__label-row">
                  <label htmlFor={id} className="sc-ledger-label sc-industrial-field__label">
                    {display.label}
                  </label>
                  {input.unit ? (
                    <span className="sc-industrial-field__unit">{input.unit}</span>
                  ) : null}
                </div>
                <select
                  id={id}
                  value={String(value ?? "")}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, [input.id]: e.target.value }));
                    setSubmitted(false);
                  }}
                  className="sc-ledger-input-boxed min-h-[44px]"
                >
                  {(input.options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="sc-ledger-helper sc-industrial-field__helper">{display.helper}</p>
              </div>
                )}
              </GuidanceFieldFocus>
            );
          }

          if (input.type === "boolean") {
            return (
              <GuidanceFieldFocus key={input.id} fieldKey={input.id}>
                {({ onFocus, onBlur }) => (
              <div className="sc-industrial-field sc-industrial-field--full">
                <label className="flex min-h-[44px] items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, [input.id]: e.target.checked }));
                      setSubmitted(false);
                    }}
                  />
                  <span className="text-sm text-premium-velvet">{display.label}</span>
                </label>
                <p className="sc-ledger-helper sc-industrial-field__helper">{display.helper}</p>
              </div>
                )}
              </GuidanceFieldFocus>
            );
          }

          return (
            <GuidanceFieldFocus key={input.id} fieldKey={input.id}>
              {({ onFocus, onBlur }) => (
            <div className="sc-industrial-field sc-industrial-field--full">
              <div className="sc-industrial-field__label-row">
                <label htmlFor={id} className="sc-ledger-label sc-industrial-field__label">
                  {display.label}
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
                placeholder={display.placeholder}
                value={String(value ?? "")}
                onFocus={onFocus}
                onBlur={onBlur}
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
              <p className="sc-ledger-helper sc-industrial-field__helper">{display.helper}</p>
            </div>
              )}
            </GuidanceFieldFocus>
          );
        })}

        <div className="sc-industrial-form-actions">
          <button type="submit" className="sc-ledger-cta-primary sc-cta-primary min-h-[44px]">
            {t("runAnalysis")}
          </button>
        </div>
      </form>
          }
          decision={
            result && reportData ? (
              <div className="flex min-h-0 flex-1 flex-col gap-4" aria-live="polite">
                <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress min-w-0">
                  <ExecutiveVerdictBlock
                    verdict={reportData.verdict}
                    statusLabel={t(`status.${reportData.verdict.status}`)}
                  />
                </div>
                <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress min-w-0">
                  <BigNumberSummary result={result} meaningLabel={t("whatThisMeans")} />
                </div>
                <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress min-w-0 p-4 sm:p-5">
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
            ) : (
              <>
                <p className="sc-ledger-eyebrow">{t("decisionDesk")}</p>
                <p className="mt-2 text-sm text-body-charcoal">{displayPain}</p>
                <p className="mt-4 text-sm text-body-charcoal">{t("runPrompt")}</p>
              </>
            )
          }
          output={
            result ? (
              <div className="flex min-h-0 flex-1 flex-col gap-4">
                <PremiumDecisionReportPreview
                  schema={schema}
                  result={result}
                  locale={locale}
                  compact
                  entitlement={entitlement}
                  checkoutHref={checkoutHref}
                />
                {result && reportData && isFullReport ? (
                  <>
                    <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress p-4 sm:p-5 xl:hidden">
                      <LossDriverBreakdown
                        result={result}
                        title={t("hiddenDriversTitle")}
                        intro={t("hiddenDriversIntro")}
                      />
                    </div>
                    <div className="sc-ledger-report sc-premium-report sc-ledger-letterpress p-4 sm:p-5 xl:hidden">
                      <SuggestedActionSection
                        severity={reportData.severity}
                        engineAction={result.suggestedAction}
                        title={t("suggestedActionTitle")}
                        immediateLabel={t("actionImmediate")}
                        monitoringLabel={t("actionMonitoring")}
                        decisionLabel={t("actionDecision")}
                      />
                    </div>
                  </>
                ) : null}
                {feedbackSnapshots ? (
                  <>
                    <PremiumReportFeedback
                      schemaSlug={schema.id}
                      sectorSlug={schema.sectorSlug}
                      reportSlug={schema.id}
                      inputSnapshot={feedbackSnapshots.inputSnapshot}
                      resultSnapshot={feedbackSnapshots.resultSnapshot}
                    />
                    <CalculationFeedbackButton
                      toolSlug={schema.id}
                      toolType="premium"
                      locale={intlLocale}
                      routePath={pagePath}
                      inputSnapshot={feedbackSnapshots.inputSnapshot}
                      resultSnapshot={feedbackSnapshots.resultSnapshot}
                    />
                  </>
                ) : null}
              </div>
            ) : (
              <>
                <p className="sc-ledger-eyebrow">{tUi("premiumAnalyzer")}</p>
                <p className="mt-2 text-sm text-body-charcoal">{displayPain}</p>
              </>
            )
          }
        />
        </ToolGuidanceLayout>
      }
    />
  );
}
