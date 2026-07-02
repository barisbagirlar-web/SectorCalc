"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DynamicFormEngine } from "@/lib/features/dynamic-form-v2/DynamicFormEngine";
import { adaptPremiumSchema } from "@/lib/features/dynamic-form-v2/premium-schema-adapter";
import type {
  PremiumCalculatorSchema,
  PremiumSchemaEngineResult,
  SchemaInputValues,
} from "@/lib/features/premium-schema/premium-calculator-schema";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/features/premium-schema/premium-schema-engine";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — SINGLE SOURCE OF TRUTH (English only, no i18n)
// ─────────────────────────────────────────────────────────────────────────────

const LEGAL_NOTE =
  "This calculation is provided for estimation and preliminary analysis purposes only. " +
  "All results must be independently verified against applicable industry standards " +
  "(ASME, ISO, API, IEC, IEEE, DIN) and local regulatory requirements before being used " +
  "in engineering, financial, or safety-critical decisions. SectorCalc disclaims all " +
  "liability for design outcomes, regulatory compliance, or safety incidents derived " +
  "solely from this tool.";

const LABELS = {
  premiumReport: "Premium Engineering Report",
  outputCurrency: "Output Currency",
  computeButton: "Generate Report",
  calculating: "Computing…",
  reference: "Reference",
  unit: "Unit",
  validationErrors: "Validation Errors",
  thresholdAlerts: "THRESHOLD ALERTS",
  suggestedAction: "SUGGESTED ACTION",
  critical: "CRITICAL",
  warning: "WARNING",
  error: "ERROR",
  fixBeforeCompute: "Please resolve validation errors before computing.",
  fillPrompt: "Adjust inputs above to generate the engineering report.",
  currencyNotice:
    "Exchange rates sourced from ECB (Frankfurter API), refreshed daily at 16:00 CET. " +
    "Verify live rates for time-sensitive financial decisions.",
  professionalCommentary: "Professional Commentary",
  inputParameters: "Input Parameters",
  primaryReadout: "Primary Readout",
};

const CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD",
  "CNY", "INR", "BRL", "TRY", "SEK", "NOK", "DKK",
] as const;

// Industrial reference database keyed by input.id (snake_case convention)
const REFERENCE_DB: Record<string, { range: string; context: string; standard?: string }> = {
  // Pressure vessels (ASME VIII Div.1)
  pressure: { range: "0.1 – 10 MPa", context: "Design pressure", standard: "ASME VIII" },
  radius: { range: "100 – 2000 mm", context: "Shell inner radius", standard: "ASME VIII" },
  allowable_stress: { range: "80 – 250 MPa", context: "Carbon steel @ ambient", standard: "ASME II-D" },
  joint_efficiency: { range: "0.65 – 1.00", context: "Weld category", standard: "ASME UW-12" },
  corrosion_allowance: { range: "0.5 – 6 mm", context: "Service life factor", standard: "API 510" },

  // Injection molding
  wall_thickness: { range: "1 – 5 mm", context: "Thermoplastic part", standard: "ISO 20072" },
  thermal_diffusivity: { range: "0.06 – 0.15 mm²/s", context: "PP / PE / PS", standard: "ISO 22007-4" },
  melt_temperature: { range: "180 – 320 °C", context: "Thermoplastic", standard: "ISO 294" },
  mold_temperature: { range: "20 – 120 °C", context: "Coolant dependent", standard: "ISO 294" },

  // AI / Token cost
  daily_requests: { range: "100 – 100,000", context: "API call volume" },
  prompt_tokens: { range: "200 – 10,000", context: "Per request average" },
  completion_tokens: { range: "100 – 4,000", context: "Model response" },
  cache_hit_ratio: { range: "10 – 50 %", context: "Semantic cache efficiency" },
  prompt_price: { range: "0.5 – 60 USD/1M", context: "GPT-4 class models" },
  completion_price: { range: "1.5 – 180 USD/1M", context: "GPT-4 class models" },
  safety_buffer: { range: "10 – 25 %", context: "Volatility hedge" },
  monthly_growth_rate: { range: "0 – 20 %", context: "Adoption curve" },

  // Finance (EBITDA, TCO, etc.)
  net_income: { range: "50k – 5M USD", context: "SMB to mid-market" },
  interest_expense: { range: "1k – 500k USD", context: "Debt service" },
  tax_expense: { range: "20k – 2M USD", context: "20–30% of EBT" },
  depreciation: { range: "5k – 1M USD", context: "Straight-line basis" },
  amortization: { range: "0 – 500k USD", context: "Intangible assets" },

  // TPM / OEE
  planned_production_time: { range: "420 – 480 min", context: "Shift length" },
  operating_time: { range: "380 – 470 min", context: "Net run time" },
  downtime_duration: { range: "5 – 480 min", context: "Unplanned stop" },
  hourly_capacity: { range: "60 – 10,000 units", context: "Line throughput" },

  // Compressor
  ideal_power: { range: "50 – 5,000 kW", context: "Isothermal / isentropic" },
  isothermal_efficiency: { range: "0.65 – 0.85", context: "Reciprocating" },
  motor_efficiency: { range: "0.88 – 0.97", context: "IE3 / IE4 class" },
  drive_efficiency: { range: "0.92 – 0.99", context: "VFD / gearbox" },
};

