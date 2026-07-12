// SectorCalc SuperV4 Universal Industrial Decision Form — React State Machine Hook V5.3.1
// The public client performs unit preview and client precheck only. It never executes formulas.

"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type {
  ExecuteRequest,
  ExecuteResponse,
  ProfileMode,
  RedactionStatus,
  SuperV4Input,
  SuperV4Schema,
} from "./contract-types";
import {
  createInitialUniversalFormState,
  universalFormMachineReducer,
  type EvidenceFieldState,
  type NormalizedPreviewItem,
  type UniversalFormMachineState,
  type ValidationIssue,
} from "./form-state-machine";
import { generateTraceId, proTrace, buildTraceEntry, setTraceSlug, isDebugRuntime } from "./pro-runtime-trace";
import { getFormToSchemaMap, buildExecutePayload } from "./pro-execute-payload-adapter";

export interface MachineOptions {
  schema: SuperV4Schema;
  schemaHash?: string | null;
  initialProfileMode?: ProfileMode;
  executeEndpoint?: string;
  usageSessionId?: string | null;
  authToken?: string;
  fetcher?: (url: string, init: RequestInit) => Promise<Response>;
  validateSchema?: (schema: SuperV4Schema) => string[];
}

export interface MachineApi {
  state: UniversalFormMachineState;
  setProfileMode: (mode: ProfileMode) => void;
  setInputValue: (inputId: string, value: string | number | boolean | null) => void;
  setSelectedUnit: (inputId: string, unit: string) => void;
  updateEvidence: (inputId: string, patch: Partial<EvidenceFieldState>) => void;
  runClientPrecheck: () => ValidationIssue[];
  submitServerExecution: () => Promise<void>;
  resetInputs: () => void;
  resetResultOnly: () => void;
  toggleGroup: (groupId: string) => void;
  setAdvancedVisible: (visible: boolean) => void;
  normalizedPreview: NormalizedPreviewItem[];
  blockers: ValidationIssue[];
  canExecute: boolean;
  requestCheckout: () => Promise<string | null>;
}

const DEFAULT_ENDPOINT = "/api/pro-calculator/execute";

const REDACTION_STATUSES: ReadonlySet<RedactionStatus> = new Set([
  "PUBLIC_SAFE_REDACTED",
  "INTERNAL_TRACE_RESTRICTED",
  "REDACTION_NOT_REQUIRED",
  "REDACTION_FAILED_BLOCKED",
]);

