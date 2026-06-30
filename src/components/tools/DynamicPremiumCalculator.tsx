/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck — Dynamic Premium Calculator (imports types from stub)

"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/i18n/locales";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { trackConversionEvent } from "@/lib/infrastructure/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";
import {
  PremiumDecisionReportPreview,
  LossDriverBreakdown,
  SuggestedActionSection,
  buildPremiumDecisionReportData,
} from "@/components/reports/PremiumDecisionReportPreview";
import type {
  PremiumCalculatorSchema,
  PremiumInputSchema,
  SchemaInputValues,
} from "@/lib/features/premium-schema/premium-calculator-schema";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/features/premium-schema/premium-schema-engine";
import { getOutputMeaning } from "@/lib/features/premium-schema/format-premium-result";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import { handleNumericInputChange } from "@/lib/features/input/numeric-input";
import type { BenchmarkSnapshotValue } from "@/lib/features/benchmarks/benchmark-types";
import { usePremiumSchemaEntitlement } from "@/lib/features/entitlements/use-premium-schema-entitlement";
import { limitPreviewThresholdCount } from "@/lib/features/entitlements/premium-entitlements";
import { resolveCalculatorInputDisplay } from "@/lib/infrastructure/i18n/free-tool-form-i18n";
import {
  resolvePremiumSchemaDisplayName,
  resolvePremiumSchemaPainStatement,
} from "@/lib/infrastructure/i18n/premium-schema-display-i18n";
import { formatPremiumValue } from "@/lib/features/premium-schema/format-premium-result";
import type { SevenMudaEngineeringResult } from "@/lib/features/premium-schema/calculators/seven-muda-waste-cost";
import { resolveSevenMudaRev5Labels } from "@/lib/infrastructure/i18n/seven-muda-rev5-labels";
import { evaluateRuntimeTrust } from "@/lib/features/tools/runtime-trust-engine";
import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";
import {
  resolveToolCalculationAllowed,
  resolveToolFormPresence,
} from "@/components/tools/resolve-tool-form-presence";
import { EngineeringInterpretationPanel } from "@/components/interpretation/EngineeringInterpretationPanel";
import type { InterpretPremiumResultRequest } from "@/lib/features/ai/engineering-interpretation/types";
import {
  inferInputUnitGroup,
} from "@/lib/features/generated-tools/unit-conversion";
import { getAvailableUnitsForGroup } from "@/lib/features/regional/unit-defaults";
import { usePreferredUnitSystem } from "@/hooks/use-preferred-unit-system";
import { HMI_CSS } from "@/lib/features/dynamic-form-v2/hmi-css";

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

type DynamicPremiumCalculatorInputProps = {
  id: string;
  type: string;
  validation: any;
  placeholder: string;
  value: any;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (val: number) => void;
  setSubmitted: (sub: boolean) => void;
};

