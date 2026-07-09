// SectorCalc PRO V2 — Pro Execution Form
// Isolated PRO-only runtime. Does not import Free tool code.
// One Calculate click = one session + one execute.

"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { ProFieldContract, ProFieldGroup } from "./proFieldContract";
import type { ProInsightReport } from "./proInsightContract";
import type { ExecuteResponse } from "./proExecuteClient";
import { proV2RuntimeReducer, INITIAL_RUNTIME_STATE, type ProV2ExecutionState } from "./proRuntimeReducer";
import { validateProV2Inputs } from "./proValidation";
import { createCreditSession } from "./proSessionClient";
import { executeWithUsageSession } from "./proExecuteClient";
import { buildWeldInsightReport } from "./proInsightEngine";
import { emitTraceEvent, enableRuntimeTrace, isTraceEnabled } from "./proRuntimeTrace";
import { getUnitOptions } from "./proUnitRegistry";
import ProResultPanelV2 from "./ProResultPanelV2";

export interface ProExecutionFormV2Props {
  toolKey: string;
  toolName: string;
  groups: ProFieldGroup[];
  hiddenFields: ProFieldContract[];
  fieldDefaults: Record<string, string>;
  executeEndpoint: string;
  isSignedIn: boolean;
  idToken: string | null;
  debugRuntime?: boolean;
}

function generateTraceId(): string {
  return `pro-v2-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getFirebaseToken(): string | null {
  // Try to get from parent-provided idToken, or from auth state
  // The parent component passes it down
  return null; // actual token comes from props
}

function WeldExampleLoader({ onLoad }: { onLoad: (values: Record<string, string>) => void }) {
  const examples = [
    {
      label: "Standard carbon steel weld (12m)",
      values: {
        weld_length: "12", weld_throat: "6", material: "Carbon steel",
        wire_cost: "4.2", gas_cost: "0.18", arc_time: "45",
        total_job_time: "60", labor_rate: "55", shop_overhead_rate: "25",
        deposition_efficiency: "85", planned_quote: "190", contingency: "10",
      },
    },
    {
      label: "Large structural weld (50m)",
      values: {
        weld_length: "50", weld_throat: "8", material: "Carbon steel",
        wire_cost: "3.8", gas_cost: "0.15", arc_time: "90",
        total_job_time: "120", labor_rate: "65", shop_overhead_rate: "35",
        deposition_efficiency: "80", planned_quote: "850", contingency: "12",
      },
    },
    {
      label: "Small precision weld (2m)",
      values: {
        weld_length: "2", weld_throat: "3", material: "Stainless steel",
        wire_cost: "8.5", gas_cost: "0.25", arc_time: "15",
        total_job_time: "25", labor_rate: "75", shop_overhead_rate: "40",
        deposition_efficiency: "90", planned_quote: "95", contingency: "8",
      },
    },
  ];

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
        Load Example
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => onLoad(ex.values)}
            style={{
              padding: "6px 12px",
              fontSize: "11px",
              backgroundColor: "#E8E6DE",
              color: "#1A1915",
              border: "1px solid #CCC",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StateMessage({ state, message }: { state: ProV2ExecutionState; message?: string | null }) {
  const config: Record<ProV2ExecutionState, { text: string; color: string; bg: string } | null> = {
    idle: null,
    client_blocked: { text: "Please fix validation errors", color: "#BD5D3A", bg: "#FFEBEE" },
    auth_required: { text: "Please sign in to calculate", color: "#1565C0", bg: "#E3F2FD" },
    session_minting: { text: "Creating session...", color: "#1A1915", bg: "#F0EEE6" },
    entitlement_required: { text: message ?? "Insufficient credits", color: "#BD5D3A", bg: "#FFEBEE" },
    session_mint_failed: { text: message ?? "Session creation failed", color: "#BD5D3A", bg: "#FFEBEE" },
    executing: { text: "Calculating...", color: "#1A1915", bg: "#E8E6DE" },
    server_ok: null,
    server_review: { text: "Server review required", color: "#B8860B", bg: "#FFF8E1" },
    server_blocked: { text: message ?? "Server blocked calculation", color: "#BD5D3A", bg: "#FFEBEE" },
    server_reprice: { text: message ?? "Server requires reprice", color: "#BD5D3A", bg: "#FFEBEE" },
    engine_error: { text: message ?? "Engine error", color: "#BD5D3A", bg: "#FFEBEE" },
    contract_error: { text: message ?? "Contract error — unexpected response", color: "#BD5D3A", bg: "#FFEBEE" },
    network_error: { text: message ?? "Network error", color: "#BD5D3A", bg: "#FFEBEE" },
  };

  const cfg = config[state];
  if (!cfg) return null;

  return (
    <div
      style={{
        padding: "12px 16px",
        marginTop: "12px",
        fontSize: "13px",
        fontWeight: 600,
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.color}`,
      }}
    >
      {cfg.text}
    </div>
  );
}