export function useUniversalIndustrialDecisionFormMachine(options: MachineOptions): MachineApi {
  const [state, dispatch] = useReducer(
    universalFormMachineReducer,
    options.initialProfileMode ?? "engineering",
    createInitialUniversalFormState,
  );

  const executeEndpoint = options.executeEndpoint ?? DEFAULT_ENDPOINT;
  const fetcher = options.fetcher ?? fetch;
  const currentToolKey = options.schema.tool_key;
  const pendingToolKeyRef = useRef<string | null>(null);
  const loadedToolKeyRef = useRef<string>(currentToolKey);

  useEffect(() => {
    // Stale schema load protection: ignore schema updates for a different tool
    if (options.schema.tool_key !== loadedToolKeyRef.current) {
      loadedToolKeyRef.current = options.schema.tool_key;
    }
    dispatch({ type: "INIT_SCHEMA", schema: options.schema, schema_hash: options.schemaHash ?? null });
    const errors = options.validateSchema ? options.validateSchema(options.schema) : validateMinimumV531FormContract(options.schema);
    dispatch({ type: "VALIDATE_SCHEMA_CONTRACT", errors });
  }, [options.schema, options.schemaHash, options.validateSchema]);

  const normalizedPreview = useMemo(
    () => buildNormalizedPreview(options.schema, state.rawInputState, state.selectedUnitState),
    [options.schema, state.rawInputState, state.selectedUnitState],
  );

  const normalizedPreviewErrors = useMemo(
    () => validateNormalizedPreview(options.schema, normalizedPreview),
    [options.schema, normalizedPreview],
  );

  useEffect(() => {
    dispatch({ type: "UPDATE_NORMALIZED_PREVIEW", items: normalizedPreview, errors: normalizedPreviewErrors });
  }, [normalizedPreview, normalizedPreviewErrors]);

  const runClientPrecheck = useCallback((): ValidationIssue[] => {
    const issues = runV531ClientPrecheck(options.schema, state.rawInputState, state.selectedUnitState, state.evidenceState);
    dispatch({ type: "RUN_CLIENT_PRECHECK", issues });
    return issues;
  }, [options.schema, state.evidenceState, state.rawInputState, state.selectedUnitState]);

  const traceIdRef = useRef<string | null>(null);
  const submitServerExecution = useCallback(async (): Promise<void> => {
    const traceId = generateTraceId();
    traceIdRef.current = traceId;
    setTraceSlug(options.schema.tool_key);
    proTrace("PRO_CLICK", buildTraceEntry(traceId, "PRO_CLICK", {
      slug: options.schema.tool_key,
      userEmail: null,
      isOwnerBypass: options.usageSessionId === "bypass-unlimited",
      executionStateBefore: state.executionState,
    }));

    const issues = runV531ClientPrecheck(options.schema, state.rawInputState, state.selectedUnitState, state.evidenceState);
    const blockers = issues.filter((issue) => issue.severity === "BLOCKER" || issue.severity === "CRITICAL");
    dispatch({ type: "RUN_CLIENT_PRECHECK", issues });

    proTrace("PRO_CLIENT_PRECHECK", buildTraceEntry(traceId, "PRO_CLIENT_PRECHECK", {
      issueCount: issues.length,
      blockerCount: blockers.length,
      blockers: blockers.map((b) => b.id),
    }));

    if (blockers.length > 0) {
      dispatch({ type: "BLOCK_CLIENT_EXECUTION", blockers });
      proTrace("PRO_BLOCKED", buildTraceEntry(traceId, "PRO_BLOCKED", {
        blockers: blockers.map((b) => ({ id: b.id, message: b.message })),
        executionStateAfter: "client_precheck_blocked",
      }));
      return;
    }

    const requestToolKey = currentToolKey;
    pendingToolKeyRef.current = requestToolKey;
    dispatch({ type: "SUBMIT_SERVER_EXECUTION" });

    // Build payload through the explicit form→schema adapter
    const formToSchemaMap = getFormToSchemaMap(options.schema.tool_key);
    const adapterPayload = buildExecutePayload({
      formState: state.rawInputState as Record<string, string | number | boolean | null>,
      selectedUnits: state.selectedUnitState,
      toolKey: options.schema.tool_key,
      toolId: options.schema.tool_id,
      schemaVersion: options.schema.metadata.schema_version,
      usageSessionId: options.usageSessionId ?? null,
      formToSchemaMap: formToSchemaMap ?? state.rawInputState as unknown as Record<string, string>,
      outputUnits: {},
      displayCurrency: null,
      scenarioRequest: state.scenarioState.request,
      userProfileMode: state.profileModeState.mode,
      clientSchemaHash: state.schemaState.schema_hash ?? undefined,
    });

    // Build the complete request with evidence and session data
    const request: ExecuteRequest & { usageSessionId?: string | null } = {
      ...adapterPayload,
      evidence_state: serializeEvidenceState(state.evidenceState),
    } as ExecuteRequest & { usageSessionId?: string | null };

    proTrace("PRO_EXECUTE_START", buildTraceEntry(traceId, "PRO_EXECUTE_START", {
      slug: options.schema.tool_key,
      usageSessionIdPresent: !!options.usageSessionId,
      inputKeys: Object.keys(state.rawInputState),
      selectedUnits: state.selectedUnitState,
    }));

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (options.authToken) {
        headers["Authorization"] = `Bearer ${options.authToken}`;
      }
      const response = await fetcher(executeEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
      });

      // Stale response protection: ignore if tool changed while request was in flight
      if (pendingToolKeyRef.current !== requestToolKey || requestToolKey !== currentToolKey) {
        return;
      }

      const payload = (await response.json()) as unknown;
      const contractResult = parseExecuteResponse(payload);

      if (!response.ok || !contractResult.ok) {
        // Even on HTTP error, try to extract structured BLOCKED response with warnings
        if (!response.ok && contractResult.ok) {
          // HTTP error with valid response body — show BLOCKED state with server warnings
          dispatch({ type: "RECEIVE_SERVER_BLOCKERS", blockers: contractResult.response.warnings });
        }
        dispatch({
          type: "RECEIVE_SERVER_ERROR",
          message: contractResult.ok ? `Server execution failed with HTTP ${response.status}.` : contractResult.error,
        });
        proTrace("PRO_EXECUTE_END", buildTraceEntry(traceId, "PRO_EXECUTE_END", {
          httpStatus: response.status,
          pipeline_state: "ERROR",
          status: "error",
          outputCount: 0,
          errorCode: contractResult.ok ? `HTTP_${response.status}` : contractResult.error,
        }));
        return;
      }

      if (contractResult.response.redaction_status === "REDACTION_FAILED_BLOCKED") {
        dispatch({
          type: "RECEIVE_SERVER_ERROR",
          message: "Public response redaction failed and was blocked by the V5.3.1 contract.",
        });
        proTrace("PRO_EXECUTE_END", buildTraceEntry(traceId, "PRO_EXECUTE_END", {
          httpStatus: response.status,
          pipeline_state: "REDACTION_FAILED",
          status: "error",
          outputCount: 0,
          errorCode: "REDACTION_FAILED",
        }));
        return;
      }

      // Stale response check
      if (pendingToolKeyRef.current !== requestToolKey) {
        return;
      }

      if (contractResult.response.status === "BLOCKED") {
        dispatch({ type: "RECEIVE_SERVER_BLOCKERS", blockers: contractResult.response.warnings });
      }

      dispatch({ type: "RECEIVE_SERVER_RESPONSE", response: contractResult.response });
      const outputs = contractResult.response.outputs ?? [];
      proTrace("PRO_EXECUTE_END", buildTraceEntry(traceId, "PRO_EXECUTE_END", {
        httpStatus: response.status,
        pipeline_state: contractResult.response.pipeline_state ?? contractResult.response.status,
        status: contractResult.response.status,
        outputCount: outputs.length,
        errorCode: null,
      }));
    } catch (error) {
      // Stale: ignore error from a request for a different tool
      if (pendingToolKeyRef.current !== requestToolKey) {
        return;
      }
      dispatch({
        type: "RECEIVE_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Server execution failed with an unknown error.",
      });
    }
  }, [executeEndpoint, fetcher, options.authToken, options.schema, state.evidenceState, state.profileModeState.mode, state.rawInputState, state.scenarioState.request, state.schemaState.schema_hash, state.selectedUnitState, options.usageSessionId]);

  const setProfileMode = useCallback((mode: ProfileMode) => {
    dispatch({ type: "SET_PROFILE_MODE", mode });
  }, []);

  const setInputValue = useCallback((inputId: string, value: string | number | boolean | null) => {
    dispatch({ type: "SET_INPUT_VALUE", input_id: inputId, value });
  }, []);

  const setSelectedUnit = useCallback((inputId: string, unit: string) => {
    const input = options.schema.inputs.find((candidate) => candidate.id === inputId);
    const currentValue = state.rawInputState[inputId];
    const currentUnit = state.selectedUnitState[inputId];

    if (input && typeof currentValue === "number" && currentUnit && unit !== currentUnit) {
      const preserved = preserveDisplayQuantity(
        currentValue,
        currentUnit,
        unit,
        input.quantity_kind,
        options.schema.unit_conversion_contract.conversion_registry,
      );
      dispatch({
        type: "PRESERVE_PHYSICAL_QUANTITY_ON_UNIT_CHANGE",
        input_id: inputId,
        value: preserved.ok ? preserved.value : currentValue,
        unit,
      });
      return;
    }

    dispatch({ type: "SET_SELECTED_UNIT", input_id: inputId, unit });
  }, [options.schema.inputs, options.schema.unit_conversion_contract.conversion_registry, state.rawInputState, state.selectedUnitState]);

  const updateEvidence = useCallback((inputId: string, patch: Partial<EvidenceFieldState>) => {
    const current = state.evidenceState[inputId] ?? {
      enabled: false,
      source_verified: false,
      user_verified: false,
      uploaded_references: [],
    };
    dispatch({ type: "UPDATE_EVIDENCE_STATUS", input_id: inputId, evidence: { ...current, ...patch } });
  }, [state.evidenceState]);

  const resetInputs = useCallback(() => dispatch({ type: "RESET_INPUTS" }), []);
  const resetResultOnly = useCallback(() => dispatch({ type: "RESET_RESULT_ONLY" }), []);
  const toggleGroup = useCallback((groupId: string) => dispatch({ type: "TOGGLE_GROUP", group_id: groupId }), []);
  const setAdvancedVisible = useCallback((visible: boolean) => dispatch({ type: "SET_ADVANCED_VISIBLE", visible }), []);

  const requestCheckout = useCallback(async (): Promise<string | null> => {
    const hook = state.premiumHookState.hook;
    if (!hook) return null;

    try {
      const checkoutResponse = await fetcher("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolKey: currentToolKey,
          priceLookupKey: hook.cta.price_lookup_key,
          intent: hook.cta.checkout_intent,
        }),
      });

      if (!checkoutResponse.ok) return null;
      const data = (await checkoutResponse.json()) as { url?: string };
      return data.url ?? null;
    } catch {
      return null;
    }
  }, [state.premiumHookState.hook, fetcher, currentToolKey]);

  return {
    state,
    setProfileMode,
    setInputValue,
    setSelectedUnit,
    updateEvidence,
    runClientPrecheck,
    submitServerExecution,
    resetInputs,
    resetResultOnly,
    toggleGroup,
    setAdvancedVisible,
    normalizedPreview: state.normalizedPreviewState.items,
    blockers: state.blockerState.blockers,
    canExecute: state.blockerState.can_execute && state.executionState !== "executing",
    requestCheckout,
  };
}

