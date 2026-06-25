/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck — Dynamic Premium Calculator (imports types from stub)

"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
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
  PremiumInputSchema,
  SchemaInputValues,
} from "@/lib/premium-schema/premium-calculator-schema";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";
import { getOutputMeaning } from "@/lib/premium-schema/format-premium-result";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import type { BenchmarkSnapshotValue } from "@/lib/benchmarks/benchmark-types";
import { usePremiumSchemaEntitlement } from "@/lib/entitlements/use-premium-schema-entitlement";
import { limitPreviewThresholdCount } from "@/lib/entitlements/premium-entitlements";
import { GuidanceFieldFocus } from "@/components/guidance/GuidanceFieldFocus";
import { ToolGuidanceLayout } from "@/components/guidance/ToolGuidanceLayout";
import { ResultLayerTabs } from "@/components/results/ResultLayerTabs";
import { PremiumCalculatorShell } from "@/components/tools/PremiumCalculatorShell";
import { resolvePrimaryArchetype } from "@/lib/decision-engine/decision-engine-resolver";
import {
  buildPremiumSchemaExperienceFields,
  filterVisibleCalculatorFields,
  resolveCalculatorExperience,
} from "@/lib/calculator-experience/resolve-calculator-experience";
import type { CalculatorExperienceMode } from "@/lib/calculator-experience/calculator-experience-types";
import { resolveCalculatorInputDisplay } from "@/lib/i18n/free-tool-form-i18n";
import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/i18n/premium-schema-display-i18n";
import { formatPremiumValue } from "@/lib/premium-schema/format-premium-result";
import type { SevenMudaEngineeringResult } from "@/lib/premium-schema/calculators/seven-muda-waste-cost";
import { resolveSevenMudaRev5Labels } from "@/lib/i18n/seven-muda-rev5-labels";
import { evaluateRuntimeTrust } from "@/lib/tools/runtime-trust-engine";
import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";

const SEVEN_MUDA_WASTE_COST_SLUG = "7-israf-muda-avcisi-parasal-karsilik-calculator";

