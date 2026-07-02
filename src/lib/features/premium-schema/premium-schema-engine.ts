/**
 * Premium Schema Engine — resolves inputMap, runs pipeline, thresholds, report.
 * No eval / new Function / expression parsing.
 */

import {
  getPremiumOutputFormatted,
  normalizeLocale,
  type SupportedLocale,
} from "@/lib/core/format/localization";
import { getFormulaFn } from "@/lib/features/premium-schema/formula-registry";
import type {
  PremiumCalculatorSchema,
  PremiumSchemaEngineResult,
  PremiumThresholdSchema,
  ReportSectionId,
  SchemaInputValues,
  SchemaPipelineOutput,
  SchemaReportSection,
  ThresholdAlert,
  ThresholdSeverity,
} from "@/lib/features/premium-schema/premium-calculator-schema";

export const SCHEMA_LEGAL_NOTE =
  "This report is a technical decision-support simulation based on user-provided inputs and sector assumptions. It is not financial, legal, medical or engineering advice. Verify all outputs before business decisions.";

const Z_P90 = 1.2816;

const PRIMED_SCHEMA_IDS = new Set<string>([
  "seven-wastes-muda-monetary-cost-calculator",
]);

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function toNumber(value: number | string | boolean | number[] | undefined, fallback = 0): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0 && Number.isFinite(Number(value[0])) ? Number(value[0]) : fallback;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

export function normalizeSchemaInputs(
  schema: PremiumCalculatorSchema,
  raw: SchemaInputValues
): SchemaInputValues {
  const normalized: SchemaInputValues = {};
  for (const input of schema.inputs) {
    const rawValue = raw[input.id];
    
    if (input.array) {
      if (Array.isArray(rawValue)) {
        normalized[input.id] = rawValue.map(v => toNumber(v, 0));
      } else if (typeof rawValue === "string") {
        normalized[input.id] = rawValue.split(',').map(s => toNumber(s.trim(), 0));
      } else {
        normalized[input.id] = [];
      }
      continue;
    }

    if (input.type === "boolean") {
      normalized[input.id] =
        typeof rawValue === "boolean"
          ? rawValue
          : rawValue === "yes" || rawValue === "true" || rawValue === 1;
      continue;
    }
    if (input.type === "select") {
      normalized[input.id] =
        typeof rawValue === "string" && rawValue !== ""
          ? rawValue
          : String(input.smartDefault ?? input.options?.[0]?.value ?? "");
      continue;
    }
    let numeric = toNumber(rawValue, toNumber(input.smartDefault, 0));
    if (input.validation?.min !== undefined) {
      numeric = Math.max(input.validation.min, numeric);
    }
    if (input.validation?.max !== undefined) {
      numeric = Math.min(input.validation.max, numeric);
    }
    normalized[input.id] = numeric;
  }
  return normalized;
}

function resolveMappedValue(
  sourceKey: string,
  userInputs: SchemaInputValues,
  computed: Record<string, number | number[]>
): number | number[] {
  if (sourceKey in computed) {
    return computed[sourceKey] ?? 0;
  }
  const val = userInputs[sourceKey];
  if (Array.isArray(val)) return val;
  return toNumber(val, 0);
}

function buildFormulaInputs(
  inputMap: Readonly<Record<string, string>>,
  userInputs: SchemaInputValues,
  computed: Record<string, number | number[]>
): Record<string, number | number[]> {
  const mapped: Record<string, number | number[]> = {};
  for (const [param, sourceKey] of Object.entries(inputMap)) {
    mapped[param] = resolveMappedValue(sourceKey, userInputs, computed);
  }
  return mapped;
}

function formatOutput(
  value: number,
  format: SchemaPipelineOutput["format"],
  unit: string,
  locale: SupportedLocale,
): string {
  return getPremiumOutputFormatted(value, format, unit, locale, "USD");
}

