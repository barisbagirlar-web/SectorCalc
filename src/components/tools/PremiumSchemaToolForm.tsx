"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DynamicFormEngine } from "@/lib/features/dynamic-form-v2/DynamicFormEngine";
import { adaptPremiumSchema } from "@/lib/features/dynamic-form-v2/premium-schema-adapter";
import type { PremiumCalculatorSchema, PremiumSchemaEngineResult, SchemaInputValues } from "@/lib/features/premium-schema/premium-calculator-schema";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  getSchemaLegalNote,
} from "@/lib/features/premium-schema/premium-schema-engine";
import { fetchExchangeRates, type ExchangeRates } from "@/lib/core/units/currency-converter";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";

interface PremiumSchemaToolFormProps {
  schema: PremiumCalculatorSchema;
  locale: string;
}

export function PremiumSchemaToolForm({ schema, locale }: PremiumSchemaToolFormProps) {
  // Adapt schema → ToolData for DynamicFormEngine
  const toolData = useMemo(() => adaptPremiumSchema(schema), [schema]);

  // Premium engine state
  const [engineResult, setEngineResult] = useState<PremiumSchemaEngineResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Global output unit & currency state
  const [globalOutputUnit, setGlobalOutputUnit] = useState<string>("USD");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates().then((res) => {
      if (res) setExchangeRates(res);
    });
  }, []);

  // Track latest input values from DynamicFormEngine's onCompute
  const latestInputs = useRef<Record<string, unknown>>({});
  const [inputVersion, setInputVersion] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // DynamicFormEngine fires onCompute after every computation
  const handleDynamicCompute = useCallback(
    (scope: Record<string, unknown>, _uncertainties: Record<string, number>) => {
      latestInputs.current = { ...scope };
      setInputVersion((v) => v + 1);
    },
    [],
  );

  // Run premium schema engine
  const handleRunPremium = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const raw: SchemaInputValues = buildDefaultSchemaInputs(schema);
      // Override with latest user inputs
      for (const key of Object.keys(latestInputs.current)) {
        const val = latestInputs.current[key];
        if (key in raw && (typeof val === "number" || typeof val === "string" || typeof val === "boolean" || Array.isArray(val))) {
          // If this field is a currency, convert it FROM globalOutputUnit TO baseUnit
          const inpSchema = schema.inputs.find(i => i.id === key);
          if (inpSchema && (inpSchema.unit === "currency" || inpSchema.unit === "USD" || String(inpSchema.unit).startsWith("currency"))) {
            if (typeof val === "number" && exchangeRates && globalOutputUnit !== "USD") {
               // eslint-disable-next-line @typescript-eslint/no-require-imports
               const { normalizeValue } = require("@/lib/core/units/currency-converter");
               raw[key] = normalizeValue(val, globalOutputUnit, "USD", "currency", exchangeRates.rates);
               continue;
            }
          }
          raw[key] = val as any;
        }
      }
      const result = runPremiumSchemaEngine(schema, raw, locale, globalOutputUnit, exchangeRates?.rates);
      setEngineResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Premium calculation failed.");
    } finally {
      setRunning(false);
    }
  }, [schema]);

  // Reactive auto-compute on input changes (debounced 400ms)
  useEffect(() => {
    if (inputVersion === 0) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      handleRunPremium();
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputVersion, handleRunPremium]);

  const legalNote = getSchemaLegalNote(locale);

  return (
    <div className="premium-schema-tool-form">
      {/* Standard HMI form via DynamicFormEngine */}
      <DynamicFormEngine
        tool={toolData}
        showMasthead={false}
        onCompute={handleDynamicCompute}
        externalCompute={(scope) => {
          const raw: SchemaInputValues = buildDefaultSchemaInputs(schema);
          for (const key of Object.keys(scope)) {
            const val = scope[key];
            if (key in raw && (typeof val === "number" || typeof val === "string" || typeof val === "boolean" || Array.isArray(val))) {
              const inpSchema = schema.inputs.find(i => i.id === key);
              if (inpSchema && (inpSchema.unit === "currency" || inpSchema.unit === "USD" || String(inpSchema.unit).startsWith("currency"))) {
                if (typeof val === "number" && exchangeRates && globalOutputUnit !== "USD") {
                   // eslint-disable-next-line @typescript-eslint/no-require-imports
                   const { normalizeValue } = require("@/lib/core/units/currency-converter");
                   raw[key] = normalizeValue(val, globalOutputUnit, "USD", "currency", exchangeRates.rates);
                   continue;
                }
              }
              raw[key] = val as any;
            }
          }
          const result = runPremiumSchemaEngine(schema, raw, locale, globalOutputUnit, exchangeRates?.rates);
          
          const results: Record<string, unknown> = {};
          for (const out of result.outputs) {
            results[out.id] = out.raw;
          }
          return { results };
        }}
      />

      {/* Premium Report Section */}
      <div className="mt-8" style={{ borderTop: "1px solid var(--line)", paddingTop: 24 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--serif)", color: "var(--ink)" }}>
            Premium Report
          </h2>
          <div className="flex items-center gap-4">
            <select
              className="sc-premium-select"
              value={globalOutputUnit}
              onChange={(e) => {
                setGlobalOutputUnit(e.target.value);
                // Trigger recompute to update output units
                setInputVersion((v) => v + 1);
              }}
              style={{ padding: "6px 12px", border: "1px solid var(--line)", borderRadius: 4, background: "var(--surface-0)", fontSize: 13 }}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
              <option value="GBP">GBP</option>
            </select>
            <button
              type="button"
              className="btn-exec"
              onClick={handleRunPremium}
              disabled={running}
              style={{ minWidth: 180 }}
            >
              {running ? "Calculating\u2026" : "Generate Report"}
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ borderLeft: "3px solid var(--danger)", padding: 16, marginBottom: 16 }}>
            <div className="d-label">ERROR</div>
            <div className="d-text" style={{ fontSize: 14, textTransform: "none" }}>{error}</div>
          </div>
        )}

        {engineResult && (
          <div className="premium-results">
            {/* Threshold alerts */}
            {engineResult.thresholdAlerts.length > 0 && (
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="d-label" style={{ marginBottom: 8 }}>THRESHOLD ALERTS</div>
                  {engineResult.thresholdAlerts.map((alert, i) => (
                    <div
                      key={i}
                      className="card"
                      style={{
                        marginBottom: 6,
                        borderLeft: `3px solid ${alert.severity === "critical" ? "var(--danger)" : "var(--warn)"}`,
                        padding: "8px 12px",
                      }}
                    >
                      <div className="d-sub" style={{ fontSize: 10.5, textTransform: "uppercase" }}>
                        {alert.severity === "critical" ? "CRITICAL" : "WARNING"}
                      </div>
                      <div style={{ fontSize: 13 }}>{alert.message}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-50)", marginTop: 2 }}>
                        Value: {typeof alert.value === "number" ? alert.value.toLocaleString(locale, { maximumFractionDigits: 2 }) : String(alert.value)}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Suggested Action */}
            {engineResult.suggestedAction && (
              <div className="card" style={{ marginBottom: 20, borderLeft: "3px solid var(--signal)" }}>
                <div className="d-label">SUGGESTED ACTION</div>
                <div className="d-text" style={{ fontSize: 14, textTransform: "none" }}>{engineResult.suggestedAction}</div>
              </div>
            )}

            {/* Legal Disclaimer */}
            {legalNote && (
              <p className="mt-6 text-xs leading-relaxed" style={{ color: "var(--ink-50)", fontFamily: "var(--mono)", fontSize: 10.5 }}>
                {legalNote}
              </p>
            )}

            <div className="mt-4">
              <CalculationFeedbackButton
                toolSlug={schema.id}
                toolType="premium"
                locale={locale}
                routePath={`/tools/premium-schema/${schema.id}`}
              />
            </div>
          </div>
        )}

        {!engineResult && !error && !running && (
          <p className="text-sm" style={{ color: "var(--ink-50)" }}>
            Fill in the inputs above and click &quot;Generate Report&quot; to run the premium analysis.
          </p>
        )}
      </div>
    </div>
  );
}