export default function ProExecutionFormV2({
  toolKey,
  toolName,
  groups,
  hiddenFields,
  fieldDefaults,
  executeEndpoint,
  isSignedIn,
  idToken,
  debugRuntime,
}: ProExecutionFormV2Props) {
  const [runtime, dispatch] = useReducer(proV2RuntimeReducer, INITIAL_RUNTIME_STATE);
  const [values, setValues] = useState<Record<string, string>>({ ...fieldDefaults });
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [insightReport, setInsightReport] = useState<ProInsightReport | null>(null);
  const runningRef = useRef(false);
  const traceIdRef = useRef<string>("");

  // Initialize trace
  useEffect(() => {
    if (debugRuntime) {
      enableRuntimeTrace(toolKey);
      traceIdRef.current = generateTraceId();
      dispatch({ type: "SET_TRACE_ID", traceId: traceIdRef.current });
    }
  }, [debugRuntime, toolKey]);

  // Flatten all visible fields
  const allFields = groups.flatMap((g) => g.fields.filter((f) => !f.hidden));

  // Initialize default units
  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const field of allFields) {
      defaults[field.id] = field.defaultUnit;
    }
    setSelectedUnits((prev) => ({ ...defaults, ...prev }));
  }, [toolKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Input change handler ──────────────────────────────────────────────
  const handleInputChange = useCallback((fieldId: string, rawValue: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: rawValue }));
  }, []);

  // ── Unit change handler ───────────────────────────────────────────────
  const handleUnitChange = useCallback((fieldId: string, unit: string) => {
    setSelectedUnits((prev) => ({ ...prev, [fieldId]: unit }));
  }, []);

  // ── Touch handler (for red borders after Calculate) ───────────────────
  const markAllTouched = useCallback(() => {
    const allTouched: Record<string, boolean> = {};
    for (const field of allFields) {
      allTouched[field.id] = true;
    }
    setTouched(allTouched);
  }, [allFields]);

  // ── Example loader ────────────────────────────────────────────────────
  const handleLoadExample = useCallback((exampleValues: Record<string, string>) => {
    setValues((prev) => ({ ...prev, ...exampleValues }));
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
    setValues({ ...fieldDefaults });
    setTouched({});
    setInsightReport(null);
    runningRef.current = false;
    if (debugRuntime) {
      traceIdRef.current = generateTraceId();
      dispatch({ type: "SET_TRACE_ID", traceId: traceIdRef.current });
    }
  }, [fieldDefaults, debugRuntime]);

  // ── PDF export ────────────────────────────────────────────────────────
  const handleExportPdf = useCallback(() => {
    if (typeof window === "undefined") return;
    window.print();
  }, []);

  // ── Copy summary ──────────────────────────────────────────────────────
  const handleCopySummary = useCallback(() => {
    if (!insightReport || typeof navigator === "undefined") return;
    const summary = [
      `${insightReport.toolName}`,
      `Primary Result: ${insightReport.primaryKpi.value}`,
      `Decision: ${insightReport.decisionState.label}`,
      `Cost per Meter: ${insightReport.costPerMeter ?? "N/A"}`,
      `Total Cost: ${insightReport.totalCost ?? "N/A"}`,
      `Recommended: ${insightReport.recommendedAction.action}`,
      `Generated: ${insightReport.generatedAt}`,
    ].join("\n");
    navigator.clipboard.writeText(summary).catch(() => {});
  }, [insightReport]);

  // ── Build hidden engine values ────────────────────────────────────────
  const buildHiddenValues = useCallback((): Record<string, number> => {
    const hv: Record<string, number> = {};
    for (const f of hiddenFields) {
      if (typeof f.defaultValue === "number") {
        hv[f.id] = f.defaultValue;
      }
    }
    return hv;
  }, [hiddenFields]);

  // ── Calculate pipeline ────────────────────────────────────────────────
  const handleCalculate = useCallback(async () => {
    // Guard: prevent double click
    if (runningRef.current) {
      if (debugRuntime) {
        emitTraceEvent({
          event: "PRO_V2_CLICK",
          traceId: traceIdRef.current,
          slug: toolKey,
          executionState: runtime.executionState,
          errorCode: "DUPLICATE_CLICK_IGNORED",
        });
      }
      return;
    }

    const traceId = traceIdRef.current || generateTraceId();
    traceIdRef.current = traceId;

    emitTraceEvent({
      event: "PRO_V2_CLICK",
      traceId,
      slug: toolKey,
      executionState: runtime.executionState,
    });

    runningRef.current = true;

    try {
      // Mark all fields as touched for validation
      markAllTouched();

      // ── Step 1: Local validation ────────────────────────────────────
      const validation = validateProV2Inputs({
        fields: allFields,
        values,
        selectedUnits,
        hiddenValues: buildHiddenValues(),
        isTouched: touched,
      });

      emitTraceEvent({
        event: "PRO_V2_VALIDATE_END",
        traceId,
        slug: toolKey,
        executionState: validation.ok ? "idle" : "client_blocked",
        outputCount: Object.keys(validation.engineInputs).length,
      });

      if (!validation.ok) {
        dispatch({ type: "CLIENT_BLOCKED", blockers: validation.blockers });
        runningRef.current = false;
        return;
      }

      // ── Step 2: Auth check ──────────────────────────────────────────
      if (!isSignedIn || !idToken) {
        dispatch({ type: "AUTH_REQUIRED" });
        runningRef.current = false;
        return;
      }

      // ── Step 3: Mint session ────────────────────────────────────────
      dispatch({ type: "SESSION_MINTING" });

      emitTraceEvent({
        event: "PRO_V2_SESSION_START",
        traceId,
        slug: toolKey,
        executionState: "session_minting",
      });

      const sessionResult = await createCreditSession(toolKey, idToken);

      emitTraceEvent({
        event: "PRO_V2_SESSION_END",
        traceId,
        slug: toolKey,
        httpStatus: sessionResult.ok ? 200 : sessionResult.status,
        usageSessionIdPresent: sessionResult.ok,
      });

      if (!sessionResult.ok) {
        if (sessionResult.status === 402) {
          dispatch({ type: "ENTITLEMENT_REQUIRED", message: sessionResult.error });
        } else {
          dispatch({ type: "SESSION_MINT_FAILED", error: sessionResult.error });
        }
        runningRef.current = false;
        return;
      }

      dispatch({ type: "SESSION_MINTED", usageSessionId: sessionResult.usageSessionId, remainingRuns: sessionResult.remainingRuns });

      // ── Step 4: Execute ─────────────────────────────────────────────
      dispatch({ type: "EXECUTING" });

      emitTraceEvent({
        event: "PRO_V2_EXECUTE_START",
        traceId,
        slug: toolKey,
        usageSessionIdPresent: true,
        executionState: "executing",
      });

      const executeBody = {
        tool_key: toolKey,
        tool_id: "PRO_027",
        schema_version: "5.3.1",
        raw_inputs: validation.displayInputs as unknown as Record<string, unknown>,
        selected_units: { ...selectedUnits },
        engine_inputs: validation.engineInputs,
        evidence_state: {},
        client_schema_hash: "pro-v2-weld-001",
        usageSessionId: sessionResult.usageSessionId,
      };

      const executeResult: ExecuteResponse = await executeWithUsageSession(
        executeEndpoint,
        executeBody,
      );

      emitTraceEvent({
        event: "PRO_V2_EXECUTE_END",
        traceId,
        slug: toolKey,
        httpStatus: executeResult.ok ? 200 : executeResult.status,
        pipeline_state: executeResult.ok ? executeResult.pipeline_state : undefined,
        outputCount: executeResult.ok ? executeResult.outputs.length : 0,
      });

      if (!executeResult.ok) {
        if (executeResult.status === 0) {
          dispatch({ type: "NETWORK_ERROR", error: executeResult.error });
        } else {
          dispatch({ type: "CONTRACT_ERROR", error: executeResult.error });
        }
        runningRef.current = false;
        return;
      }

      // ── Step 5: Handle server response ──────────────────────────────
      if (executeResult.status === "OK") {
        // Build engine outputs map
        const outputMap: Record<string, number> = {};
        for (const out of executeResult.outputs) {
          outputMap[out.id] = out.value;
        }
        const warnings = executeResult.warnings.map((w) => ({
          id: w.id,
          severity: w.severity,
          message: w.message,
        }));

        dispatch({
          type: "SERVER_OK",
          result: outputMap as unknown as Record<string, unknown>,
          warnings,
        });

        // Build premium insight report
        const report = buildWeldInsightReport({
          toolName,
          outputs: outputMap,
          warnings,
          displayInputs: validation.displayInputs,
          traceId,
        });

        setInsightReport(report);

        emitTraceEvent({
          event: "PRO_V2_RESULT_PANEL",
          traceId,
          slug: toolKey,
          executionState: "server_ok",
          outputCount: executeResult.outputs.length,
        });
      } else if (executeResult.status === "REVIEW") {
        dispatch({
          type: "SERVER_REVIEW",
          result: {},
          warnings: executeResult.warnings.map((w) => ({ id: w.id, severity: w.severity, message: w.message })),
        });
      } else if (executeResult.status === "BLOCKED") {
        dispatch({ type: "SERVER_BLOCKED", result: {} });
      } else if (executeResult.status === "REPRICE") {
        dispatch({ type: "SERVER_REPRICE", result: {} });
      } else {
        dispatch({ type: "ENGINE_ERROR", error: `Unexpected status: ${executeResult.status}` });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";

      emitTraceEvent({
        event: "PRO_V2_CONTROLLED_ERROR",
        traceId: traceIdRef.current,
        slug: toolKey,
        errorCode: msg,
        executionState: "contract_error",
      });

      dispatch({ type: "CONTRACT_ERROR", error: msg });
    } finally {
      runningRef.current = false;
    }
  }, [toolKey, toolName, groups, allFields, values, selectedUnits, touched, buildHiddenValues, isSignedIn, idToken, executeEndpoint, runtime.executionState, markAllTouched, debugRuntime, fieldDefaults, hiddenFields]);

  // ── Compute state display ─────────────────────────────────────────────
  const isRunning = runtime.executionState === "session_minting" || runtime.executionState === "executing";

  return (
    <div
      className="pro-tool-card"
      style={{
        backgroundColor: "#F0EEE6",
        padding: "24px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
          PRO CALCULATOR
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1A1915", margin: 0 }}>
          {toolName}
        </h1>
        {debugRuntime && (
          <div style={{ fontSize: "10px", color: "#BD5D3A", marginTop: "4px", fontFamily: "monospace" }}>
            DEBUG TRACE: {traceIdRef.current}
          </div>
        )}
      </div>

      {/* Example Loader */}
      <WeldExampleLoader onLoad={handleLoadExample} />

      {/* Input Groups */}
      {groups.map((group, gi) => (
        <div key={gi} style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1A1915",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            {group.title}
          </h2>
          {group.description && (
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 12px 0" }}>
              {group.description}
            </p>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "12px",
            }}
          >
            {group.fields
              .filter((f) => !f.hidden)
              .map((field) => {
                const isError = runtime.executionState === "client_blocked" && runtime.blockers.some((b) => b.fieldId === field.id);
                const currentUnit = selectedUnits[field.id] ?? field.defaultUnit;
                const units = field.allowedUnits.length > 0
                  ? field.allowedUnits
                  : getUnitOptions(field.unitFamily);

                return (
                  <div
                    key={field.id}
                    style={{
                      padding: "12px",
                      backgroundColor: "#E8E6DE",
                      border: isError ? "1px solid #BD5D3A" : "1px solid transparent",
                    }}
                  >
                    {/* Label row */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <label
                        htmlFor={`pro-v2-${field.id}`}
                        style={{ fontSize: "13px", fontWeight: 500, color: "#1A1915" }}
                      >
                        {field.label}
                        {field.required && <span style={{ color: "#BD5D3A", marginLeft: "2px" }}>*</span>}
                      </label>
                      <span style={{ fontSize: "11px", color: "#888", fontStyle: "italic" }}>
                        {field.symbol}
                      </span>
                    </div>

                    {/* Input row */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      <input
                        id={`pro-v2-${field.id}`}
                        type="text"
                        inputMode="decimal"
                        value={values[field.id] ?? ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        style={{
                          flex: 1,
                          padding: "8px 10px",
                          fontSize: "14px",
                          border: "1px solid #CCC",
                          backgroundColor: "#F0EEE6",
                          color: "#1A1915",
                          outline: "none",
                          minHeight: "36px",
                        }}
                      />
                      <select
                        value={currentUnit}
                        onChange={(e) => handleUnitChange(field.id, e.target.value)}
                        style={{
                          padding: "8px 6px",
                          fontSize: "12px",
                          border: "1px solid #CCC",
                          backgroundColor: "#F0EEE6",
                          color: "#1A1915",
                          minWidth: "70px",
                          minHeight: "36px",
                        }}
                      >
                        {units.map((u) => (
                          <option key={u.unit} value={u.unit}>
                            {u.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Help text */}
                    {field.helpText && (
                      <div style={{ fontSize: "10px", color: "#999", marginTop: "4px" }}>
                        {field.helpText}
                      </div>
                    )}

                    {/* Error message */}
                    {isError && (
                      <div style={{ fontSize: "11px", color: "#BD5D3A", marginTop: "4px", fontWeight: 500 }}>
                        {runtime.blockers.find((b) => b.fieldId === field.id)?.message}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Action Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid #CCC",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={handleCalculate}
            disabled={isRunning}
            style={{
              padding: "12px 32px",
              fontSize: "14px",
              fontWeight: 700,
              backgroundColor: isRunning ? "#CCC" : "#BD5D3A",
              color: "#F0EEE6",
              border: "none",
              cursor: isRunning ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              minHeight: "48px",
              minWidth: "140px",
            }}
          >
            {isRunning ? "Calculating..." : "Calculate"}
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            style={{
              padding: "12px 24px",
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "transparent",
              color: "#1A1915",
              border: "1px solid #1A1915",
              cursor: isRunning ? "not-allowed" : "pointer",
              minHeight: "48px",
            }}
          >
            Reset
          </button>
        </div>
        <div style={{ fontSize: "10px", color: "#999", textAlign: "right" }}>
          Based on ISO 5817, AWS D1.1, and EN 1011-2 standards.
          Technical simulation — verify before business decisions.
        </div>
      </div>

      {/* Runtime state messages */}
      <StateMessage state={runtime.executionState} message={runtime.errorMessage} />

      {/* Validation blockers list */}
      {runtime.executionState === "client_blocked" && runtime.blockers.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          {runtime.blockers.map((b, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                marginBottom: "4px",
                fontSize: "12px",
                color: "#BD5D3A",
                backgroundColor: "#FFEBEE",
                border: "1px solid #BD5D3A",
              }}
            >
              {b.fieldId}: {b.message}
            </div>
          ))}
        </div>
      )}

      {/* Insight Report */}
      {insightReport && (
        <ProResultPanelV2
          report={insightReport}
          traceId={traceIdRef.current}
          onExportPdf={handleExportPdf}
          onCopySummary={handleCopySummary}
        />
      )}

      {/* PDF Export Stylesheet (print CSS) */}
      <style>{`
        @media print {
          body { background: white; }
          .pro-tool-card { max-width: 100% !important; padding: 0 !important; }
          button, select { display: none !important; }
          input { border: none !important; background: transparent !important; }
        }
      `}</style>
    </div>
  );
}