function evaluateThreshold(
  rule: PremiumThresholdSchema,
  value: number
): ThresholdAlert | null {
  const { direction, warning, critical } = rule;
  if (direction === "higher_is_bad") {
    if (value >= critical) {
      return { fieldId: rule.fieldId, severity: "critical", message: rule.criticalMessage, value };
    }
    if (value >= warning) {
      return { fieldId: rule.fieldId, severity: "warning", message: rule.warningMessage, value };
    }
    return null;
  }
  if (value <= critical) {
    return { fieldId: rule.fieldId, severity: "critical", message: rule.criticalMessage, value };
  }
  if (value <= warning) {
    return { fieldId: rule.fieldId, severity: "warning", message: rule.warningMessage, value };
  }
  return null;
}

function buildSuggestedAction(alerts: readonly ThresholdAlert[]): string {
  const critical = alerts.find((a) => a.severity === "critical");
  if (critical) {
    return critical.message;
  }
  const warning = alerts.find((a) => a.severity === "warning");
  if (warning) {
    return warning.message;
  }
  return "Current inputs are inside the acceptable range. Confirm assumptions before committing.";
}

function sectionTitle(id: ReportSectionId): string {
  const titles: Record<ReportSectionId, string> = {
    executive_summary: "Executive summary",
    loss_breakdown: "Loss breakdown",
    thresholds: "Tolerance & thresholds",
    sensitivity: "Sensitivity notes",
    action_plan: "Suggested action",
    assumptions: "Assumptions",
  };
  return titles[id];
}

function buildReportSection(
  id: ReportSectionId,
  schema: PremiumCalculatorSchema,
  outputs: readonly SchemaPipelineOutput[],
  alerts: readonly ThresholdAlert[],
  executiveSummary: string,
  suggestedAction: string,
  p90Formatted: string,
  minimumSafeFormatted: string
): SchemaReportSection {
  switch (id) {
    case "executive_summary":
      return { id, title: sectionTitle(id), body: executiveSummary };
    case "loss_breakdown":
      return {
        id,
        title: sectionTitle(id),
        body: outputs
          .filter((o) => o.format === "currency" || o.id.includes("loss") || o.id.includes("cost"))
          .map((o) => `${o.label}: ${o.formatted}`)
          .join(" · "),
      };
    case "thresholds":
      return {
        id,
        title: sectionTitle(id),
        body:
          alerts.length > 0
            ? alerts.map((a) => `[${a.severity.toUpperCase()}] ${a.message}`).join(" ")
            : "All monitored fields are within tolerance bands.",
      };
    case "sensitivity":
      return {
        id,
        title: sectionTitle(id),
        body: `P90 exposure ${p90Formatted}. Minimum safe floor ${minimumSafeFormatted}. Energy and delay exposure are common risk drivers when buffers are tight.`,
      };
    case "action_plan":
      return { id, title: sectionTitle(id), body: suggestedAction };
    case "assumptions":
      return {
        id,
        title: sectionTitle(id),
        body: schema.assumptions.assumptionNotes.join(" "),
      };
    default:
      return { id, title: sectionTitle(id), body: executiveSummary };
  }
}

import { normalizeInputs } from "./unit-normalizer";

export function runPremiumSchemaEngine(
  schema: PremiumCalculatorSchema,
  rawInputs: SchemaInputValues,
  locale: SupportedLocale | string = "en",
  globalOutputUnit?: string,
  exchangeRates?: Record<string, number>,
): PremiumSchemaEngineResult {
  const formatLocale = normalizeLocale(locale);
  const normalizedRaw = normalizeSchemaInputs(schema, rawInputs);
  const { values: userInputs } = normalizeInputs(schema.inputs, normalizedRaw as Record<string, number>);

  const needsPriming = PRIMED_SCHEMA_IDS.has(schema.id);


  try {
    if (needsPriming) {
    }

    const coreResult = runPremiumSchemaEngineCore(schema, userInputs, formatLocale, globalOutputUnit, exchangeRates);
    if (!needsPriming) {
      return coreResult;
    }
    return {
      ...coreResult,
    };
  } finally {
  }
}