function DynamicPremiumCalculatorInput({
  id,
  type,
  validation,
  placeholder,
  value,
  onFocus,
  onBlur,
  onChange,
  setSubmitted,
}: DynamicPremiumCalculatorInputProps) {
  const [inputValue, setInputValue] = useState<string>(() => {
    return value === undefined || value === null ? "" : String(value);
  });

  useEffect(() => {
    const num = Number(inputValue);
    const isTypingDecimal = inputValue.endsWith(".") || inputValue.endsWith(",");
    if (value !== num && !isTypingDecimal && inputValue !== ".") {
      setInputValue(value === undefined || value === null ? "" : String(value));
    }
  }, [value]);

  if (type === "slider") {
    return (
      <input
        id={id}
        type="range"
        min={validation?.min}
        max={validation?.max}
        step={validation?.step}
        value={String(value ?? "")}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e) => {
          const val = Number(e.target.value);
          onChange(val);
          setSubmitted(false);
        }}
        className="sc-ledger-input-boxed sc-industrial-input min-h-[44px] min-w-0 flex-1"
      />
    );
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={inputValue}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(e) => {
        const { sanitized, numeric } = handleNumericInputChange(e.target.value);
        setInputValue(sanitized);
        onChange(numeric);
        setSubmitted(false);
      }}
      className="sc-ledger-input-boxed sc-industrial-input min-h-[44px] min-w-0 flex-1"
    />
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
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<SchemaInputValues>(() => buildDefaultSchemaInputs(schema));
  const [submitted, setSubmitted] = useState(false);
  const unitSystem = usePreferredUnitSystem();
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const input of schema.inputs) {
      if (input.type !== "number") {
        continue;
      }
      const group = inferInputUnitGroup(input.unit, input.id);
      if (!group) {
        continue;
      }
      const options = getAvailableUnitsForGroup(group, locale, unitSystem);
      if (options.length > 0) {
        const schemaOption = options.find(
          (o) => o.value.toLowerCase() === input.unit?.trim().toLowerCase(),
        );
        initial[input.id] = schemaOption?.value ?? options[0].value;
      }
    }
    return initial;
  });
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
  const showToolForm = resolveToolFormPresence({
    slug: trustSlug,
    locale,
    surface: "premium",
  });
  const allowCalculation = resolveToolCalculationAllowed({
    slug: trustSlug,
    locale,
    surface: "premium",
    calculationEligible: runtimeTrust.calculationEligible,
    tier: runtimeTrust.tier,
  });

  const visibleInputs = useMemo(
    () => schema.inputs.map((input) => ({ ...input, key: input.id })),
    [schema.inputs],
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

  const interpretationRequest = useMemo<InterpretPremiumResultRequest | null>(() => {
    if (!result || !reportData) return null;
    const inputs: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(values)) {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        inputs[key] = value;
      }
    }
    const outputs = result.outputs.map((o) => ({
      id: o.id,
      label: o.label,
      value: o.formatted,
      unit: o.unit || undefined,
    }));
    return {
      toolId: schema.id,
      toolName: displayName,
      sectorSlug: schema.sectorSlug,
      locale,
      inputs,
      outputs,
      verdict: reportData.verdict.verdict,
      bigNumber: {
        label: result.bigNumber.label,
        value: result.bigNumber.formatted,
      },
    };
  }, [result, reportData, values, schema, displayName, locale]);

  const interpretationPanel = useMemo(() => {
    if (!interpretationRequest) return undefined;
    return (
      <EngineeringInterpretationPanel
        key={`interpret-${schema.id}-${submitted ? "submitted" : "idle"}`}
        request={interpretationRequest}
        shouldFetch
      />
    );
  }, [interpretationRequest, schema.id, submitted]);

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
    if (!allowCalculation) {
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
        {({ onFocus, onBlur }) => {
          const group = input.type === "number" ? inferInputUnitGroup(input.unit, input.id) : null;
          const showUnitSelector = group !== null;
          const unitOptions = showUnitSelector
            ? getAvailableUnitsForGroup(group, locale, unitSystem)
            : [];
          return (
            <div className="sc-industrial-field sc-industrial-field--full">
              <div className="sc-industrial-field__label-row">
                <label htmlFor={id} className="sc-ledger-label sc-industrial-field__label">
                  {display.label}
                </label>
                {!showUnitSelector && input.unit ? (
                  <span className="sc-industrial-field__unit">{input.unit}</span>
                ) : null}
              </div>
              <div className="flex min-w-0 items-stretch gap-2">
                <DynamicPremiumCalculatorInput
                  id={id}
                  type={input.type}
                  validation={input.validation}
                  placeholder={display.placeholder}
                  value={value}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onChange={(numeric) => {
                    setValues((prev) => ({ ...prev, [input.id]: numeric }));
                  }}
                  setSubmitted={setSubmitted}
                />
                {showUnitSelector && unitOptions.length > 0 ? (
                  <select
                    id={`${id}-unit`}
                    value={selectedUnits[input.id] ?? input.unit ?? unitOptions[0]?.value ?? ""}
                    onChange={(e) =>
                      setSelectedUnits((prev) => ({ ...prev, [input.id]: e.target.value }))
                    }
                    className="sc-premium-dtf-unit-select"
                    aria-label={`${display.label} unit`}
                  >
                    {unitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
              <p className="sc-ledger-helper sc-industrial-field__helper">{display.helper}</p>
            </div>
          );
        }}
      </GuidanceFieldFocus>
    );
  };

  if (!showToolForm) {
    return (
      <ToolSafeReviewState slug={trustSlug} locale={locale} findings={runtimeTrust.findings} />
    );
  }

  // HMI template state
  const [utcTime, setUtcTime] = useState("");
  useEffect(() => {
    function tick() { setUtcTime("UTC · " + new Date().toISOString().replace("T", " ").slice(0, 19)); }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const decisionStatus = result?.verdictStatus || reportData?.verdict?.status || null;
  const decisionLabel = decisionStatus ? String(decisionStatus).toUpperCase() : "AWAITING INPUTS";
  const isCritical = decisionStatus === "HIGH" || decisionStatus === "CRITICAL" || decisionStatus === "REVIEW";
  const isOK = decisionStatus === "LOW" || decisionStatus === "PASS" || decisionStatus === "OK";
  const hasResult = Boolean(result && reportData);

  return (
    <>
      <style>{HMI_CSS}</style>
      {/* STATUS STRIP */}
      <div className="status-strip">
        <div className="brand">
          <span className="led ok pulse" />
          <div>
            <div className="brand-mark">SECTORCALC PREMIUM</div>
            <div className="brand-sub">SCHEMA ENGINE · {(schema.sectorSlug || "").toUpperCase()}</div>
          </div>
        </div>
        <div className="indicators">
          <div className="ind"><span className={`led ${hasResult ? "ok" : "off"}`} /><b>CALC</b></div>
          <div className="ind"><span className={`led ${isCritical ? "danger" : isOK ? "ok" : "off"}`} /><b>ALM</b></div>
          <div className="ind"><span className="led off" /><b>PENDING</b></div>
          <div className="ind"><span className="led signal pulse" /><b>COM</b></div>
          <div className="timestamp">{utcTime || "\u2014"}</div>
        </div>
      </div>

      {/* DISPLAY HEADER */}
      <div className="display-header">
        <div>
          <div className="module-id">MODULE · {schema.id} · PREMIUM SCHEMA</div>
          <h1>{displayName}</h1>
          <div className="sub-cap">{displayPain}</div>
        </div>
        <div className="meta">
          <div className="pill-row">
            <span className="pill pro">PREMIUM SCHEMA</span>
            {hasResult ? <span className="pill">STATUS · {decisionLabel}</span> : null}
          </div>
        </div>
      </div>

      <div className="grid">
        <main>
          <form ref={formRef} onSubmit={handleSubmit} noValidate data-calculation-form="true">
            {/* INPUT GROUP */}
            <div className="group">
              <div className="group-head">
                <span className="led ok group-led" />
                <span className="group-letter">IN</span>
                <span className="group-title">INPUT PARAMETERS</span>
                <span className="group-count">{visibleInputs.length} fields</span>
              </div>
              <div className="fields">
                {visibleInputs.map((input) => {
                  const id = `schema-input-${schema.id}-${input.id}`;
                  const value = values[input.id];
                  const display = resolveCalculatorInputDisplay(schema.id, input.id, locale, {
                    label: input.label,
                    helper: input.helper,
                  });
                  return (
                    <div key={input.id} className="field">
                      <label>
                        <span className="f-name">{display.label}</span>
                        {input.unit ? <span className="f-sym">{input.unit}</span> : null}
                      </label>
                      <div className="ctrl">
                        <input
                          id={id}
                          type="text"
                          inputMode="decimal"
                          placeholder={display.placeholder || "0"}
                          value={value === undefined || value === null ? "" : String(value)}
                          onChange={(e) => {
                            const { sanitized, numeric } = handleNumericInputChange(e.target.value);
                            if (input.type === "select" && input.options) {
                              setValues((prev) => ({ ...prev, [input.id]: e.target.value }));
                            } else {
                              setValues((prev) => ({ ...prev, [input.id]: numeric }));
                            }
                            setSubmitted(false);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EXECUTE PANEL */}
            <div className="exec-panel">
              <div className="exec-status">
                <span className="led signal pulse" />
                <span>READY {hasResult ? <span className="tx">· last exec {new Date().toLocaleTimeString()}</span> : null}</span>
              </div>
              <button type="submit" className="btn-exec">
                &#x25B6; EXECUTE
                <span className="kbd">F9</span>
              </button>
            </div>
          </form>
        </main>

        {/* RAIL */}
        <aside className="rail">
          {/* Decision */}
          <div className={`decision ${isCritical ? "review" : isOK ? "ok" : ""}`}>
            <div className="d-label">
              PRIMARY READOUT · STATUS
            </div>
            <div className="d-text">{hasResult ? result.bigNumber.formatted : "\u2014"}</div>
            <div className="d-sub">{decisionLabel}</div>
          </div>

          {/* Quick Summary */}
          {hasResult ? (
            <div className="card">
              <h3>QUICK SUMMARY</h3>
              <div className="readout">
                <div className="blk">
                  <p><b>Verdict:</b> {reportData.verdict.verdict}</p>
                  <p><b>Primary Metric:</b> {result.bigNumber.formatted}</p>
                  {result.p90Exposure != null ? <p><b>P90 Exposure:</b> {formatPremiumValue(result.p90Exposure, "currency", "", locale)}</p> : null}
                  {result.minimumSafePrice != null ? <p><b>Min Safe Price:</b> {formatPremiumValue(result.minimumSafePrice, "currency", "", locale)}</p> : null}
                </div>
              </div>
            </div>
          ) : null}

          {/* Thresholds (first 2 preview) */}
          {hasResult ? (
            <div className="card">
              <h3>THRESHOLD ALERTS</h3>
              <div style={{ minHeight: 20 }}>
                {(isFullReport ? reportData.thresholdItems : limitPreviewThresholdCount(reportData.thresholdItems, 2)).map((item, i) => (
                  <div key={i} className="warn WARNING">
                    <span className="wsev" />
                    <span className="wmsg"><b>BAND.</b> {item.label}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Interpretation */}
          {interpretationPanel ? (
            <div className="card">{interpretationPanel}</div>
          ) : null}

          {/* Seven Muda specific */}
          {hasResult && schema.id === SEVEN_MUDA_WASTE_COST_SLUG && result.sevenMudaEngineering ? (
            <div className="card">
              <h3>7 MUDA WASTE BREAKDOWN</h3>
              <SevenMudaQuickDecisionSummary engineering={result.sevenMudaEngineering} locale={locale} />
            </div>
          ) : null}

          {/* Deep Content (locked behind paywall) */}
          {hasResult ? (
            <div className="card">
              <h3>DETAILED ANALYSIS</h3>
              <div className="readout">
                <div className="blk">
                  <PremiumDecisionReportPreview
                    schema={schema}
                    result={result}
                    locale={locale}
                    compact
                    entitlement={entitlement}
                    checkoutHref={checkoutHref}
                  />
                </div>
                {isFullReport ? (
                  <>
                    <div className="blk">
                      <div className="bh"><span className="bt">LOSS DRIVERS</span></div>
                      <LossDriverBreakdown
                        result={result}
                        title=""
                        intro=""
                      />
                    </div>
                    <div className="blk">
                      <div className="bh"><span className="bt">SUGGESTED ACTION</span></div>
                      <SuggestedActionSection
                        severity={reportData.severity}
                        engineAction={result.suggestedAction}
                        title=""
                        immediateLabel="IMMEDIATE"
                        monitoringLabel="MONITORING"
                        decisionLabel="DECISION"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Feedback */}
          {feedbackSnapshots ? (
            <div className="card" id="feedback">
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
        </aside>
      </div>

      {/* Mobile Bar */}
      <div className="mbar" style={{ display: "flex" }}>
        <div>
          <div className="ml">RESULT</div>
          <div className="mv">{hasResult ? result.bigNumber.formatted : "\u2014"}</div>
        </div>
        <div className="md">{decisionLabel}</div>
      </div>
    </>
  );
}