function validateMinimumV531FormContract(schema: SuperV4Schema): string[] {
  const errors: string[] = [];

  if (schema.form_runtime_binding.renderer !== "UniversalIndustrialDecisionForm") {
    errors.push("form_runtime_binding.renderer must be UniversalIndustrialDecisionForm.");
  }
  if (schema.form_runtime_binding.llm_runtime_usage !== "FORBIDDEN") {
    errors.push("Runtime LLM usage must be forbidden.");
  }
  if (schema.form_runtime_binding.client_formula_execution !== "FORBIDDEN") {
    errors.push("Client formula execution must be forbidden.");
  }
  if (!schema.form_runtime_binding.server_execution_required) {
    errors.push("Server execution is required.");
  }
  if (!schema.form_runtime_binding.state_management_required) {
    errors.push("State management is required.");
  }
  if (schema.ui_contract.target_renderer !== "UniversalIndustrialDecisionForm") {
    errors.push("ui_contract.target_renderer must be UniversalIndustrialDecisionForm.");
  }
  if (!schema.form_runtime_binding.execute_response_contract.redaction_status) {
    errors.push("execute_response_contract.redaction_status is required by V5.3.1.");
  }

  const normalizedIds = new Set(schema.normalized_inputs.map((input) => input.id));
  for (const input of schema.inputs) {
    if (input.unit_selectable && input.normalized_id && !normalizedIds.has(input.normalized_id)) {
      errors.push(`Input ${input.id} references missing normalized input ${input.normalized_id}.`);
    }
    if (input.criticality === "CRITICAL" && input.default_policy !== "NO_DEFAULT") {
      errors.push(`Critical input ${input.id} must not use a hidden or automatic default.`);
    }
  }

  return errors;
}

