// SectorCalc SuperV4 Universal Industrial Decision Form — State Machine V5.3.1
// The machine owns all form execution flow. The public client never executes formulas.

import type {
  AuditSeal,
  ExecuteResponse,
  ExecutionState,
  NormalizedInputAudit,
  ProfileMode,
  ReferenceRangeAudit,
  ServerWarning,
  StateTransitionId,
  SuperV4Schema,
} from "./contract-types";
import { resolveIndustrialExampleValue } from "./example-value-resolver";

export interface ValidationIssue {
  id: string;
  severity: "INFO" | "REVIEW" | "WARNING" | "CRITICAL" | "BLOCKER";
  message: string;
  input_id?: string;
  suggested_action?: string;
}

export interface NormalizedPreviewItem {
  input_id: string;
  normalized_id: string;
  display_value: number | string | boolean | null;
  display_unit: string | null;
  base_value: number | string | boolean | null;
  base_unit: string | null;
}

export interface EvidenceFieldState {
  enabled: boolean;
  source_verified: boolean;
  user_verified: boolean;
  uploaded_references: string[];
}

export interface PremiumHookState {
  hook: import("@/sectorcalc/monetization/monetization-types").PremiumHookPublic | null;
}

export interface UniversalFormMachineState {
  schemaState: {
    schema: SuperV4Schema | null;
    schema_hash: string | null;
    schema_version: string | null;
    validation_status: "idle" | "valid" | "invalid";
    validation_errors: string[];
  };
  profileModeState: {
    mode: ProfileMode;
  };
  rawInputState: Record<string, string | number | boolean | null>;
  selectedUnitState: Record<string, string>;
  normalizedPreviewState: {
    items: NormalizedPreviewItem[];
    errors: ValidationIssue[];
  };
  evidenceState: Record<string, EvidenceFieldState>;
  touchedState: {
    touched_fields: Record<string, boolean>;
    dirty_fields: Record<string, boolean>;
  };
  validationState: {
    client_precheck_errors: ValidationIssue[];
    server_blockers: ServerWarning[];
    semantic_warnings: ValidationIssue[];
  };
  referenceRangeState: {
    markers: ReferenceRangeAudit[];
  };
  blockerState: {
    blockers: ValidationIssue[];
    can_execute: boolean;
  };
  advancedDisclosureState: {
    expanded_groups: Record<string, boolean>;
    advanced_visible: boolean;
  };
  scenarioState: {
    request: unknown | null;
    result: unknown | null;
  };
  executionState: ExecutionState;
  serverResponseState: {
    response: ExecuteResponse | null;
  };
  auditSealState: {
    seal: AuditSeal | null;
  };
  exportState: {
    pdf_available: boolean;
    json_audit_available: boolean;
    copy_summary_available: boolean;
  };
  premiumHookState: PremiumHookState;
}

export type UniversalFormMachineEvent =
  | { type: "INIT_SCHEMA"; schema: SuperV4Schema; schema_hash?: string | null }
  | { type: "VALIDATE_SCHEMA_CONTRACT"; errors: string[] }
  | { type: "SET_PROFILE_MODE"; mode: ProfileMode }
  | { type: "SET_INPUT_VALUE"; input_id: string; value: string | number | boolean | null }
  | { type: "SET_SELECTED_UNIT"; input_id: string; unit: string }
  | { type: "PRESERVE_PHYSICAL_QUANTITY_ON_UNIT_CHANGE"; input_id: string; value: string | number | boolean | null; unit: string }
  | { type: "UPDATE_NORMALIZED_PREVIEW"; items: NormalizedPreviewItem[]; errors: ValidationIssue[] }
  | { type: "UPDATE_EVIDENCE_STATUS"; input_id: string; evidence: EvidenceFieldState }
  | { type: "RUN_CLIENT_PRECHECK"; issues: ValidationIssue[] }
  | { type: "BLOCK_CLIENT_EXECUTION"; blockers: ValidationIssue[] }
  | { type: "SUBMIT_SERVER_EXECUTION" }
  | { type: "RECEIVE_SERVER_RESPONSE"; response: ExecuteResponse }
  | { type: "RECEIVE_SERVER_BLOCKERS"; blockers: ServerWarning[] }
  | { type: "RECEIVE_SERVER_ERROR"; message: string }
  | { type: "RESET_INPUTS" }
  | { type: "RESET_RESULT_ONLY" }
  | { type: "TOGGLE_GROUP"; group_id: string }
  | { type: "SET_ADVANCED_VISIBLE"; visible: boolean }
  | { type: "SET_SCENARIO_REQUEST"; request: unknown | null };