function runPremiumSchemaEngineCore(
  schema: PremiumCalculatorSchema,
  userInputs: SchemaInputValues,
  formatLocale: SupportedLocale,
  globalOutputUnit?: string,
  exchangeRates?: Record<string, number>,
): PremiumSchemaEngineResult {
  const computed: Record<string, number | number[]> = {
    hiddenMultiplierConst: schema.assumptions.hiddenLossMultiplier,
  };

  const currentKwh = toNumber(userInputs.currentKwh, 0);
  const targetKwh = toNumber(userInputs.targetKwh, 0);
  if (currentKwh > 0 || targetKwh > 0) {
    computed.excessKwhDerived = Math.max(0, currentKwh - targetKwh);
  }

  for (const step of schema.formulaPipeline ?? []) {
    try {
      const formulaFn = getFormulaFn(step.formulaId);
      const mapped = buildFormulaInputs(step.inputMap, userInputs, computed);
      computed[step.outputId] = formulaFn(mapped);
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[SchemaEngine] Formula "${step.formulaId}" failed for schema "${schema.id}"`);
      }
      computed[step.outputId] = 0;
    }
  }

  if (schema.legacyFormulas) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { compile, safeEval } = require("@/lib/features/dynamic-form-v2/ast-parser");
    const scope = { ...userInputs, ...computed };
    for (const [outputId, expr] of Object.entries(schema.legacyFormulas)) {
      try {
        const fn = compile(expr as string);
        const val = safeEval(fn, scope);
        computed[outputId] = typeof val === 'number' ? val : 0;
        scope[outputId] = computed[outputId];
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[SchemaEngine] Legacy formula "${outputId}" failed for schema "${schema.id}"`);
        }
        computed[outputId] = 0;
        scope[outputId] = 0;
      }
    }
  }

  const outputs: SchemaPipelineOutput[] = schema.outputs.map((spec) => {
    let rawVal = computed[spec.id] ?? 0;
    
    // Apply global output unit conversion if target unit is passed and matches dimension (or currency)
    // We import this dynamically or rely on the caller for formatting, but here we can just use normalizeValue
    let finalUnit = spec.unit;
    if (globalOutputUnit && spec.format === "currency") { // Assuming global is mostly for currency now
        // A full dimensional check could be used, but for simplicity we convert if it's currency
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { normalizeValue } = require("@/lib/core/units/currency-converter");
        if (exchangeRates && spec.format === "currency") {
            rawVal = normalizeValue(Number(rawVal), spec.unit, globalOutputUnit, "currency", exchangeRates);
            finalUnit = globalOutputUnit;
        }
    }
    
    const raw = typeof rawVal === 'number' ? rawVal : 0;
    return {
      id: spec.id,
      label: spec.label,
      unit: finalUnit,
      format: spec.format,
      raw: Number.isFinite(raw) ? raw : 0,
      formatted: formatOutput(raw, spec.format, finalUnit, formatLocale),
      isBigNumber: spec.isBigNumber ?? false,
    };
  });

  const bigNumber =
    outputs.find((o) => o.isBigNumber) ??
    outputs[outputs.length - 1] ?? {
      id: "result",
      label: "Result",
      unit: "",
      format: "number" as const,
      raw: 0,
      formatted: "0",
      isBigNumber: true,
    };

  const thresholdAlerts: ThresholdAlert[] = [];
  for (const rule of schema.thresholds) {
    const computedVal = computed[rule.fieldId];
    const value = typeof computedVal === 'number' ? computedVal : toNumber(userInputs[rule.fieldId], 0);
    const alert = evaluateThreshold(rule, value);
    if (alert) {
      thresholdAlerts.push(alert);
    }
  }

  const baseExposureVal =
    computed.totalExposure ??
    computed.totalEnergyCost ??
    computed.totalFreightCost ??
    computed.combinedOperatingCost ??
    bigNumber.raw;
  const baseExposure = typeof baseExposureVal === 'number' ? baseExposureVal : 0;

  const hiddenMultiplier = schema.assumptions.hiddenLossMultiplier;
  const adjustedCost = baseExposure * hiddenMultiplier;
  const volatilityPercent = schema.assumptions.volatilityPercent;
  let p90Exposure = adjustedCost + adjustedCost * (volatilityPercent / 100) * Z_P90;
  
  const minimumSafePriceFn = getFormulaFn("cost.minimum_safe_price");
  let minimumSafePrice = minimumSafePriceFn
    ? minimumSafePriceFn({
        p90Cost: p90Exposure,
        targetMarginPercent: schema.assumptions.targetMarginPercent,
      })
    : 0;

  let finalCurrencyUnit = "USD";
  if (globalOutputUnit && exchangeRates) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { normalizeValue } = require("@/lib/core/units/currency-converter");
      // baseExposure might be in the schema's bigNumber unit, usually USD
      // We assume p90 and minimum safe price are USD based by default unless the bigNumber is different
      const baseCurrency = bigNumber.unit || "USD";
      p90Exposure = normalizeValue(p90Exposure, baseCurrency, globalOutputUnit, "currency", exchangeRates);
      minimumSafePrice = normalizeValue(minimumSafePrice, baseCurrency, globalOutputUnit, "currency", exchangeRates);
      finalCurrencyUnit = globalOutputUnit;
  }

  const p90ExposureFormatted = formatOutput(p90Exposure, "currency", finalCurrencyUnit, formatLocale);
  const minimumSafePriceFormatted = formatOutput(minimumSafePrice, "currency", finalCurrencyUnit, formatLocale);

  const executiveSummary = `${schema.name}: ${bigNumber.formatted} primary exposure. Buffered P90 ${p90ExposureFormatted}. ${schema.painStatement}`;

  const suggestedAction = buildSuggestedAction(thresholdAlerts);

  const reportSections = schema.reportTemplate.sections.map((sectionId) =>
    buildReportSection(
      sectionId,
      schema,
      outputs,
      thresholdAlerts,
      executiveSummary,
      suggestedAction,
      p90ExposureFormatted,
      minimumSafePriceFormatted
    )
  );

  return {
    schemaId: schema.id,
    schemaName: schema.name,
    outputs,
    bigNumber,
    thresholdAlerts,
    reportSections,
    executiveSummary,
    suggestedAction,
    legalNote: SCHEMA_LEGAL_NOTE,
    p90Exposure,
    p90ExposureFormatted,
    minimumSafePrice,
    minimumSafePriceFormatted,
  };
}