function buildNormalizedPreview(
  schema: SuperV4Schema,
  rawInputs: Record<string, string | number | boolean | null>,
  selectedUnits: Record<string, string>,
): NormalizedPreviewItem[] {
  return schema.inputs.map((input) => {
    const rawValue = rawInputs[input.id] ?? null;
    const displayUnit = input.unit_selectable ? selectedUnits[input.id] ?? input.allowed_display_units[0] ?? null : null;
    const baseUnit = input.base_unit;
    const normalizedId = input.normalized_id ?? input.id;

    if (!input.unit_selectable || typeof rawValue !== "number" || !displayUnit || !baseUnit) {
      return {
        input_id: input.id,
        normalized_id: normalizedId,
        display_value: rawValue,
        display_unit: displayUnit,
        base_value: rawValue,
        base_unit: baseUnit,
      };
    }

    const conversion = convertDisplayToBase(rawValue, displayUnit, baseUnit, input.quantity_kind, schema.unit_conversion_contract.conversion_registry);

    return {
      input_id: input.id,
      normalized_id: normalizedId,
      display_value: rawValue,
      display_unit: displayUnit,
      base_value: conversion.ok ? conversion.value : null,
      base_unit: baseUnit,
    };
  });
}

function validateNormalizedPreview(schema: SuperV4Schema, preview: NormalizedPreviewItem[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const item of preview) {
    const input = schema.inputs.find((candidate) => candidate.id === item.input_id);
    if (!input) continue;
    if (input.unit_selectable && typeof item.display_value === "number" && item.base_value === null) {
      issues.push({
        id: `UNIT_CONVERSION_${input.id}`,
        severity: "BLOCKER",
        input_id: input.id,
        message: `No supported conversion exists for ${input.name}.`,
        suggested_action: "Select a supported display unit or update the schema conversion registry.",
      });
    }
  }

  return issues;
}