export const REQUIRED_TRANSITIONS: StateTransitionId[] = [
  "INIT_SCHEMA",
  "VALIDATE_SCHEMA_CONTRACT",
  "SET_PROFILE_MODE",
  "SET_INPUT_VALUE",
  "SET_SELECTED_UNIT",
  "PRESERVE_PHYSICAL_QUANTITY_ON_UNIT_CHANGE",
  "UPDATE_NORMALIZED_PREVIEW",
  "UPDATE_EVIDENCE_STATUS",
  "RUN_CLIENT_PRECHECK",
  "BLOCK_CLIENT_EXECUTION",
  "SUBMIT_SERVER_EXECUTION",
  "RECEIVE_SERVER_RESPONSE",
  "RECEIVE_SERVER_BLOCKERS",
  "RECEIVE_SERVER_ERROR",
  "RESET_INPUTS",
  "RESET_RESULT_ONLY",
];

export function createInitialUniversalFormState(profileMode: ProfileMode = "engineering"): UniversalFormMachineState {
  return {
    schemaState: {
      schema: null,
      schema_hash: null,
      schema_version: null,
      validation_status: "idle",
      validation_errors: [],
    },
    profileModeState: { mode: profileMode },
    rawInputState: {},
    selectedUnitState: {},
    normalizedPreviewState: { items: [], errors: [] },
    evidenceState: {},
    touchedState: { touched_fields: {}, dirty_fields: {} },
    validationState: { client_precheck_errors: [], server_blockers: [], semantic_warnings: [] },
    referenceRangeState: { markers: [] },
    blockerState: { blockers: [], can_execute: false },
    advancedDisclosureState: { expanded_groups: {}, advanced_visible: false },
    scenarioState: { request: null, result: null },
    executionState: "idle",
    serverResponseState: { response: null },
    auditSealState: { seal: null },
    exportState: { pdf_available: false, json_audit_available: false, copy_summary_available: false },
    premiumHookState: { hook: null },
  };
}