// Unit catalogs by category (for per-input dropdown)
const UNIT_CATALOG: Record<string, string[]> = {
  currency: [...CURRENCIES],
  length: ["mm", "cm", "m", "in", "ft"],
  pressure: ["MPa", "bar", "psi", "kPa", "atm"],
  temperature: ["°C", "°F", "K"],
  time: ["s", "min", "h", "day"],
  mass: ["g", "kg", "t", "lb"],
  volume: ["mL", "L", "m³", "gal"],
  area: ["mm²", "cm²", "m²", "in²"],
  power: ["W", "kW", "MW", "hp"],
  energy: ["J", "kJ", "kWh", "BTU"],
  rate: ["%"],
  count: ["units", "pcs", "tokens"],
};

// Physical sanity bounds (catches unit-mismatch disasters like 50 m wall thickness)
const PHYSICAL_BOUNDS: Record<string, { min: number; max: number; soft?: boolean }> = {
  wall_thickness: { min: 0.1, max: 50 },
  thermal_diffusivity: { min: 0.001, max: 5 },
  melt_temperature: { min: 100, max: 450 },
  mold_temperature: { min: -20, max: 250 },
  pressure: { min: 0, max: 500 },
  radius: { min: 5, max: 5000 },
  allowable_stress: { min: 10, max: 1500 },
  joint_efficiency: { min: 0.1, max: 1.0 },
  corrosion_allowance: { min: 0, max: 20 },
  daily_requests: { min: 0, max: 10_000_000 },
  prompt_tokens: { min: 0, max: 2_000_000 },
  completion_tokens: { min: 0, max: 2_000_000 },
  cache_hit_ratio: { min: 0, max: 100 },
  safety_buffer: { min: 0, max: 100 },
  monthly_growth_rate: { min: -100, max: 500 },
  net_income: { min: -1e9, max: 1e11 },
  interest_expense: { min: 0, max: 1e10 },
  tax_expense: { min: 0, max: 1e10 },
  depreciation: { min: 0, max: 1e10 },
  amortization: { min: 0, max: 1e10 },
  ideal_power: { min: 0, max: 100_000 },
  isothermal_efficiency: { min: 0, max: 1 },
  motor_efficiency: { min: 0.5, max: 1 },
  drive_efficiency: { min: 0.5, max: 1 },
  planned_production_time: { min: 1, max: 1440 },
  operating_time: { min: 0, max: 1440 },
  downtime_duration: { min: 0, max: 10080 },
  hourly_capacity: { min: 0, max: 1_000_000 },
};

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL UI PRIMITIVES (self-contained, no external deps)
// ─────────────────────────────────────────────────────────────────────────────

