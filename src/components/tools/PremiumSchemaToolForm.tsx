"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { DynamicFormEngine } from "@/lib/features/dynamic-form-v2/DynamicFormEngine";
import { adaptPremiumSchema } from "@/lib/features/dynamic-form-v2/premium-schema-adapter";
import type { PremiumCalculatorSchema, PremiumSchemaEngineResult } from "@/lib/features/premium-schema/premium-calculator-schema";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
  getSchemaLegalNote,
} from "@/lib/features/premium-schema/premium-schema-engine";
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

  // Track latest input values from DynamicFormEngine's onCompute
  const latestInputs = useRef<Record<string, unknown>>({});

  // DynamicFormEngine fires onCompute after every computation
  const handleDynamicCompute = useCallback(
    (scope: Record<string, unknown>, _uncertainties: Record<string, number>) => {
      latestInputs.current = { ...scope };
    },
    [],
  );

  // Run premium schema engine
  const handleRunPremium = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const raw: Record<string, number | string | boolean> = buildDefaultSchemaInputs(schema);
      // Override with latest user inputs
      for (const key of Object.keys(latestInputs.current)) {
        const val = latestInputs.current[key];
        if (key in raw && (typeof val === "number" || typeof val === "string" || typeof val === "boolean")) {
          raw[key] = val;
        }
      }
      const result = runPremiumSchemaEngine(schema, raw);
      setEngineResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Premium calculation failed.");
    } finally {
      setRunning(false);
    }
  }, [schema]);

  const legalNote = getSchemaLegalNote(locale);

  return (
    <div className="premium-schema-tool-form">
      {/* Standard HMI form via DynamicFormEngine */}
      <DynamicFormEngine
        tool={toolData}
        showMasthead={false}
        onCompute={handleDynamicCompute}
      />

      {/* Premium Report Section */}
      <div className="mt-8" style={{ borderTop: "1px solid var(--line)", paddingTop: 24 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--serif)", color: "var(--ink)" }}>
            Premium Report
          </h2>
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

        {error && (
          <div className="card" style={{ borderLeft: "3px solid var(--danger)", padding: 16, marginBottom: 16 }}>
            <div className="d-label">ERROR</div>
            <div className="d-text" style={{ fontSize: 14, textTransform: "none" }}>{error}</div>
          </div>
        )}

        {engineResult && (
          <div className="premium-results">
            {/* Key metric — big number primary output */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="d-sub" style={{ fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-50)", marginBottom: 4 }}>
                {engineResult.bigNumber.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, fontFamily: "var(--serif)", color: "var(--ink)" }}>
                {engineResult.bigNumber.formatted}
                <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 6, color: "var(--ink-50)" }}>
                  {engineResult.bigNumber.unit}
                </span>
              </div>
            </div>

            {/* All output values */}
            {engineResult.outputs.length > 0 && (
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="d-label" style={{ marginBottom: 8 }}>KEY METRICS</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {engineResult.outputs.filter((o) => !o.isBigNumber).slice(0, 8).map((out) => (
                    <div key={out.id} style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: 3 }}>
                      <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--ink-50)", marginBottom: 2 }}>{out.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>{out.formatted}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-38)" }}>{out.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