function runV531ClientPrecheck(
  schema: SuperV4Schema,
  rawInputs: Record<string, string | number | boolean | null>,
  selectedUnits: Record<string, string>,
  evidenceState: Record<string, EvidenceFieldState>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (schema.schemaContainsPublicFormulaLeak) {
    issues.push({
      id: "PUBLIC_FORMULA_LEAK",
      severity: "BLOCKER",
      message: "Schema contains a public formula leak marker.",
      suggested_action: "Reject this schema and regenerate it with protected methodology only.",
    });
  }

  for (const input of schema.inputs) {
    const value = rawInputs[input.id];
    const selectedUnit = selectedUnits[input.id];
    const evidence = evidenceState[input.id];

    if (input.required && isEmptyValue(value)) {
      issues.push({
        id: `MISSING_REQUIRED_${input.id}`,
        severity: input.criticality === "CRITICAL" ? "BLOCKER" : "WARNING",
        input_id: input.id,
        message: `${input.name} is required before server execution.`,
        suggested_action: "Enter the measured or verified value.",
      });
    }

    if (input.unit_selectable && !selectedUnit) {
      issues.push({
        id: `MISSING_UNIT_${input.id}`,
        severity: "BLOCKER",
        input_id: input.id,
        message: `${input.name} requires a selected display unit.`,
        suggested_action: "Select a supported unit from the unit dropdown.",
      });
    }

    if (typeof value === "number" && !Number.isFinite(value)) {
      issues.push({
        id: `NON_FINITE_${input.id}`,
        severity: "BLOCKER",
        input_id: input.id,
        message: `${input.name} must be a finite numeric value.`,
        suggested_action: "Replace the value with a finite measured number.",
      });
    }

    const bounds = input.physical_hard_bounds;
    if (typeof value === "number" && bounds) {
      // BUG FIX: When input is unit_selectable, the display value may be in a different
      // unit than the bounds unit (e.g. percent display vs ratio bounds).
      // Convert to base unit before comparing to avoid false BLOCKER.
      let effectiveValue = value;
      if (input.unit_selectable && selectedUnit && input.base_unit) {
        const converted = convertDisplayToBase(
          value,
          selectedUnit,
          input.base_unit,
          input.quantity_kind,
          schema.unit_conversion_contract.conversion_registry,
        );
        if (converted.ok) {
          effectiveValue = converted.value;
        }
      }
      if (bounds.min !== null && effectiveValue < bounds.min) {
        issues.push({
          id: `PHYSICAL_BOUND_MIN_${input.id}`,
          severity: bounds.violation_behavior === "BLOCK" ? "BLOCKER" : "WARNING",
          input_id: input.id,
          message: bounds.semantic_error_message_min || bounds.semantic_error_message || `${input.name} is below the physical hard bound.`,
          suggested_action: "Check the entered value, unit, measurement source, or schema hard bound.",
        });
      }
      if (bounds.max !== null && effectiveValue > bounds.max) {
        issues.push({
          id: `PHYSICAL_BOUND_MAX_${input.id}`,
          severity: bounds.violation_behavior === "BLOCK" ? "BLOCKER" : "WARNING",
          input_id: input.id,
          message: bounds.semantic_error_message_max || bounds.semantic_error_message || `${input.name} is above the physical hard bound.`,
          suggested_action: "Check the entered value, unit, measurement source, or schema hard bound.",
        });
      }
    }

    // Auto-verify evidence when the user has entered a valid value and
    // the accepted evidence types include "user-provided value" or "engineering estimate".
    // This prevents the precheck from blocking execution when the user has
    // already provided the value (the value IS the user-provided evidence).
    const hasValue = !isEmptyValue(value);
    const evReq = input.evidence_requirement;
    const acceptedEvidence = typeof evReq === "object" && evReq !== null ? evReq.accepted_evidence : [];
    const hasUserProvidedEvidence = hasValue &&
      (acceptedEvidence.includes("user-provided value") ||
       acceptedEvidence.includes("engineering estimate"));
    const evidenceOk = !requiresEvidence(input) || (evidence?.user_verified === true) || hasUserProvidedEvidence;

    if (!evidenceOk) {
      issues.push({
        id: `EVIDENCE_GAP_${input.id}`,
        severity: input.criticality === "CRITICAL" ? "BLOCKER" : "REVIEW",
        input_id: input.id,
        message: `${input.name} requires source evidence before server execution.`,
        suggested_action: "Confirm source evidence or upload/record the supporting reference.",
      });
    }
  }

  return issues;
}

