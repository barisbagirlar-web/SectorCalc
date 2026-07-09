// SectorCalc PRO V2 — Pro Execution Form
// Isolated PRO-only runtime. Does not import Free tool code.
// One Calculate click = one session + one execute.
//
// State contract: fieldState[field.id] = { value: string, unit: string }
//   - select fields: unit = ""
//   - number fields: value + unit both set

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
import { emitTraceEvent, enableRuntimeTrace } from "./proRuntimeTrace";
import { WELD_PRESETS } from "./proWeldFieldContract";
import ProResultPanelV2 from "./ProResultPanelV2";

export interface ProExecutionFormV2Props {
  toolKey: string;
  toolName: string;
  groups: ProFieldGroup[];
  hiddenFields: ProFieldContract[];
  executeEndpoint: string;
  isSignedIn: boolean;
  idToken: string | null;
  debugRuntime?: boolean;
}

export interface FieldEntry {
  value: string;
  unit: string;
}

function generateTraceId(): string {
  return `pro-v2-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function WeldExampleLoader({
  onLoad,
  presets,
}: {
  onLoad: (values: Record<string, string>, units: Record<string, string>) => void;
  presets: { label: string; values: Record<string, string>; units: Record<string, string> }[];
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
        Load Example
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {presets.map((ex, i) => (
          <button
            key={i}
            onClick={() => onLoad(ex.values, ex.units)}
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

/** Build initial state from the default preset */
function buildInitialState(): Record<string, FieldEntry> {
  const state: Record<string, FieldEntry> = {};
  // Pre-populate with the first preset (standard carbon steel 12m)
  if (WELD_PRESETS.length > 0) {
    const preset = WELD_PRESETS[0];
    const allKeys = new Set([
      ...Object.keys(preset.values),
      ...Object.keys(preset.units),
    ]);
    for (const key of allKeys) {
      state[key] = {
        value: preset.values[key] ?? "",
        unit: preset.units[key] ?? "",
      };
    }
  }
  return state;
}

/** Merge preset values+units into existing state */
function mergePresetIntoState(
  prev: Record<string, FieldEntry>,
  values: Record<string, string>,
  units: Record<string, string>,
): Record<string, FieldEntry> {
  const next = { ...prev };
  const allKeys = new Set([...Object.keys(values), ...Object.keys(units)]);
  for (const key of allKeys) {
    next[key] = {
      value: key in values ? values[key] : (next[key]?.value ?? ""),
      unit: key in units ? units[key] : (next[key]?.unit ?? ""),
    };
  }
  return next;
}

export default function ProExecutionFormV2({
  toolKey,
  toolName,
  groups,
  hiddenFields,
  executeEndpoint,
  isSignedIn,
  idToken,
  debugRuntime,
}: ProExecutionFormV2Props) {
  const [runtime, dispatch] = useReducer(proV2RuntimeReducer, INITIAL_RUNTIME_STATE);
  const [fieldState, setFieldState] = useState<Record<string, FieldEntry>>(() => buildInitialState());
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

  // ── Input change handler ──────────────────────────────────────────────
  const handleInputChange = useCallback((fieldId: string, rawValue: string) => {
    setFieldState((prev) => ({
      ...prev,
      [fieldId]: { value: rawValue, unit: prev[fieldId]?.unit ?? "" },
    }));
  }, []);

  // ── Unit change handler ───────────────────────────────────────────────
  const handleUnitChange = useCallback((fieldId: string, unit: string) => {
    setFieldState((prev) => ({
      ...prev,
      [fieldId]: { value: prev[fieldId]?.value ?? "", unit },
    }));
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
  const handleLoadExample = useCallback((exampleValues: Record<string, string>, exampleUnits: Record<string, string>) => {
    setFieldState((prev) => mergePresetIntoState(prev, exampleValues, exampleUnits));
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
    // Full reset: clear everything
    setFieldState({});
    setTouched({});
    setInsightReport(null);
    runningRef.current = false;
    if (debugRuntime) {
      traceIdRef.current = generateTraceId();
      dispatch({ type: "SET_TRACE_ID", traceId: traceIdRef.current });
    }
  }, [debugRuntime]);

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
      markAllTouched();

      // ── Step 1: Local validation ────────────────────────────────────
      // Derive fresh values+units from fieldState
      const vals: Record<string, string> = {};
      const units: Record<string, string> = {};
      for (const [k, entry] of Object.entries(fieldState)) {
        vals[k] = entry.value;
        units[k] = entry.unit;
      }

      const validation = validateProV2Inputs({
        fields: allFields,
        values: vals,
        selectedUnits: units,
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

      // ── Build schema-compatible raw_inputs ──────────────────────────
      // Map form field IDs → schema input IDs. All weld schema inputs
      // have unit_selectable: false, so no selected_units entries are
      // needed — the server normalizer uses base_unit as display_unit
      // (fast path / identity conversion).
      const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
        weld_length: "weld_length_m",
        weld_throat: "weld_throat_mm",
        material_density: "weld_density",
        wire_cost: "wire_cost_per_kg",
        gas_cost: "gas_cost_per_min",
        arc_time: "arc_time_min",
        total_job_time: "weld_time_min",
        labor_rate: "labor_rate",
        shop_overhead_rate: "overhead_rate",
        deposition_efficiency: "deposition_efficiency",
        source_confidence: "source_confidence",
      };
      // HIDDEN_TO_SCHEMA: Hidden form fields → schema input ID + default
      const HIDDEN_TO_SCHEMA: Record<string, { schemaId: string; defaultValue: number }> = {
        material_density: { schemaId: "weld_density", defaultValue: 7.85 },
        source_confidence: { schemaId: "source_confidence", defaultValue: 0.9 },
      };
      const schemaRawInputs: Record<string, number> = {};
      // Populate from visible field state
      for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA_INPUT)) {
        // Skip hidden fields — they come from HIDDEN_TO_SCHEMA or hiddenFields defaults
        if (HIDDEN_TO_SCHEMA[formId]) continue;
        const entry = fieldState[formId];
        if (entry && entry.value !== "" && entry.value !== undefined) {
          const num = parseFloat(entry.value);
          if (Number.isFinite(num)) {
            schemaRawInputs[schemaId] = num;
          }
        }
      }
      // Populate hidden field defaults (required by schema, not shown in form)
      for (const [formId, cfg] of Object.entries(HIDDEN_TO_SCHEMA)) {
        const hEntry = fieldState[formId];
        if (hEntry && hEntry.value !== "" && hEntry.value !== undefined) {
          const num = parseFloat(hEntry.value);
          if (Number.isFinite(num)) {
            schemaRawInputs[cfg.schemaId] = num;
          }
        } else {
          // Use the default from the field contract
          schemaRawInputs[cfg.schemaId] = cfg.defaultValue;
        }
      }
      // planned_quote + contingency are NOT in schema inputs (used only
      // by the client-side insight engine). Include them as raw_inputs
      // so the server response carries them back, even though the
      // formula does not process them.
      for (const extraId of ["planned_quote", "contingency"] as const) {
        const entry = fieldState[extraId];
        if (entry && entry.value !== "" && entry.value !== undefined) {
          const num = parseFloat(entry.value);
          if (Number.isFinite(num)) {
            schemaRawInputs[extraId] = num;
          }
        }
      }

      const executeBody = {
        tool_key: toolKey,
        tool_id: "PRO_027",
        schema_version: "5.3.1",
        raw_inputs: schemaRawInputs,
        // All weld schema inputs have unit_selectable: false → no
        // selected_units entries needed. Server normalizer uses
        // base_unit as display_unit, fast-path identity conversion.
        selected_units: {},
        engine_inputs: validation.engineInputs as Record<string, number>,
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

        const report = buildWeldInsightReport({
          toolName,
          outputs: outputMap,
          warnings,
          displayInputs: validation.displayInputs,
          engineInputs: validation.engineInputs as Record<string, number>,
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
  }, [toolKey, toolName, allFields, fieldState, buildHiddenValues, isSignedIn, idToken, executeEndpoint, runtime.executionState, markAllTouched, debugRuntime, touched]);

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

      {/* Preload notice */}
      <div
        style={{
          padding: "8px 12px",
          marginBottom: "16px",
          fontSize: "11px",
          color: "#888",
          backgroundColor: "#E8E6DE",
          borderLeft: "3px solid #BD5D3A",
        }}
      >
        Example values are pre-loaded. Edit them before using the report for quotation.
      </div>

      {/* Example Loader */}
      <WeldExampleLoader onLoad={handleLoadExample} presets={WELD_PRESETS} />

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
            className="pro-inp-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "12px",
            }}
          >
            {group.fields
              .filter((f) => !f.hidden)
              .map((field) => {
                const entry = fieldState[field.id];
                const isError = runtime.executionState === "client_blocked" && runtime.blockers.some((b) => b.fieldId === field.id);
                const isSelect = field.type === "select";

                return (
                  <div
                    key={field.id}
                    className="pro-inp-item"
                    style={{
                      padding: "12px",
                      backgroundColor: "#E8E6DE",
                      border: isError ? "1px solid #BD5D3A" : "1px solid transparent",
                    }}
                  >
                    {/* Label row */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <label
                        htmlFor={`pro-v2-${field.id}`}
                        style={{ fontSize: "13px", fontWeight: 500, color: "#1A1915" }}
                      >
                        {field.label}
                        {field.required && <span style={{ color: "#BD5D3A", marginLeft: "2px" }}>*</span>}
                      </label>
                      {field.symbol && (
                        <span style={{ fontSize: "11px", color: "#888", fontStyle: "italic" }}>
                          {field.symbol}
                        </span>
                      )}
                    </div>

                    {/* Input row — select vs number bifurcation */}
                    <div className="pro-v2-input-row">
                      {isSelect ? (
                        // ── SELECT TYPE (no unit dropdown) ──────────────────
                        <select
                          id={`pro-v2-${field.id}`}
                          value={entry?.value ?? field.defaultValue ?? ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="pro-v2-select"
                          style={{
                            gridColumn: "1 / -1",
                            width: "100%",
                            height: "48px",
                            padding: "0 14px",
                            fontSize: "15px",
                            fontWeight: 600,
                            border: "1px solid #CCC",
                            backgroundColor: "#F0EEE6",
                            color: "#1A1915",
                          }}
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        // ── NUMBER TYPE (input + unit select) ───────────────
                        <>
                          <input
                            id={`pro-v2-${field.id}`}
                            type="text"
                            inputMode="decimal"
                            value={entry?.value ?? ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="pro-v2-input"
                            data-pro-v2-input="true"
                          />
                          <select
                            value={entry?.unit ?? field.defaultUnit ?? ""}
                            onChange={(e) => handleUnitChange(field.id, e.target.value)}
                            className="pro-v2-unit-select"
                          >
                            {(field.allowedUnits && field.allowedUnits.length > 0
                              ? field.allowedUnits
                              : []
                            ).map((u) => (
                              <option key={u.unit} value={u.unit}>
                                {u.label}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>

                    {/* Help text */}
                    {field.helpText && (
                      <div style={{ fontSize: "10px", color: "#999", marginTop: "6px" }}>
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
            className="pro-calc-btn"
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
        <div style={{ fontSize: "10px", color: "#999", textAlign: "right", maxWidth: "320px" }}>
          Engineering screening output — verify project-specific standards, WPS/PQR requirements, and shop assumptions before business decisions.
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

      {/* Insight Report — renders all premium sections */}
      {insightReport && (
        <ProResultPanelV2
          report={insightReport}
          traceId={traceIdRef.current}
          onExportPdf={handleExportPdf}
          onCopySummary={handleCopySummary}
        />
      )}

      {/* Input + unit grid CSS */}
      <style>{`
        .pro-v2-input-row {
          display: grid;
          grid-template-columns: minmax(140px, 1fr) minmax(120px, 150px);
          align-items: stretch;
          gap: 6px;
        }
        .pro-v2-input,
        input[data-pro-v2-input] {
          min-width: 0;
          width: 100%;
          height: 48px;
          padding: 0 14px;
          font-size: 16px;
          font-weight: 700;
          border: 1px solid #CCC;
          background-color: #F0EEE6;
          color: #1A1915;
          outline: none;
          box-sizing: border-box;
        }
        .pro-v2-unit-select {
          width: 100%;
          min-width: 120px;
          max-width: 150px;
          height: 48px;
          padding: 0 8px;
          font-size: 13px;
          border: 1px solid #CCC;
          background-color: #F0EEE6;
          color: #1A1915;
          box-sizing: border-box;
        }
        .pro-v2-select {
          min-width: 0;
          width: 100%;
          height: 48px;
          padding: 0 14px;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid #CCC;
          background-color: #F0EEE6;
          color: #1A1915;
          outline: none;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .pro-v2-input-row {
            grid-template-columns: 1fr;
          }
          .pro-v2-unit-select {
            max-width: 100%;
          }
        }
      `}</style>

      {/* PDF print stylesheet */}
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