function MobileOnly({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sc-mobile-only"
      style={{
        display: "none",
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, level = 2 }: { children: React.ReactNode; level?: 1 | 2 | 3 }) {
  const sizes = { 1: 22, 2: 18, 3: 15 };
  return (
    <h3
      style={{
        fontSize: sizes[level],
        fontWeight: 600,
        fontFamily: "var(--serif, Georgia, serif)",
        color: "var(--ink, #1a1a1a)",
        margin: "0 0 12px 0",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h3>
  );
}

function Card({
  children,
  accent,
  padding = 16,
}: {
  children: React.ReactNode;
  accent?: "danger" | "warn" | "signal" | "neutral";
  padding?: number;
}) {
  const colorMap = {
    danger: "var(--danger, #c81e1e)",
    warn: "var(--warn, #d97706)",
    signal: "var(--signal, #0369a1)",
    neutral: "var(--line, #d4d4d4)",
  };
  return (
    <div
      style={{
        borderLeft: `3px solid ${colorMap[accent ?? "neutral"]}`,
        background: "var(--surface-0, #fff)",
        padding,
        borderRadius: 4,
        marginBottom: 12,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface PremiumSchemaToolFormProps {
  schema: PremiumCalculatorSchema;
  locale?: string;
}

export function PremiumSchemaToolForm({ schema }: PremiumSchemaToolFormProps) {
  const toolData = useMemo(() => adaptPremiumSchema(schema), [schema]);

  const [engineResult, setEngineResult] = useState<PremiumSchemaEngineResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [globalOutputUnit, setGlobalOutputUnit] = useState<string>("USD");
  const [inputUnits, setInputUnits] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const latestInputs = useRef<Record<string, unknown>>({});
  const [inputVersion, setInputVersion] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rates, setRates] = useState<Record<string, number>>({});

  // Fetch exchange rates once on mount
  useEffect(() => {
    fetch("/api/exchange-rates")
      .then((r) => r.json())
      .then((d) => setRates(d.rates ?? {}))
      .catch(() => {}); // silent fail, normalizeCurrency handles missing rates
  }, []);

  // Initialize per-input units from schema defaults
  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const inp of schema.inputs) {
      const unit = String(inp.unit ?? "");
      if (unit && unit !== "number") initial[inp.id] = unit;
    }
    setInputUnits(initial);
  }, [schema]);

  // Input validation engine — checks schema min/max + physical bounds
  const runValidation = useCallback(
    (scope: Record<string, unknown>): Record<string, string> => {
      const errs: Record<string, string> = {};
      for (const inp of schema.inputs) {
        const v = scope[inp.id];
        if (typeof v !== "number" || Number.isNaN(v)) continue;

        // Schema-level bounds
        const schemaMin = (inp as any).min;
        const schemaMax = (inp as any).max;
        if (typeof schemaMin === "number" && v < schemaMin) {
          errs[inp.id] = `Below minimum ${schemaMin.toLocaleString("en-US")}`;
          continue;
        }
        if (typeof schemaMax === "number" && v > schemaMax) {
          errs[inp.id] = `Exceeds maximum ${schemaMax.toLocaleString("en-US")}`;
          continue;
        }

        // Physical sanity (catches unit mismatch disasters)
        // Ensure schema constraints take precedence over physical bounds
        if (!errs[inp.id]) {
          const phys = PHYSICAL_BOUNDS[inp.id];
          if (phys) {
            if (v < phys.min) errs[inp.id] = `Physically implausible (min ${phys.min})`;
            else if (v > phys.max) errs[inp.id] = `Physically implausible (max ${phys.max}) — check unit selection`;
          }
        }
      }
      return errs;
    },
    [schema],
  );

  // Currency normalization helper (inline to avoid circular import)
  const normalizeCurrency = useCallback(
    (value: number, from: string, to: string, rates: Record<string, number> | undefined): number => {
      if (from === to) return value;
      if (!rates) return value;
      const fromRate = rates[from] ?? 1;
      const toRate = rates[to] ?? 1;
      // Frankfurter rates are quoted as "1 base = X target"; default base USD
      return (value / fromRate) * toRate;
    },
    [],
  );

  // Compute via premium engine
  const runCompute = useCallback(
    async (scope: Record<string, unknown>) => {
      const errs = runValidation(scope);
      setValidationErrors(errs);
      if (Object.keys(errs).length > 0) {
        setEngineResult(null);
        return;
      }

      setRunning(true);
      setError(null);
      try {
        const raw: SchemaInputValues = buildDefaultSchemaInputs(schema);
        for (const key of Object.keys(scope)) {
          const v = scope[key];
          if (typeof v === "number" && key in raw) {
            const inpSchema = schema.inputs.find((i) => i.id === key);
            const isCurrency =
              inpSchema?.unit === "currency" ||
              inpSchema?.unit === "USD" ||
              String(inpSchema?.unit ?? "").startsWith("currency");
            const fromUnit = inputUnits[key] ?? inpSchema?.unit ?? "USD";
            if (isCurrency && typeof v === "number") {
              raw[key] = normalizeCurrency(v, fromUnit, "USD", rates) as any;
            } else {
              raw[key] = v as any;
            }
          } else if (key in raw && (typeof v === "string" || typeof v === "boolean" || Array.isArray(v))) {
            raw[key] = v as any;
          }
        }
        const result = runPremiumSchemaEngine(schema, raw, "en", globalOutputUnit, rates);
        setEngineResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Computation failed.");
        setEngineResult(null);
      } finally {
        setRunning(false);
      }
    },
    [schema, globalOutputUnit, inputUnits, normalizeCurrency, runValidation, rates],
  );

  // DynamicFormEngine fires onCompute after every user edit
  const handleDynamicCompute = useCallback(
    (scope: Record<string, unknown>, _uncertainties: Record<string, number>) => {
      latestInputs.current = { ...scope };
      setValidationErrors(runValidation(scope));
      setInputVersion((v) => v + 1);
    },
    [runValidation],
  );

  // Debounced auto-recompute (400ms)
  useEffect(() => {
    if (inputVersion === 0) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      runCompute(latestInputs.current);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputVersion, runCompute]);

  // Manual trigger
  const handleManualCompute = useCallback(() => {
    runCompute(latestInputs.current);
  }, [runCompute]);

  // ── renderInputExtra: unit dropdown + reference + validation per input ──
  const renderInputExtra = useCallback(
    (inputId: string) => {
      const inpSchema = schema.inputs.find((i) => i.id === inputId);
      if (!inpSchema) return null;

      const unitType = String(inpSchema.unit ?? "number");
      const availableUnits = UNIT_CATALOG[unitType] ?? null;
      const currentUnit = inputUnits[inputId] ?? unitType;
      const reference = REFERENCE_DB[inputId];
      const validationError = validationErrors[inputId];

      return (
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          {/* Per-input unit dropdown */}
          {availableUnits && availableUnits.length > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--ink-60, #525252)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {LABELS.unit}
              </span>
              <select
                value={currentUnit}
                onChange={(e) =>
                  setInputUnits((prev) => ({ ...prev, [inputId]: e.target.value }))
                }
                style={{
                  padding: "3px 8px",
                  fontSize: 12,
                  border: "1px solid var(--line, #d4d4d4)",
                  borderRadius: 3,
                  background: "var(--surface-0, #fff)",
                  fontFamily: "var(--mono, monospace)",
                  cursor: "pointer",
                }}
              >
                {availableUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reference panel */}
          {reference && (
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--mono, monospace)",
                color: "var(--ink-50, #737373)",
                padding: "5px 8px",
                background: "var(--surface-1, #fafafa)",
                borderLeft: "2px solid var(--line, #d4d4d4)",
                borderRadius: 2,
                marginTop: 4,
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--ink-60, #525252)" }}>
                {LABELS.reference}:
              </span>{" "}
              <span style={{ fontWeight: 600 }}>{reference.range}</span>
              <span style={{ color: "var(--ink-40, #a3a3a3)", margin: "0 6px" }}>·</span>
              <span style={{ fontStyle: "italic" }}>{reference.context}</span>
              {reference.standard && (
                <>
                  <span style={{ color: "var(--ink-40, #a3a3a3)", margin: "0 6px" }}>·</span>
                  <span style={{ fontWeight: 600 }}>{reference.standard}</span>
                </>
              )}
            </div>
          )}

          {/* Inline validation */}
          {validationError && (
            <div
              style={{
                fontSize: 11.5,
                color: "var(--danger, #c81e1e)",
                marginTop: 6,
                padding: "5px 9px",
                background: "rgba(200, 30, 30, 0.06)",
                borderRadius: 3,
                borderLeft: "2px solid var(--danger, #c81e1e)",
                fontFamily: "var(--mono, monospace)",
              }}
            >
              ⚠ {validationError}
            </div>
          )}
        </div>
      );
    },
    [schema, inputUnits, validationErrors],
  );

  // Professional commentary generator (context-aware engineering interpretation)
  const generateCommentary = useCallback(
    (result: PremiumSchemaEngineResult): string => {
      const parts: string[] = [];
      
      if (result.verdict) {
        parts.push(`Primary Status: ${result.verdict}.`);
      }
      
      const primaryOut = result.outputs[0];
      if (primaryOut && typeof primaryOut.raw === "number") {
        const standardRef = REFERENCE_DB[schema.inputs[0]?.id]?.standard;
        const stdNote = standardRef ? ` based on ${standardRef} guidelines` : "";
        parts.push(
          `The resulting ${(primaryOut.label ?? primaryOut.id).toLowerCase()} of ${primaryOut.raw.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })} ${primaryOut.unit ?? ""} dictates the engineering baseline${stdNote}.`
        );
      } else {
        parts.push(`Baseline calculations have been generated successfully.`);
      }

      if (result.thresholdAlerts.length > 0) {
        const critAlerts = result.thresholdAlerts.filter((a) => a.severity === "critical");
        if (critAlerts.length > 0) {
          parts.push(
            `CRITICAL ATTENTION REQUIRED: ${critAlerts.length} boundary condition(s) exceeded safety or regulatory limits (${critAlerts.map(a => a.message).join("; ")}).`
          );
        } else {
          parts.push(
            `Please review ${result.thresholdAlerts.length} operational warning(s) to ensure system reliability.`
          );
        }
      } else {
        parts.push(`All parameters remain within nominal operating thresholds.`);
      }
      
      if (result.suggestedAction) {
        parts.push(`Recommended course of action: ${result.suggestedAction}`);
      }

      return parts.join(" ");
    },
    [schema],
  );

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="premium-schema-tool-form" style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* Standard HMI form via DynamicFormEngine */}
      <DynamicFormEngine
        tool={toolData}
        showMasthead={false}
        onCompute={handleDynamicCompute}
        renderInputExtra={renderInputExtra}
        externalCompute={(scope) => {
          // Synchronous preview for DynamicFormEngine internal display
          const raw: SchemaInputValues = buildDefaultSchemaInputs(schema);
          for (const key of Object.keys(scope)) {
            const v = scope[key];
            if (key in raw && (typeof v === "number" || typeof v === "string" || typeof v === "boolean")) {
              raw[key] = v as any;
            }
          }
          try {
            const result = runPremiumSchemaEngine(schema, raw, "en", globalOutputUnit, undefined);
            const results: Record<string, unknown> = {};
            for (const out of result.outputs) results[out.id] = out.raw;
            return { results };
          } catch {
            return { results: {} };
          }
        }}
      />

      {/* Mobile sticky result bar — wrapped so desktop render is impossible */}
      <MobileOnly>
        <div
          className="mbar"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--ink, #1a1a1a)",
            color: "#fff",
            padding: "12px 16px",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 100,
            fontSize: 14,
          }}
        >
          <span style={{ fontWeight: 600 }}>{LABELS.primaryReadout}</span>
          <span style={{ fontFamily: "var(--mono, monospace)" }}>
            {engineResult?.outputs[0]
              ? `${Number(engineResult.outputs[0].raw).toLocaleString("en-US", { maximumFractionDigits: 2 })} ${engineResult.outputs[0].unit ?? ""}`
              : "—"}
          </span>
        </div>
      </MobileOnly>

      {/* ── PREMIUM REPORT SECTION ── */}
      <div style={{ borderTop: "1px solid var(--line, #d4d4d4)", marginTop: 32, paddingTop: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <SectionTitle level={2}>{LABELS.premiumReport}</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {/* Global output currency */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--ink-60, #525252)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {LABELS.outputCurrency}
              </span>
              <select
                value={globalOutputUnit}
                onChange={(e) => {
                  setGlobalOutputUnit(e.target.value);
                  setInputVersion((v) => v + 1);
                }}
                style={{
                  padding: "6px 12px",
                  border: "1px solid var(--line, #d4d4d4)",
                  borderRadius: 4,
                  background: "var(--surface-0, #fff)",
                  fontSize: 13,
                  fontFamily: "var(--mono, monospace)",
                  cursor: "pointer",
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleManualCompute}
              disabled={running || hasErrors}
              style={{
                minWidth: 180,
                padding: "10px 20px",
                background: hasErrors ? "var(--line, #d4d4d4)" : "var(--ink, #1a1a1a)",
                color: hasErrors ? "var(--ink-50, #737373)" : "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                cursor: running || hasErrors ? "not-allowed" : "pointer",
                transition: "all 120ms ease",
              }}
            >
              {running ? LABELS.calculating : LABELS.computeButton}
            </button>
          </div>
        </div>

        {/* Currency notice */}
        <p
          style={{
            fontSize: 11,
            color: "var(--ink-50, #737373)",
            fontFamily: "var(--mono, monospace)",
            marginBottom: 16,
            lineHeight: 1.6,
          }}
        >
          {LABELS.currencyNotice}
        </p>

        {/* Validation summary */}
        {hasErrors && (
          <Card accent="warn">
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--warn, #d97706)",
                marginBottom: 8,
              }}
            >
              {LABELS.validationErrors}
            </div>
            <div style={{ fontSize: 13 }}>{LABELS.fixBeforeCompute}</div>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20, fontSize: 12, color: "var(--ink-60, #525252)" }}>
              {Object.entries(validationErrors).map(([field, msg]) => {
                const label = schema.inputs.find((i) => i.id === field)?.label ?? field;
                return (
                  <li key={field}>
                    <strong>{label}</strong>: {msg}
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        {/* Error card */}
        {error && (
          <Card accent="danger">
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--danger, #c81e1e)",
                marginBottom: 6,
              }}
            >
              {LABELS.error}
            </div>
            <div style={{ fontSize: 14 }}>{error}</div>
          </Card>
        )}

        {/* Engine results */}
        {engineResult && (
          <div className="premium-results">
            {/* Primary readout */}
            {engineResult.outputs.length > 0 && (
              <div
                style={{
                  background: "linear-gradient(135deg, var(--surface-0, #fff) 0%, var(--surface-1, #fafafa) 100%)",
                  border: "1px solid var(--line, #d4d4d4)",
                  borderRadius: 6,
                  padding: 24,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--ink-50, #737373)",
                    marginBottom: 12,
                  }}
                >
                  {LABELS.primaryReadout}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  {engineResult.outputs.map((out) => (
                    <div key={out.id}>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--ink-60, #525252)",
                          marginBottom: 4,
                          fontFamily: "var(--mono, monospace)",
                        }}
                      >
                        {out.label ?? out.id}
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 600,
                          fontFamily: "var(--serif, Georgia, serif)",
                          color: "var(--ink, #1a1a1a)",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {typeof out.raw === "number"
                          ? out.raw.toLocaleString("en-US", { maximumFractionDigits: 2 })
                          : String(out.raw)}
                        <span
                          style={{
                            fontSize: 14,
                            color: "var(--ink-50, #737373)",
                            marginLeft: 6,
                            fontFamily: "var(--mono, monospace)",
                          }}
                        >
                          {out.unit ?? ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Threshold alerts */}
            {engineResult.thresholdAlerts.length > 0 && (
              <Card accent="warn">
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 10,
                  }}
                >
                  {LABELS.thresholdAlerts}
                </div>
                {engineResult.thresholdAlerts.map((alert, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 12px",
                      background: alert.severity === "critical"
                        ? "rgba(200, 30, 30, 0.06)"
                        : "rgba(217, 119, 6, 0.06)",
                      borderLeft: `3px solid ${alert.severity === "critical" ? "var(--danger, #c81e1e)" : "var(--warn, #d97706)"}`,
                      borderRadius: 3,
                      marginBottom: i < engineResult.thresholdAlerts.length - 1 ? 6 : 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: alert.severity === "critical" ? "var(--danger, #c81e1e)" : "var(--warn, #d97706)",
                        marginBottom: 3,
                      }}
                    >
                      {alert.severity === "critical" ? LABELS.critical : LABELS.warning}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--ink, #1a1a1a)" }}>{alert.message}</div>
                    {typeof alert.value === "number" && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--ink-50, #737373)",
                          fontFamily: "var(--mono, monospace)",
                          marginTop: 3,
                        }}
                      >
                        Value: {alert.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            )}

            {/* Suggested action */}
            {engineResult.suggestedAction && (
              <Card accent="signal">
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--signal, #0369a1)",
                    marginBottom: 6,
                  }}
                >
                  {LABELS.suggestedAction}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{engineResult.suggestedAction}</div>
              </Card>
            )}

            {/* Professional commentary */}
            <Card accent="neutral">
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--ink-60, #525252)",
                  marginBottom: 8,
                }}
              >
                {LABELS.professionalCommentary}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--ink, #1a1a1a)" }}>
                {generateCommentary(engineResult)}
              </div>
            </Card>
          </div>
        )}

        {/* Idle prompt */}
        {!engineResult && !error && !running && !hasErrors && (
          <p style={{ fontSize: 13, color: "var(--ink-50, #737373)", fontStyle: "italic" }}>
            {LABELS.fillPrompt}
          </p>
        )}

        {/* Legal disclaimer — hardcoded EN, no locale */}
        <p
          style={{
            marginTop: 24,
            fontSize: 10.5,
            lineHeight: 1.7,
            color: "var(--ink-50, #737373)",
            fontFamily: "var(--mono, monospace)",
            padding: "12px 14px",
            background: "var(--surface-1, #fafafa)",
            borderLeft: "2px solid var(--line, #d4d4d4)",
            borderRadius: 2,
          }}
        >
          {LEGAL_NOTE}
        </p>

        {/* Feedback button */}
        <div style={{ marginTop: 16 }}>
          <CalculationFeedbackButton
            toolSlug={schema.id}
            toolType="premium"
            locale="en"
            routePath={`/tools/premium-schema/${schema.id}`}
          />
        </div>
      </div>
    </div>
  );
}