export function universalFormMachineReducer(
  state: UniversalFormMachineState,
  event: UniversalFormMachineEvent,
): UniversalFormMachineState {
  switch (event.type) {
    case "INIT_SCHEMA": {
      const rawInputState: Record<string, string | number | boolean | null> = {};
      const selectedUnitState: Record<string, string> = {};
      const evidenceState: Record<string, EvidenceFieldState> = {};
      const expandedGroups: Record<string, boolean> = {};
      const initToolSlug = event.schema.tool_key;

      for (const input of event.schema.inputs) {
        // Resolve via tool-specific example map first, fall back to schema default
        const exampleVal = resolveIndustrialExampleValue({
          toolSlug: initToolSlug,
          toolKey: initToolSlug,
          inputId: input.id,
          inputName: input.name,
          unit: input.base_unit,
          rangeMin: input.physical_hard_bounds?.min ?? null,
          rangeMax: input.physical_hard_bounds?.max ?? null,
          schemaExampleValue: null,
          schemaDefaultValue: input.default_value ?? null,
        });
        rawInputState[input.id] = exampleVal !== "" ? exampleVal : (input.default_value ?? null);
        // Always populate selected_units with the first allowed display unit.
        // The normalizer needs this to correctly convert display values to base units,
        // even for fields where the user cannot change the unit.
        if (input.allowed_display_units.length > 0) {
          selectedUnitState[input.id] = input.allowed_display_units[0];
        }
        const requiredEvidence = typeof input.evidence_requirement === "string"
          ? input.evidence_requirement.toLowerCase().includes("required")
          : input.evidence_requirement.required;
        const hasVal = rawInputState[input.id] !== null && rawInputState[input.id] !== undefined;
        evidenceState[input.id] = {
          enabled: requiredEvidence,
          source_verified: false,
          user_verified: hasVal,
          uploaded_references: [],
        };
      }

      for (const group of event.schema.ui_contract.input_groups) {
        expandedGroups[group.id] = !group.advanced;
      }

      // V5.3.1: Full state reset on schema change — no stale data from previous tool
      return {
        schemaState: {
          schema: event.schema,
          schema_hash: event.schema_hash ?? null,
          schema_version: event.schema.metadata.schema_version,
          validation_status: "idle",
          validation_errors: [],
        },
        profileModeState: state.profileModeState,
        rawInputState,
        selectedUnitState,
        normalizedPreviewState: { items: [], errors: [] },
        evidenceState,
        touchedState: { touched_fields: {}, dirty_fields: {} },
        validationState: { client_precheck_errors: [], server_blockers: [], semantic_warnings: [] },
        referenceRangeState: { markers: [] },
        blockerState: { blockers: [], can_execute: false },
        advancedDisclosureState: {
          expanded_groups: expandedGroups,
          advanced_visible: false,
        },
        scenarioState: { request: null, result: null },
        executionState: "schema_loading",
        serverResponseState: { response: null },
        auditSealState: { seal: null },
        exportState: { pdf_available: false, json_audit_available: false, copy_summary_available: false },
        premiumHookState: resetPremiumHook(),
      };
    }

    case "VALIDATE_SCHEMA_CONTRACT":
      return {
        ...state,
        schemaState: {
          ...state.schemaState,
          validation_status: event.errors.length === 0 ? "valid" : "invalid",
          validation_errors: event.errors,
        },
        executionState: event.errors.length === 0 ? "schema_ready" : "schema_rejected",
        premiumHookState: resetPremiumHook(),
      };

    case "SET_PROFILE_MODE":
      return {
        ...state,
        profileModeState: { mode: event.mode },
        executionState: state.executionState === "idle" ? "input_draft" : state.executionState,
        premiumHookState: resetPremiumHook(),
      };

    case "SET_INPUT_VALUE":
      return {
        ...state,
        rawInputState: { ...state.rawInputState, [event.input_id]: event.value },
        touchedState: {
          touched_fields: { ...state.touchedState.touched_fields, [event.input_id]: true },
          dirty_fields: { ...state.touchedState.dirty_fields, [event.input_id]: true },
        },
        executionState: "input_draft",
        serverResponseState: { response: null },
        auditSealState: { seal: null },
        exportState: { pdf_available: false, json_audit_available: false, copy_summary_available: false },
        premiumHookState: resetPremiumHook(),
      };

    case "SET_SELECTED_UNIT":
      return {
        ...state,
        selectedUnitState: { ...state.selectedUnitState, [event.input_id]: event.unit },
        touchedState: {
          touched_fields: { ...state.touchedState.touched_fields, [event.input_id]: true },
          dirty_fields: { ...state.touchedState.dirty_fields, [event.input_id]: true },
        },
        executionState: "unit_dirty",
        serverResponseState: { response: null },
        auditSealState: { seal: null },
        exportState: { pdf_available: false, json_audit_available: false, copy_summary_available: false },
        premiumHookState: resetPremiumHook(),
      };

    case "PRESERVE_PHYSICAL_QUANTITY_ON_UNIT_CHANGE":
      return {
        ...state,
        rawInputState: { ...state.rawInputState, [event.input_id]: event.value },
        selectedUnitState: { ...state.selectedUnitState, [event.input_id]: event.unit },
        executionState: "unit_dirty",
        premiumHookState: resetPremiumHook(),
      };

    case "UPDATE_NORMALIZED_PREVIEW":
      return {
        ...state,
        normalizedPreviewState: { items: event.items, errors: event.errors },
        executionState: event.errors.length > 0 ? "client_precheck_blocked" : "normalized_preview_ready",
        premiumHookState: resetPremiumHook(),
      };

    case "UPDATE_EVIDENCE_STATUS":
      return {
        ...state,
        evidenceState: { ...state.evidenceState, [event.input_id]: event.evidence },
        executionState: "input_draft",
        premiumHookState: resetPremiumHook(),
      };

    case "RUN_CLIENT_PRECHECK": {
      const blockers = event.issues.filter((issue) => issue.severity === "BLOCKER" || issue.severity === "CRITICAL");
      const warnings = event.issues.filter((issue) => issue.severity !== "BLOCKER" && issue.severity !== "CRITICAL");
      return {
        ...state,
        validationState: {
          ...state.validationState,
          client_precheck_errors: event.issues,
          semantic_warnings: warnings,
        },
        blockerState: {
          blockers,
          can_execute: blockers.length === 0,
        },
        executionState: blockers.length === 0 ? "ready_to_execute" : "client_precheck_blocked",
        premiumHookState: resetPremiumHook(),
      };
    }

    case "BLOCK_CLIENT_EXECUTION":
      return {
        ...state,
        blockerState: { blockers: event.blockers, can_execute: false },
        validationState: { ...state.validationState, client_precheck_errors: event.blockers },
        executionState: "client_precheck_blocked",
        premiumHookState: resetPremiumHook(),
      };

    case "SUBMIT_SERVER_EXECUTION":
      return {
        ...state,
        executionState: "executing",
        validationState: { ...state.validationState, server_blockers: [] },
        premiumHookState: resetPremiumHook(),
      };

    case "RECEIVE_SERVER_RESPONSE": {
      const executionState = mapStatusToExecutionState(event.response.status);
      return {
        ...state,
        executionState,
        serverResponseState: { response: event.response },
        referenceRangeState: {
          markers: event.response.reference_range_warnings ?? event.response.reference_range_audit ?? [],
        },
        auditSealState: { seal: event.response.audit_seal },
        exportState: {
          pdf_available: event.response.redaction_status === "PUBLIC_SAFE_REDACTED",
          json_audit_available: event.response.redaction_status === "PUBLIC_SAFE_REDACTED",
          copy_summary_available: event.response.redaction_status === "PUBLIC_SAFE_REDACTED",
        },
        premiumHookState: { hook: event.response.premium_hook ?? null },
      };
    }

    case "RECEIVE_SERVER_BLOCKERS":
      return {
        ...state,
        validationState: { ...state.validationState, server_blockers: event.blockers },
        executionState: "server_blocked",
        premiumHookState: resetPremiumHook(),
      };

    case "RECEIVE_SERVER_ERROR":
      return {
        ...state,
        validationState: {
          ...state.validationState,
          client_precheck_errors: [
            ...state.validationState.client_precheck_errors,
            {
              id: "SERVER_ERROR",
              severity: "BLOCKER",
              message: event.message,
              suggested_action: "Review server execution logs and retry after the runtime issue is corrected.",
            },
          ],
        },
        executionState: "error",
        premiumHookState: resetPremiumHook(),
      };

    case "RESET_INPUTS": {
      const resetBase = createInitialUniversalFormState(state.profileModeState.mode);
      const resetSchema = state.schemaState.schema;
      if (resetSchema) {
        const resetSlug = resetSchema.tool_key;
        for (const input of resetSchema.inputs) {
          const exVal = resolveIndustrialExampleValue({
            toolSlug: resetSlug,
            toolKey: resetSlug,
            inputId: input.id,
            inputName: input.name,
            unit: input.base_unit,
            rangeMin: input.physical_hard_bounds?.min ?? null,
            rangeMax: input.physical_hard_bounds?.max ?? null,
            schemaExampleValue: null,
            schemaDefaultValue: input.default_value ?? null,
          });
          const hasVal = exVal !== "" && exVal !== null && exVal !== undefined;
          resetBase.rawInputState[input.id] = exVal !== "" ? exVal : null;
          // Always restore selected_units from schema defaults on reset
          if (input.allowed_display_units.length > 0) {
            resetBase.selectedUnitState[input.id] = input.allowed_display_units[0];
          }
          // Restore evidence state — auto-verify when example value is present
          const resetEvidenceRequired = typeof input.evidence_requirement === "string"
            ? input.evidence_requirement.toLowerCase().includes("required")
            : input.evidence_requirement.required;
          resetBase.evidenceState[input.id] = {
            enabled: resetEvidenceRequired,
            source_verified: false,
            user_verified: hasVal,
            uploaded_references: [],
          };
        }
      }
      return {
        ...resetBase,
        schemaState: state.schemaState,
        executionState: state.schemaState.validation_status === "valid" ? "schema_ready" : "idle",
      };
    }

    case "RESET_RESULT_ONLY":
      return {
        ...state,
        serverResponseState: { response: null },
        auditSealState: { seal: null },
        exportState: { pdf_available: false, json_audit_available: false, copy_summary_available: false },
        executionState: "input_draft",
        premiumHookState: resetPremiumHook(),
      };

    case "TOGGLE_GROUP":
      return {
        ...state,
        advancedDisclosureState: {
          ...state.advancedDisclosureState,
          expanded_groups: {
            ...state.advancedDisclosureState.expanded_groups,
            [event.group_id]: !state.advancedDisclosureState.expanded_groups[event.group_id],
          },
        },
      };

    case "SET_ADVANCED_VISIBLE":
      return {
        ...state,
        advancedDisclosureState: {
          ...state.advancedDisclosureState,
          advanced_visible: event.visible,
        },
      };

    case "SET_SCENARIO_REQUEST":
      return {
        ...state,
        scenarioState: { ...state.scenarioState, request: event.request },
      };

    default:
      return state;
  }
}