function requiresEvidence(input: SuperV4Input): boolean {
  if (typeof input.evidence_requirement === "string") {
    return input.evidence_requirement.toLowerCase().includes("required");
  }
  return input.evidence_requirement.required;
}

function serializeEvidenceState(state: Record<string, EvidenceFieldState>): Record<string, unknown> {
  return Object.entries(state).reduce<Record<string, unknown>>((accumulator, [inputId, evidence]) => {
    accumulator[inputId] = {
      enabled: evidence.enabled,
      source_verified: evidence.source_verified,
      user_verified: evidence.user_verified,
      uploaded_references: evidence.uploaded_references,
    };
    return accumulator;
  }, {});
}

function parseExecuteResponse(payload: unknown): { ok: true; response: ExecuteResponse } | { ok: false; error: string } {
  if (!isRecord(payload)) return { ok: false, error: "Execute response is not an object." };
  if (typeof payload.status !== "string") return { ok: false, error: "Execute response status is missing." };
  if (typeof payload.redaction_status !== "string" || !REDACTION_STATUSES.has(payload.redaction_status as RedactionStatus)) {
    return { ok: false, error: "Execute response redaction_status is missing or invalid." };
  }
  if (!isRecord(payload.audit_seal)) return { ok: false, error: "Execute response audit_seal is missing." };
  if (payload.audit_seal.redaction_status !== payload.redaction_status) {
    return { ok: false, error: "ExecuteResponse.redaction_status and AuditSeal.redaction_status must match." };
  }

  return { ok: true, response: payload as unknown as ExecuteResponse };
}