function SevenMudaQuickDecisionSummary({
  engineering,
  locale,
}: {
  engineering: SevenMudaEngineeringResult;
  locale: string;
}) {
  const labels = resolveSevenMudaRev5Labels(locale);
  const fmtCurrency = (value: number) => formatPremiumValue(value, "currency", "", locale);
  const verdict = engineering.decisionVerdict;

  return (
    <section className="sc-premium-decision-report__section" aria-label={labels.quickSummaryTitle}>
      <h3 className="sc-premium-decision-report__heading">{labels.quickSummaryTitle}</h3>
      <dl className="sc-premium-driver-grid">
        <div className="sc-premium-driver-grid__item">
          <dt className="sc-premium-driver-grid__label">{labels.totalWasteCost}</dt>
          <dd className="sc-premium-driver-grid__value">{fmtCurrency(engineering.totalWasteCost)}</dd>
        </div>
        <div className="sc-premium-driver-grid__item">
          <dt className="sc-premium-driver-grid__label">{labels.annualizedWasteCost}</dt>
          <dd className="sc-premium-driver-grid__value">{fmtCurrency(engineering.annualizedWasteCost)}</dd>
        </div>
        <div className="sc-premium-driver-grid__item">
          <dt className="sc-premium-driver-grid__label">{labels.highestWasteCategory}</dt>
          <dd className="sc-premium-driver-grid__value">
            {labels.categoryName(engineering.highestWasteCategory)}
          </dd>
        </div>
        <div className="sc-premium-driver-grid__item">
          <dt className="sc-premium-driver-grid__label">{labels.firstActionCategory}</dt>
          <dd className="sc-premium-driver-grid__value">
            {labels.categoryName(verdict.firstActionCategory)}
          </dd>
        </div>
        <div className="sc-premium-driver-grid__item">
          <dt className="sc-premium-driver-grid__label">{labels.confidenceLevel}</dt>
          <dd className="sc-premium-driver-grid__value">
            {labels.confidenceText(engineering.confidenceLevel)}
          </dd>
        </div>
        <div className="sc-premium-driver-grid__item">
          <dt className="sc-premium-driver-grid__label">{labels.doubleCountRisk}</dt>
          <dd className="sc-premium-driver-grid__value">
            {verdict.hasDoubleCountRisk ? labels.doubleCountDetected : labels.doubleCountNone}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export interface DynamicPremiumCalculatorProps {
  schema: PremiumCalculatorSchema;
  locale?: string;
}

export function DynamicPremiumCalculator({ schema, locale: localeProp }: DynamicPremiumCalculatorProps) {
  const intlLocale = useLocale();
  const locale = localeProp ?? intlLocale;
  const pathname = usePathname();
  const attribution = useAttributionContext();
  const pagePath = stripLocalePrefix(pathname);
  const t = useTranslations("premiumDecisionReport");
  const displayName = resolvePremiumSchemaDisplayName(schema.id, schema.name, locale);
  const displayPain = resolvePremiumSchemaPainStatement(schema.id, schema.painStatement, locale);
  const { entitlement, checkoutHref } = usePremiumSchemaEntitlement(schema);
  const isFullReport = entitlement.canViewFullReport;
  const [values, setValues] = useState<SchemaInputValues>(() => buildDefaultSchemaInputs(schema));
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<CalculatorExperienceMode>("quick");
  const trustSlug = schema.legacyPaidSlug ?? schema.id;
  const runtimeTrust = useMemo(
    () =>
      evaluateRuntimeTrust({
        slug: trustSlug,
        locale,
        surface: "premium",
        premiumSurfaceUsesFreeCopy: false,
      }),
    [trustSlug, locale],
  );
  const showCalculationSurface = runtimeTrust.calculationEligible;

  const experience = useMemo(
    () =>
      resolveCalculatorExperience({
        toolSlug: schema.id,
        fields: buildPremiumSchemaExperienceFields(schema.inputs),
        category: schema.category,
        archetype: resolvePrimaryArchetype({
          toolSlug: schema.id,
          locale,
          tier: "premium-schema",
          category: schema.category,
          sector: schema.sectorSlug,
        }),
      }),
    [schema, locale],
  );

  const visibleInputs = useMemo(
    () =>
      filterVisibleCalculatorFields(
        schema.inputs.map((input) => ({ ...input, key: input.id })),
        experience,
        mode,
      ),
    [schema.inputs, experience, mode],
  );

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
      visibleInputs.map((input) => {
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
    [visibleInputs, schema.id, locale],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!showCalculationSurface) {
      return;
    }
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

  const renderInput = (input: PremiumInputSchema) => {
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
                {input.unit ? <span className="sc-industrial-field__unit">{input.unit}</span> : null}
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
              {input.unit ? <span className="sc-industrial-field__unit">{input.unit}</span> : null}
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
  };

  if (!showCalculationSurface) {
    return (
      <ToolSafeReviewState slug={trustSlug} locale={locale} findings={runtimeTrust.findings} />
    );
  }

  return (
    <ToolGuidanceLayout
      toolSlug={schema.id}
      tier="premium-schema"
      fields={schemaGuidanceFields}
      toolTitle={displayName}
      toolSector={schema.sectorSlug}
    >
      <PremiumCalculatorShell
        title={displayName}
        description={displayPain}
        experience={experience}
        mode={mode}
        onModeChange={setMode}
        hasCalculated={Boolean(result && reportData)}
        inputPanel={
          <div className="flex min-w-0 flex-col gap-4">
            <div className="order-1 min-w-0 lg:order-2">
              <form
                onSubmit={handleSubmit}
                className="sc-form-shell sc-form-grid sc-industrial-form min-h-0"
                noValidate
                data-calculation-form="true"
              >
                {visibleInputs.map((input) => renderInput(input))}
                <div className="sc-industrial-form-actions">
                  <button type="submit" className="sc-ledger-cta-primary sc-cta-primary min-h-[44px]">
                    {t("runAnalysis")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
        resultPanel={
          result && reportData ? (
            <ResultLayerTabs
              quickHeadline={result.bigNumber.formatted}
              quickSummary={getOutputMeaning(result.bigNumber)}
              quickContent={
                <div className="space-y-4">
                  <ExecutiveVerdictBlock
                    verdict={reportData.verdict}
                    statusLabel={t(`status.${reportData.verdict.status}`)}
                  />
                  <BigNumberSummary result={result} meaningLabel={t("whatThisMeans")} />
                  {schema.id === SEVEN_MUDA_WASTE_COST_SLUG && result.sevenMudaEngineering ? (
                    <SevenMudaQuickDecisionSummary
                      engineering={result.sevenMudaEngineering}
                      locale={locale}
                    />
                  ) : null}
                  <ThresholdStatusSection
                    items={
                      isFullReport
                        ? reportData.thresholdItems
                        : limitPreviewThresholdCount(reportData.thresholdItems, 2)
                    }
                    title={t("thresholdTitle")}
                  />
                </div>
              }
              deepContent={
                <div className="space-y-4">
                  <PremiumDecisionReportPreview
                    schema={schema}
                    result={result}
                    locale={locale}
                    compact
                    entitlement={entitlement}
                    checkoutHref={checkoutHref}
                  />
                  {isFullReport ? (
                    <>
                      <LossDriverBreakdown
                        result={result}
                        title={t("hiddenDriversTitle")}
                        intro={t("hiddenDriversIntro")}
                      />
                      <SuggestedActionSection
                        severity={reportData.severity}
                        engineAction={result.suggestedAction}
                        title={t("suggestedActionTitle")}
                        immediateLabel={t("actionImmediate")}
                        monitoringLabel={t("actionMonitoring")}
                        decisionLabel={t("actionDecision")}
                      />
                    </>
                  ) : null}
                </div>
              }
            />
          ) : null
        }
      />
      {feedbackSnapshots ? (
        <div className="mt-6 space-y-4">
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
        </div>
      ) : null}
    </ToolGuidanceLayout>
  );
}