export function buildDefaultSchemaInputs(schema: PremiumCalculatorSchema): SchemaInputValues {
  const values: SchemaInputValues = {};
  for (const input of schema.inputs) {
    if (input.smartDefault !== undefined) {
      values[input.id] = input.smartDefault;
    } else if (input.type === "boolean") {
      values[input.id] = false;
    } else if (input.type === "select") {
      values[input.id] = input.options?.[0]?.value ?? "";
    } else {
      values[input.id] = input.validation?.min ?? 0;
    }
  }
  return values;
}

export function schemaHasFiniteResults(result: PremiumSchemaEngineResult): boolean {
  const values = [
    ...result.outputs.map((o) => o.raw),
    result.p90Exposure,
    result.minimumSafePrice,
    result.bigNumber.raw,
  ];
  return values.every((v) => Number.isFinite(v) && !Number.isNaN(v));
}

export function worstThresholdSeverity(
  alerts: readonly ThresholdAlert[]
): ThresholdSeverity {
  if (alerts.some((a) => a.severity === "critical")) {
    return "critical";
  }
  if (alerts.some((a) => a.severity === "warning")) {
    return "warning";
  }
  return "ok";
}

/** Spec alias — schema-driven premium calculation entry point. */
export function calculatePremiumSchema(
  schema: PremiumCalculatorSchema,
  values: SchemaInputValues
): PremiumSchemaEngineResult {
  return runPremiumSchemaEngine(schema, values);
}
