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
import type { ProPreset, ProReportAdapter, ProExecutePayloadAdapter } from "./proToolRegistry";
import { proV2RuntimeReducer, INITIAL_RUNTIME_STATE, type ProV2ExecutionState } from "./proRuntimeReducer";
import { validateProV2Inputs } from "./proValidation";
import { createCreditSession } from "./proSessionClient";
import { executeWithUsageSession } from "./proExecuteClient";
import { emitTraceEvent, enableRuntimeTrace } from "./proRuntimeTrace";
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
  presets: ProPreset[];
  buildReport: ProReportAdapter | undefined;
  buildExecutePayload: ProExecutePayloadAdapter | undefined;
}

export interface FieldEntry {
  value: string;
  unit: string;
}

function generateTraceId(): string {
  return `pro-v2-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function PresetLoader({
  onLoad,
  presets,
}: {
  onLoad: (values: Record<string, string>, units: Record<string, string>) => void;
  presets: { label: string; values: Record<string, string>; units: Record<string, string> }[];
}) {
  if (presets.length === 0) return null;
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
function buildInitialState(presets: ProPreset[]): Record<string, FieldEntry> {
  const state: Record<string, FieldEntry> = {};
  if (presets.length > 0) {
    const preset = presets[0];
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

export default function ProExecutionFormV2({
  toolKey,
  toolName,
  groups,
  hiddenFields,
  executeEndpoint,
  isSignedIn,
  idToken,
  debugRuntime,
  presets,
  buildReport,
  buildExecutePayload,
}: ProExecutionFormV2Props) {
  const [fieldState, setFieldState] = useState<Record<string, FieldEntry>>(() => buildInitialState(presets));
  const [report, setReport] = useState<ProInsightReport | null>(null);
  const [runtime, dispatch] = useReducer(proV2RuntimeReducer, INITIAL_RUNTIME_STATE);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string>>({});
  const traceIdRef = useRef<string>(generateTraceId());
  const runningRef = useRef(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Enable trace on first render if debug mode
  useEffect(() => {
    if (debugRuntime) {
      enableRuntimeTrace(toolKey);
    }
  }, [debugRuntime, toolKey]);

  // Emit trace events
  const trace = useCallback(
    (event: string, data?: Record<string, unknown>) => {
      if (debugRuntime) {
        emitTraceEvent({
          event: event as any,
          traceId: traceIdRef.current,
          slug: toolKey,
          ...data as any,
        });
      }
    },
    [debugRuntime, toolKey],
  );

  // Handle preset/example loading
  const handleLoadExample = useCallback(
    (values: Record<string, string>, units: Record<string, string>) => {
      const newState: Record<string, FieldEntry> = {};
      const allKeys = new Set([...Object.keys(values), ...Object.keys(units)]);
      for (const key of allKeys) {
        newState[key] = {
          value: values[key] ?? "",
          unit: units[key] ?? "",
        };
      }
      setFieldState(newState);
      setReport(null);
      setValidationErrors({});
      setValidationWarnings({});
      dispatch({ type: "RESET" });
      trace("preset_loaded", { values });
    },
    [trace],
  );

  // Handle field input change
  const handleFieldChange = useCallback(
    (fieldId: string, value: string, unit: string) => {
      setFieldState((prev) => ({
        ...prev,
        [fieldId]: { ...prev[fieldId], value, unit },
      }));
      // Clear validation error for this field
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    },
    [],
  );

  // Handle field unit change
  const handleUnitChange = useCallback(
    (fieldId: string, unit: string) => {
      setFieldState((prev) => ({
        ...prev,
        [fieldId]: { ...prev[fieldId], unit },
      }));
    },
    [],
  );

  // Validate inputs client-side
  const validate = useCallback(() => {
    // Build flat values and selectedUnits from fieldState
    const values: Record<string, string> = {};
    const selectedUnits: Record<string, string> = {};
    const allFields = groups.flatMap((g) => g.fields).concat(hiddenFields);
    for (const field of allFields) {
      const entry = fieldState[field.id];
      if (entry) {
        values[field.id] = entry.value;
        selectedUnits[field.id] = entry.unit;
      }
    }

    const result = validateProV2Inputs({
      fields: allFields,
      values,
      selectedUnits,
    });

    // Map blockers to error/warning maps
    const errorMap: Record<string, string> = {};
    const warnMap: Record<string, string> = {};
    for (const b of result.blockers) {
      if (b.severity === "ERROR") {
        errorMap[b.fieldId] = b.message;
      } else {
        warnMap[b.fieldId] = b.message;
      }
    }
    setValidationErrors(errorMap);
    setValidationWarnings(warnMap);
    trace("validation", { valid: result.ok, errors: errorMap });
    return result;
  }, [fieldState, groups, hiddenFields, trace]);

  // Calculate button handler
  const handleCalculate = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      const validation = validate();
      if (!validation.ok) {
        dispatch({ type: "CLIENT_BLOCKED", blockers: validation.blockers });
        trace("calculate_blocked", { reason: "validation_failed" });
        return;
      }

      trace("calculate_started", {});

    // Check auth
      if (!isSignedIn || !idToken) {
        dispatch({ type: "AUTH_REQUIRED" });
        trace("calculate_blocked", { reason: "auth_required" });
        return;
      }

      // Build raw inputs from adapter or default mapping
      let raw_inputs: Record<string, number> = {};
      if (buildExecutePayload) {
        const payload = buildExecutePayload(fieldState, {});
        raw_inputs = payload.raw_inputs;
      } else {
        // Fallback: flat number conversion
        for (const [key, entry] of Object.entries(fieldState)) {
          if (entry.value !== "" && entry.value !== undefined) {
            const num = parseFloat(entry.value);
            if (Number.isFinite(num)) raw_inputs[key] = num;
          }
        }
      }
      trace("execute_payload", { raw_inputs });

      // Session
      dispatch({ type: "SESSION_MINTING" });
      const sessionResp = await createCreditSession(toolKey, idToken);
      trace("session_result", { ok: sessionResp.ok });

      if (!sessionResp.ok) {
        if (sessionResp.status === 402) {
          dispatch({ type: "ENTITLEMENT_REQUIRED", message: sessionResp.error });
        } else {
          dispatch({ type: "SESSION_MINT_FAILED", error: sessionResp.error ?? "Session creation failed" });
        }
        trace("session_failed", { error: sessionResp.error });
        return;
      }

      const usageSessionId: string = sessionResp.usageSessionId;
      const remainingRuns = sessionResp.remainingRuns;
      setSessionId(usageSessionId);
      dispatch({ type: "SESSION_MINTED", usageSessionId, remainingRuns });

      // Execute
      dispatch({ type: "EXECUTING" });
      const executeRaw = await executeWithUsageSession(
        executeEndpoint,
        {
          tool_key: toolKey,
          tool_id: toolKey,
          schema_version: "5.3.1",
          raw_inputs: raw_inputs as Record<string, unknown>,
          selected_units: {},
          engine_inputs: {},
          evidence_state: {},
          client_schema_hash: "",
          usageSessionId: usageSessionId,
        },
      );

      // Type narrow
      if (!executeRaw.ok) {
        dispatch({ type: "NETWORK_ERROR", error: executeRaw.error ?? "Network error" });
        trace("execute_failed", { error: executeRaw.error });
        return;
      }

      trace("execute_result", { status: executeRaw.status, outputCount: executeRaw.outputs?.length });

      if (executeRaw.status === "REVIEW") {
        dispatch({
          type: "SERVER_REVIEW",
          result: {},
          warnings: [],
        });
      } else if (executeRaw.status === "BLOCKED") {
        dispatch({
          type: "SERVER_BLOCKED",
          result: {},
        });
        return;
      } else if (executeRaw.status !== "OK" && executeRaw.status !== "REVIEW") {
        dispatch({ type: "CONTRACT_ERROR", error: `Unexpected status: ${executeRaw.status}` });
        return;
      }

      // Extract outputs
    const outputMap: Record<string, number> = {};
    if (Array.isArray(executeRaw.outputs)) {
      for (const out of executeRaw.outputs) {
        outputMap[out.id] = out.value;
      }
    }
    trace("parsed_outputs", outputMap);

    // Map warnings
    const execWarnings = (executeRaw.warnings ?? []).map((w) => ({
      id: w.id ?? "warning",
      severity: w.severity ?? "WARNING",
      message: w.message ?? "",
    }));

    // Dispatch state
    dispatch({
      type: "SERVER_OK",
      result: outputMap as unknown as Record<string, unknown>,
      warnings: execWarnings,
    });

    // Build report using registry
    if (buildReport) {
      const report = buildReport({
        toolName,
        outputs: outputMap,
        warnings: execWarnings,
        displayInputs: validation.displayInputs ?? {},
        engineInputs: validation.engineInputs as Record<string, number> ?? {},
        traceId: traceIdRef.current,
      });
      setReport(report as ProInsightReport);
      trace("report_built", { sections: Object.keys(report) });
    } else {
      setReport(null);
    }

    // New trace for next run
    traceIdRef.current = generateTraceId();
    } finally {
      runningRef.current = false;
    }
  }, [validate, fieldState, isSignedIn, idToken, toolKey, toolName, buildReport, buildExecutePayload, trace, groups, hiddenFields, executeEndpoint]);

  // Reset handler
  const handleReset = useCallback(() => {
    setFieldState(buildInitialState(presets));
    setReport(null);
    setValidationErrors({});
    setValidationWarnings({});
    setSessionId(null);
    dispatch({ type: "RESET" });
    traceIdRef.current = generateTraceId();
    trace("reset", {});
  }, [presets, trace]);

  // PDF export handler
  const handleExportPdf = useCallback(() => {
    window.print();
    trace("pdf_export", { traceId: traceIdRef.current });
  }, [trace]);

  // Copy summary handler
  const handleCopySummary = useCallback(() => {
    if (!report) return;
    const summary = `Report: ${report.toolName}\n` +
      `Primary KPI: ${report.primaryKpi.value} (${report.primaryKpi.severity})\n` +
      `Decision: ${report.decisionState.state} — ${report.decisionState.summary}\n` +
      `Total Cost: ${report.totalCost}\n` +
      `Recommended Action: ${report.recommendedAction.action}`;
    navigator.clipboard.writeText(summary).catch(() => {});
    trace("copy_summary", {});
  }, [report, trace]);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="pro-v2-form" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1A1915", margin: "0 0 4px 0" }}>
          PRO V2 — {toolName}
        </h1>
        <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
          Tool: <code>{toolKey}</code>
        </p>
      </div>

      {/* Notice */}
      <div
        style={{
          padding: "10px 14px",
          fontSize: "12px",
          color: "#666",
          backgroundColor: "#F5F4EF",
          border: "1px solid #DDD",
          marginBottom: "16px",
        }}
      >
        Example values are pre-loaded. Edit them before using the report for quotation.
      </div>

      {/* Preset Loader */}
      <PresetLoader onLoad={handleLoadExample} presets={presets} />

      {/* Input Groups */}
      {groups.map((group, gi) => (
        <div key={gi} className="pro-v2-section">
          <h2 className="pro-v2-group-title">
            {group.title}
          </h2>
          {group.description && (
            <p className="pro-v2-group-desc">
              {group.description}
            </p>
          )}
          <div className="pro-v2-field-grid">
            {group.fields
              .filter((f) => !f.hidden)
              .map((field) => {
                const entry = fieldState[field.id] ?? { value: "", unit: "" };
                const error = validationErrors[field.id];
                const warning = validationWarnings[field.id];
                const isInvalid = !!error;

                if (field.type === "select" && field.options) {
                  return (
                    <div key={field.id} className="pro-v2-field" data-invalid={isInvalid || undefined}>
                      <label className="pro-v2-field-label">
                        <span>
                          {debugRuntime && field.symbol && <code className="pro-v2-field-symbol">{field.symbol}</code>}
                          {field.label}
                          {field.required && <span className="pro-v2-required">*</span>}
                        </span>
                      </label>
                      <div className="pro-v2-input-row">
                        <select
                          className="pro-v2-option-select"
                          value={entry.value}
                          onChange={(e) => handleUnitChange(field.id, e.target.value)}
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      {field.helpText && <p className="pro-v2-field-helper">{field.helpText}</p>}
                      {error && <p className="pro-v2-field-error">{error}</p>}
                      {warning && <p className="pro-v2-field-warning">{warning}</p>}
                    </div>
                  );
                }

                return (
                  <div key={field.id} className="pro-v2-field" data-invalid={isInvalid || undefined}>
                    <label className="pro-v2-field-label">
                      <span>
                        {debugRuntime && field.symbol && <code className="pro-v2-field-symbol">{field.symbol}</code>}
                        {field.label}
                        {field.required && <span className="pro-v2-required">*</span>}
                      </span>
                    </label>
                    <div className="pro-v2-input-row">
                      <input
                        type="number"
                        className="pro-v2-value-input"
                        value={entry.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value, entry.unit)}
                        placeholder={field.placeholder ?? ""}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                      />
                      {field.allowedUnits && field.allowedUnits.length > 0 && (
                        <select
                          className="pro-v2-unit-select"
                          value={entry.unit || (field.defaultUnit ?? "")}
                          onChange={(e) => handleUnitChange(field.id, e.target.value)}
                        >
                          {field.allowedUnits.map((u) => (
                            <option key={u.unit} value={u.unit}>{u.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    {field.helpText && <p className="pro-v2-field-helper">{field.helpText}</p>}
                    {error && <p className="pro-v2-field-error">{error}</p>}
                    {warning && <p className="pro-v2-field-warning">{warning}</p>}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={handleCalculate}
          style={{
            padding: "14px 28px",
            fontSize: "14px",
            fontWeight: 600,
            backgroundColor: "#BD5D3A",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
          disabled={runtime.executionState === "executing" || runtime.executionState === "session_minting"}
        >
          {runtime.executionState === "executing" || runtime.executionState === "session_minting" ? "Calculating..." : "Calculate"}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "14px 20px",
            fontSize: "13px",
            fontWeight: 500,
            backgroundColor: "#E8E6DE",
            color: "#1A1915",
            border: "1px solid #CCC",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <StateMessage state={runtime.executionState} message={null} />

      {/* Validation Errors Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <div style={{ padding: "12px", backgroundColor: "#FFEBEE", border: "1px solid #BD5D3A", marginBottom: "16px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#BD5D3A", margin: "0 0 4px 0" }}>
            Please fix the following errors:
          </p>
          <ul style={{ margin: 0, paddingLeft: "16px" }}>
            {Object.entries(validationErrors).map(([fieldId, msg]) => (
              <li key={fieldId} style={{ fontSize: "11px", color: "#BD5D3A" }}>{fieldId}: {msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Result Panel */}
      {report && <ProResultPanelV2 report={report} traceId={traceIdRef.current} onExportPdf={handleExportPdf} onCopySummary={handleCopySummary} />}

      <style jsx>{`
        .pro-v2-field-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          column-gap: 22px;
          row-gap: 28px;
        }

        .pro-v2-field {
          background: transparent;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          padding: 0;
          min-width: 0;
          min-height: 0;
        }

        .pro-v2-field-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin: 0 0 10px;
          font-size: 16px;
          font-weight: 700;
          color: #181713;
        }

        .pro-v2-field-symbol {
          font-size: 13px;
          color: #888;
          margin-right: 6px;
        }

        .pro-v2-required {
          color: #BD5D3A;
          margin-left: 2px;
        }

        .pro-v2-input-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(120px, 150px);
          width: 100%;
          min-height: 52px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #d6d1c7;
          border-radius: 4px;
          box-shadow: none;
        }

        .pro-v2-input-row:focus-within {
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.10);
        }

        .pro-v2-value-input {
          flex: 1;
          min-width: 0;
          width: 100%;
          height: 52px;
          padding: 0 16px;
          font-size: 15px;
          font-family: JetBrains Mono, monospace;
          background: #ffffff;
          border: 0;
          outline: none;
          color: #1A1915;
        }

        .pro-v2-unit-select {
          width: 100%;
          min-width: 0;
          height: 52px;
          padding: 0 12px;
          font-size: 13px;
          background: #ffffff;
          border: 0;
          border-left: 1px solid #e1ddd4;
          outline: none;
          color: #1A1915;
          cursor: pointer;
        }

        .pro-v2-option-select {
          width: 100%;
          height: 52px;
          padding: 0 16px;
          font-size: 15px;
          background: #ffffff;
          border: 1px solid #d6d1c7;
          border-radius: 4px;
          outline: none;
          color: #1A1915;
          cursor: pointer;
        }

        .pro-v2-option-select:focus {
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.10);
        }

        .pro-v2-field[data-invalid="true"] .pro-v2-input-row {
          border-color: #b42318;
          box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.08);
        }

        .pro-v2-field[data-invalid="true"] {
          background: transparent;
        }

        .pro-v2-field-helper {
          margin: 9px 0 0;
          color: #858585;
          font-size: 13px;
          line-height: 1.4;
        }

        .pro-v2-field-error {
          margin: 9px 0 0;
          font-size: 13px;
          color: #BD5D3A;
        }

        .pro-v2-field-warning {
          margin: 9px 0 0;
          font-size: 13px;
          color: #B8860B;
        }

        .pro-v2-section {
          padding: 0 0 30px;
          margin: 0 0 30px;
          border-bottom: 1px solid #ded9cf;
        }

        .pro-v2-section:last-child {
          border-bottom: 0;
        }

        .pro-v2-group-title {
          font-size: 14px;
          font-weight: 700;
          color: #1A1915;
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .pro-v2-group-desc {
          font-size: 13px;
          color: #888;
          margin: 0 0 18px 0;
        }

        @media (max-width: 760px) {
          .pro-v2-field-grid {
            grid-template-columns: 1fr;
            row-gap: 22px;
          }
          .pro-v2-input-row {
            grid-template-columns: minmax(0, 1fr) 120px;
          }
        }
      `}</style>
    </div>
  );
}