function resetPremiumHook(): PremiumHookState {
  return { hook: null };
}

export function mapStatusToExecutionState(status: string): ExecutionState {
  switch (status) {
    case "OK":
      return "server_ok";
    case "REVIEW":
      return "server_review";
    case "BLOCKED":
      return "server_blocked";
    case "REPRICE":
      return "server_reprice";
    case "REJECT":
      return "server_reject";
    case "HOLD":
      return "server_hold";
    default:
      return "error";
  }
}

export function getExecutionStateLabel(state: ExecutionState): string {
  const labels: Record<ExecutionState, string> = {
    idle: "Idle",
    schema_loading: "Schema loading",
    schema_ready: "Schema ready",
    schema_rejected: "Schema rejected",
    input_draft: "Input draft",
    unit_dirty: "Unit changed",
    normalized_preview_ready: "Normalized preview ready",
    reference_range_warning: "Reference range warning",
    evidence_gap: "Evidence gap",
    client_precheck_blocked: "Client precheck blocked",
    ready_to_execute: "Ready to execute",
    executing: "Executing server calculation",
    server_ok: "Server result OK",
    server_review: "Server review required",
    server_blocked: "Server blocked",
    server_reprice: "Server reprice",
    server_reject: "Server reject",
    server_hold: "Server hold",
    public_response_redacted: "Public response redacted",
    export_ready: "Export ready",
    audit_sealed: "Audit sealed",
    error: "Error",
  };
  return labels[state];
}

export function createNormalizedAuditFromPreview(items: NormalizedPreviewItem[]): NormalizedInputAudit[] {
  return items.map((item) => ({
    input_id: item.input_id,
    normalized_id: item.normalized_id,
    display_value: item.display_value,
    display_unit: item.display_unit,
    base_value: item.base_value,
    base_unit: item.base_unit,
    source_status: "CONTEXT_ONLY",
  }));
}