function isEmptyValue(value: string | number | boolean | null | undefined): boolean {
  return value === null || value === undefined || value === "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Normalize a registry item that may be in flat format (schema V5.3.1)
 * to the array-based format expected by the runtime.
 *
 * Flat format:   { "Pa": { factor: 1 }, "kPa": { factor: 1000 } }
 * Array format:  { base_unit: "Pa", units: [{ unit: "Pa", factor: 1 }, ...] }
 */
function normalizeRegistryItem(
  item: Record<string, unknown>,
): { baseUnit: string; units: Array<{ unit: string; factor: number; offset?: number }> } {
  if (Array.isArray(item.units)) {
    return {
      baseUnit: typeof item.base_unit === "string" ? item.base_unit : "",
      units: item.units as Array<{ unit: string; factor: number; offset?: number }>,
    };
  }

  // Flat format: materialise units array from object keys
  const units: Array<{ unit: string; factor: number; offset?: number }> = [];
  for (const [key, value] of Object.entries(item)) {
    if (key === "base_unit" || key === "unit_family") continue;
    if (value && typeof value === "object" && value !== null && typeof (value as Record<string, unknown>).factor === "number") {
      units.push({
        unit: key,
        factor: (value as { factor: number }).factor,
        offset: (value as { offset?: number }).offset,
      });
    }
  }

  return {
    baseUnit: typeof item.base_unit === "string" ? item.base_unit : "",
    units,
  };
}

function convertDisplayToBase(
  value: number,
  displayUnit: string,
  baseUnit: string,
  quantityKind: string,
  registry: SuperV4Schema["unit_conversion_contract"]["conversion_registry"],
): { ok: true; value: number } | { ok: false; reason: string } {
  const item = registry[quantityKind];
  if (!item) return { ok: false, reason: `Missing conversion registry for ${quantityKind}.` };
  const { baseUnit: regBaseUnit, units } = normalizeRegistryItem(item as unknown as Record<string, unknown>);
  const display = units.find((entry) => entry.unit === displayUnit);
  const base = units.find((entry) => entry.unit === baseUnit) ?? { unit: regBaseUnit || item.base_unit || "", factor: 1, offset: 0 };
  if (!display) return { ok: false, reason: `Unsupported display unit ${displayUnit}.` };
  if (!base) return { ok: false, reason: `Unsupported base unit ${baseUnit}.` };

  const registryBaseValue = (value + (display.offset ?? 0)) * display.factor;
  const targetValue = registryBaseValue / base.factor - (base.offset ?? 0);
  if (!Number.isFinite(targetValue)) return { ok: false, reason: "Non-finite conversion result." };
  return { ok: true, value: targetValue };
}

function preserveDisplayQuantity(
  value: number,
  oldUnit: string,
  newUnit: string,
  quantityKind: string,
  registry: SuperV4Schema["unit_conversion_contract"]["conversion_registry"],
): { ok: true; value: number } | { ok: false; reason: string } {
  const item = registry[quantityKind];
  if (!item) return { ok: false, reason: `Missing conversion registry for ${quantityKind}.` };
  const { units } = normalizeRegistryItem(item as unknown as Record<string, unknown>);
  const oldEntry = units.find((entry) => entry.unit === oldUnit);
  const newEntry = units.find((entry) => entry.unit === newUnit);
  if (!oldEntry || !newEntry) return { ok: false, reason: "Unsupported unit change." };

  const registryBaseValue = (value + (oldEntry.offset ?? 0)) * oldEntry.factor;
  const nextValue = registryBaseValue / newEntry.factor - (newEntry.offset ?? 0);
  if (!Number.isFinite(nextValue)) return { ok: false, reason: "Non-finite unit preservation result." };
  return { ok: true, value: nextValue };
}

declare module "./contract-types" {
  interface SuperV4Schema {
    schemaContainsPublicFormulaLeak?: boolean;
  }
}
