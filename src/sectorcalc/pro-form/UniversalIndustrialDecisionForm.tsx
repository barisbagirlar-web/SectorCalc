// SectorCalc SuperV4 Universal Industrial Decision Form — V5.3.1
// Calculator-first renderer (V2). Temporary build-and-verify file.
// The public client never executes formulas.

"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import type {
  CalcStatus,
  ExecuteResponse,
  ProfileMode,
  ServerOutput,
  ServerWarning,
  SuperV4Input,
  SuperV4Schema,
} from "./contract-types";
import type { ToolRenderContract } from "@/sectorcalc/runtime/build-tool-render-contract";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { getExecutionStateLabel } from "./form-state-machine";
import { useUniversalIndustrialDecisionFormMachine } from "./useUniversalIndustrialDecisionFormMachine";
import {
  getDisplayToolName,
  getDisplayCategoryLabel,
  getDisplayOperationLabel,
  humanizeEnum,
} from "./display-labels";
import {
  hasServerResponse,
  safeBasePreview,
  safeDisplayCategory,
  getPrimaryCtaLabel,
  formatSafeValue,
  formatDisplayNumber,
  formatBusinessResult,
  safeDisplayScope,
  formatCleanUnitLabel,
  buildSafeDisplayUnitOptions,
  getProOutputSymbol,
  getProOutputDisplayUnit,
} from "./form-render-helpers";
import { normalizeV531FieldMetadata } from "./normalize-v531-field-metadata";
import "./universal-industrial-decision-form.css";

// ── ViewModel types ────────────────────────────────────────────────────────────

/** True only for non-empty strings after trim. */
function hasMessage(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

interface EvidenceRow {
  valueVerified: boolean;
  sourceVerified: boolean;
  evidenceRequired: boolean;
  evidenceLabel: string;
}

interface FieldViewModel {
  id: string;
  label: string;
  symbol: string | null;
  type: "number" | "integer" | "boolean" | "select" | "string";
  value: string | number | boolean | null;
  selectedUnit: string;
  allowedUnits: string[];
  unitSelectable: boolean;
  allowedValues: string[];
  helpText: string;
  criticality: string;
  blockers: Array<{ id: string; message: string; severity: string; suggested_action?: string }>;
  basePreview: string | null;
  /** Public-safe reference source label, tool-characteristic. Never generic placeholder. */
  referenceSource: string | null;
  tolerancePct: string | null;
  evidence: EvidenceRow;
  /** Compact reference metadata lines rendered under the input row. */
  referenceStrip: string[];
  /** V5.3.1: Always-present metadata block values or neutral "No declared..." messages. */
  declaredRange: string;
  declaredDefaultReference: string;
  declaredAcceptedValues: string;
  declaredTolerance: string;
  /** Single clean user-facing reference helper line. Shown in both FREE and PRO. */
  cleanReferenceHelper: string;
}

interface ActionViewModel {
  label: string;
  disabled: boolean;
  disabledReason: string | null;
  onAction: () => void;
}

interface ResultViewModel {
  hasResult: boolean;
  status: string;
  executionLabel: string;
  primaryOutput: { name: string; value: string; unit: string; explanation: string } | null;
  decision: string | null;
  reason: string | null;
  nextAction: string | null;
}

interface CalculatorViewModel {
  title: string;
  purpose: string;
  badges: Array<{ label: string; type: "category" | "tier" | "risk" | "version" | "runs" }>;
  fields: FieldViewModel[];
  action: ActionViewModel;
  secondaryActions: Array<{ label: string; onAction: () => void; variant: "secondary" | "ghost" }>;
  resultState: ResultViewModel;
  warnings: Array<{ severity: string; title: string; detail: string }>;
}

// ── Props ──────────────────────────────────────────────────────────────────────

export interface UniversalIndustrialDecisionFormProps {
  schema: SuperV4Schema;
  schemaHash?: string | null;
  executeEndpoint?: string;
  initialProfileMode?: ProfileMode;
  className?: string;
  /** Route slug for identity assertion. Must match schema.tool_key. */
  toolKey?: string;
  /** Access tier: FREE tools require no payment, PRO tools are credit-gated. */
  accessTier?: "FREE" | "PRO";
  /** Usage session ID for Pro tool execution tracking. */
  usageSessionId?: string | null;
  /** Remaining runs for the active Pro usage session. */
  remainingRuns?: number | null;
  /** Called when user requests to use a credit for a Pro tool. */
  onRequestCreditSession?: (toolKey: string) => void;
  /** Whether a credit session is being created. */
  creditSessionLoading?: boolean;
  /** Pre-validated render contract from buildToolRenderContract. */
  renderContract?: ToolRenderContract;
}

// ── ViewModel builder ──────────────────────────────────────────────────────────

function buildCalculatorViewModel(
  schema: SuperV4Schema,
  state: ReturnType<typeof useUniversalIndustrialDecisionFormMachine>["state"],
  machine: ReturnType<typeof useUniversalIndustrialDecisionFormMachine>,
  props: UniversalIndustrialDecisionFormProps,
  activeMode: ProfileMode,
  response: ExecuteResponse | null,
  accessTier: "FREE" | "PRO",
  hasSession: boolean,
  runsRemaining: number,
  isExecuting: boolean,
  hasResult: boolean,
  primaryButtonDisabled: boolean,
  primaryButtonLabel: string,
  primaryButtonAction: () => void,
  clientBlockerCount: number,
  toolName: string,
  displayScope: string,
  displayCategory: string,
  displayOperation: string,
  identityCheck: { ok: boolean; reason?: string } | null,
): CalculatorViewModel {
  const decision = response?.decision_interpretation;
  const isFree = accessTier === "FREE";

  // Badges — only category + tier in primary UI
  const badges: CalculatorViewModel["badges"] = [];
  const cleanBadgeLabel = (label: string) =>
    label.replace(/[·\s]*SuperV4[^·]*/gi, "").replace(/[·\s]*V5[.\d]*/gi, "").replace(/\s{2,}/g, " ").replace(/[·\s]*$/g, "").trim() || label;
  if (isFree) {
    // FREE mode: only category + tier, no version/risk/runs badges
    badges.push({ label: cleanBadgeLabel(displayCategory) || "Calculator", type: "category" });
    badges.push({ label: "Free", type: "tier" });
  } else {
    badges.push({ label: cleanBadgeLabel(displayCategory) || "Calculator", type: "category" });
    badges.push({ label: accessTier === "PRO" ? "Pro" : "Free", type: "tier" });
  }

  // Compute tool-characteristic reference source label based on category
  const referenceSourceLabel = getReferenceSourceLabel(
    schema.category,
    schema.reference_status,
  );

  const fields: FieldViewModel[] = schema.inputs
    .filter((input) => {
      const binding = input.ui_binding;
      const modes = binding?.visible_in_modes ?? ["quick", "engineering", "cost", "audit"];
      return modes.includes(activeMode);
    })
    .map((input) => {
      const basePreviewVal = (() => {
        const preview = (machine.normalizedPreview ?? []).find((item) => item.input_id === input.id);
        if (!preview || preview.base_value === null || preview.base_value === undefined) return null;
        return safeBasePreview(preview.base_value, preview.base_unit ?? input.base_unit ?? null);
      })();

      // Compute evidence row state
      const evState = state.evidenceState[input.id];
      const evReq = input.evidence_requirement;
      const evidenceRequired = typeof evReq === "string"
        ? evReq.toLowerCase().includes("required")
        : evReq?.required === true;
      const evidenceLabel = evidenceRequired ? "Source verification required" : "Source verification (optional)";

      // Tolerance
      const tolPct = computeTolerancePct(input);

      // Reference source: per-input if available, else tool-characteristic default
      const inputRefSource = computeInputReferenceSource(input, referenceSourceLabel);

      // ── V5.3.1: Normalize field metadata from schema ──
      const meta = normalizeV531FieldMetadata(input, props.schema);

      // Clean reference helper — one user-facing line per input, en-US format
      // Priority: 1. engineering_range / engineering_reference_range, 2. meta.allowedRange, 3. physical_hard_bounds as "Input limit"
      const cleanReferenceHelper = (() => {
        // Priority 1: engineering_reference_range or engineering_range
        const er = input.engineering_reference_range ?? input.engineering_range;
        if (er && er.min !== null && er.max !== null) {
          const uLabel = er.unit ? formatCleanUnitLabel(er.unit) : "";
          const minF = formatDisplayNumber(er.min, { decimals: 6, stripTrailingZeros: true });
          const maxF = formatDisplayNumber(er.max, { decimals: 6, stripTrailingZeros: true });
          const uStr = uLabel ? ` ${uLabel}` : "";
          return `Reference: ${minF}–${maxF}${uStr}`;
        }
        // Priority 2: normalized allowedRange (from physical_hard_bounds or other)
        if (meta.allowedRange) {
          return `Reference: ${meta.allowedRange}`;
        }
        // Priority 3: physical_hard_bounds as "Input limit"
        const hb = input.physical_hard_bounds;
        if (hb && hb.min !== null && hb.max !== null) {
          const unitLabel = hb.unit ? formatCleanUnitLabel(hb.unit) : "";
          const minFormatted = formatDisplayNumber(hb.min, { decimals: 0, stripTrailingZeros: true });
          const maxFormatted = formatDisplayNumber(hb.max, { decimals: 0, stripTrailingZeros: true });
          const unitStr = unitLabel ? ` ${unitLabel}` : "";
          return `Input limit: ${minFormatted}–${maxFormatted}${unitStr}`;
        }
        if (meta.defaultReference) {
          return `Reference: ${meta.defaultReference}`;
        }
        return "";
      })();

      // ── Reference strip: compact metadata lines under each input ──
      const refStrip: string[] = [];

      // Priority 1: physical hard bounds (min/max)
      const hb = input.physical_hard_bounds;
      if (hb && hb.min !== null && hb.max !== null) {
        const hbUnit = hb.unit ? ` ${hb.unit}` : "";
        refStrip.push(`Allowed range: ${hb.min}–${hb.max}${hbUnit}`);
      }

      // Priority 2: resolution / precision
      if (input.resolution != null) {
        refStrip.push(`Resolution: ${input.resolution}`);
      } else if (input.precision_policy?.input_decimals != null) {
        refStrip.push(`Precision: ${input.precision_policy.input_decimals} decimal places`);
      }

      // Priority 3: default value (from schema default or enriched _reference_default_text)
      const defVal = input.default_value ?? input.default;
      if (defVal != null && defVal !== "") {
        refStrip.push(`Default reference: ${String(defVal)}`);
      } else if (meta.defaultReference) {
        refStrip.push(`Reference: ${meta.defaultReference}`);
      }

      // Priority 4: enum / allowed values
      if (Array.isArray(input.allowed_values) && input.allowed_values.length > 0) {
        refStrip.push(`Accepted values: ${input.allowed_values.map(humanizeEnum).join(", ")}`);
      }

      // Priority 5: evidence text (only if no richer metadata exists)
      const hasNumericRef = refStrip.length > 0;
      if (!hasNumericRef && input.required) {
        refStrip.push(
          "Evidence required: user-verified source, calibrated measurement, ERP/job record, or approved engineering note.",
        );
      }

      // Fallback if truly no metadata
      if (refStrip.length === 0) {
        refStrip.push("Reference data: not specified in this tool schema.");
      }

      const declaredRange = meta.allowedRange
        ? `Allowed range: ${meta.allowedRange}`
        : "No declared range in schema";

      const declaredDefaultReference = meta.defaultReference
        ? `Default reference: ${meta.defaultReference}`
        : "No declared reference value in schema";

      const declaredAcceptedValues = Array.isArray(meta.acceptedValues) && meta.acceptedValues.length > 0
        ? `Accepted values: ${meta.acceptedValues.join(", ")}`
        : "No declared accepted values in schema";

      const declaredTolerance = meta.toleranceText
        ? `Tolerance: ${meta.toleranceText}`
        : "No declared tolerance in schema";

      return {
        id: input.id,
        label: input.name,
        symbol: input.symbol ?? null,
        type: input.type === "integer" ? "integer" : (input.type as FieldViewModel["type"]),
        value: state.rawInputState[input.id] ?? null,
        selectedUnit: state.selectedUnitState[input.id]
          ?? (input.allowed_display_units?.length
            ? input.allowed_display_units[0]
            : (input.base_unit ? buildSafeDisplayUnitOptions(input.base_unit)[0] : "")),
        allowedUnits: input.allowed_display_units?.length
          ? input.allowed_display_units
          : (input.base_unit ? buildSafeDisplayUnitOptions(input.base_unit) : []),
        unitSelectable: !!input.unit_selectable,
        allowedValues: input.allowed_values ?? [],
        helpText: input.user_help_text ?? input.help_text ?? "",
        criticality: input.criticality,
        blockers: state.validationState.client_precheck_errors.filter((issue) => issue.input_id === input.id),
        basePreview: isFree ? null : basePreviewVal,
        referenceSource: isFree ? null : inputRefSource,
        tolerancePct: isFree ? null : tolPct,
        evidence: isFree
          ? { valueVerified: false, sourceVerified: false, evidenceRequired: false, evidenceLabel: "" }
          : {
              valueVerified: evState?.user_verified === true || evState?.enabled === true,
              sourceVerified: evState?.source_verified === true,
              evidenceRequired,
              evidenceLabel,
            },
        referenceStrip: isFree ? [] : refStrip,
        declaredRange: isFree ? "" : declaredRange,
        declaredDefaultReference: isFree ? "" : declaredDefaultReference,
        declaredAcceptedValues: isFree ? "" : declaredAcceptedValues,
        declaredTolerance: isFree ? "" : declaredTolerance,
        cleanReferenceHelper,
      };
    });

  // Action
  const action: ActionViewModel = {
    label: primaryButtonLabel,
    disabled: primaryButtonDisabled,
    disabledReason: primaryButtonDisabled
      ? (isExecuting
          ? (isFree ? "Processing..." : "Server execution in progress.")
          : (accessTier === "PRO" && !hasSession)
            ? "Use 1 credit to start."
            : (accessTier === "PRO" && runsRemaining <= 0)
              ? "Session exhausted."
              : null)
      : null,
    onAction: primaryButtonAction,
  };

  // Secondary actions
  const secondaryActions: CalculatorViewModel["secondaryActions"] = [
    { label: "Check inputs", onAction: machine.runClientPrecheck, variant: "secondary" },
    { label: "Reset", onAction: machine.resetInputs, variant: "ghost" },
  ];

  // Result state
  const primaryOutput = hasResult && response?.outputs?.length
    ? {
        name: response.outputs[0].name,
        value: formatSafeValue(response.outputs[0].value),
        unit: response.outputs[0].unit ?? "",
        explanation: response.outputs[0].public_explanation ?? "",
      }
    : null;

  const resultState: ResultViewModel = {
    hasResult,
    status: response?.status ?? executionStateToStatus(state.executionState),
    executionLabel: getExecutionStateLabel(state.executionState),
    primaryOutput,
    decision: decision?.primary_decision ?? null,
    reason: decision?.primary_reason ?? null,
    nextAction: decision?.next_best_actions?.[0] ?? null,
  };

  // Warnings (filtered — hide internal/system warnings for both FREE and PRO)
  const warnings: CalculatorViewModel["warnings"] = [];
  for (const issue of state.validationState.client_precheck_errors) {
    if (isInternalWarning(issue.message)) continue;
    warnings.push({
      severity: issue.severity,
      title: issue.message,
      detail: issue.suggested_action ?? "Resolve before execution.",
    });
  }
  if (response?.warnings) {
    for (const w of response.warnings) {
      if (isInternalWarning(w.message)) continue;
      warnings.push({ severity: w.severity, title: w.message, detail: w.suggested_action ?? "" });
    }
  }

  return { title: toolName, purpose: displayScope, badges, fields, action, secondaryActions, resultState, warnings };
}

/** True if an output is a status/decision output and should not appear in primary result grid. */
function isStatusOutput(out: { name?: string; decision_use?: string | null }): boolean {
  const key = (out.name ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  return (
    key.includes("decision_status") ||
    key.includes("governing_driver") ||
    out.decision_use === "STATUS"
  );
}

/** Warnings to hide in primary UI — applied for both FREE and PRO. */
function isInternalWarning(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("derating") ||
    lower.includes("trigger_inputs") ||
    lower.includes("source evidence") ||
    lower.includes("source verified") ||
    lower.includes("evidence required") ||
    lower.includes("review derating contract") ||
    lower.includes("no declared accepted values") ||
    lower.includes("no declared range") ||
    lower.includes("no declared tolerance") ||
    lower.includes("no declared reference") ||
    lower.includes("superv4") ||
    lower.includes("single-operation")
  );
}

// ── FREE output unit suffix map (tool-specific) ────────────────────────────
// Maps output IDs to their proper customer-facing unit suffix in FREE result cards.
// This is needed because server output units may be raw/empty for FREE tools.
const FREE_OUTPUT_UNIT_SUFFIX: Record<string, string> = {
  "contribution_margin_per_unit": "Currency/unit",
  "break_even_units": "Units",
  "break_even_revenue": "Currency",
  "margin_of_safety_units": "Units",
  "margin_of_safety_percent": "%",
};

/**
 * Get the display-ready unit suffix for a FREE tool output.
 * Uses a safe map for known outputs, falls back to server unit formatting.
 */
function getFreeOutputUnitSuffix(
  out: { id?: string | null; name?: string; unit?: string | null },
): string {
  const outputKey = (out.id ?? out.name ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  const mapped = FREE_OUTPUT_UNIT_SUFFIX[outputKey];
  if (mapped) return mapped;
  // Fallback: use server unit if available
  if (out.unit) {
    if (out.unit === "display_currency") return "Currency";
    const label = formatCleanUnitLabel(out.unit);
    if (label) return label;
  }
  return "";
}

// ── Reference source helper ────────────────────────────────────────────────────

function getReferenceSourceLabel(
  category: string | null | undefined,
  referenceStatus: string | null | undefined,
): string {
  const cat = (category ?? "").toLowerCase();

  if (cat.includes("manufactur") || cat.includes("production") || cat.includes("shop")) {
    return "Datasheet, routing, standard, or measured baseline";
  }
  if (cat.includes("finance") || cat.includes("sales") || cat.includes("working") || cat.includes("business") || cat.includes("commercial")) {
    return "Quote, invoice, ERP, or user benchmark";
  }
  if (cat.includes("construction") || cat.includes("structural") || cat.includes("measurement")) {
    return "Project specification, standard, or measured baseline";
  }
  if (cat.includes("energy") || cat.includes("electrical") || cat.includes("power")) {
    return "Nameplate, datasheet, standard, or measured baseline";
  }
  if (cat.includes("logistics") || cat.includes("supply") || cat.includes("transport")) {
    return "ERP/WMS/TMS record or measured baseline";
  }
  if (cat.includes("automotive") || cat.includes("engine") || cat.includes("vehicle")) {
    return "Engine spec sheet, data plate, service manual, or dyno report";
  }
  if (cat.includes("hvac") || cat.includes("mechanical") || cat.includes("thermal")) {
    return "Nameplate, datasheet, standard, or measured baseline";
  }
  if (cat.includes("agriculture") || cat.includes("food")) {
    return "Equipment spec, standard, or measured baseline";
  }
  if (cat.includes("quality") || cat.includes("six") || cat.includes("sigma")) {
    return "Process record, standard, or measured baseline";
  }
  if (cat.includes("textile") || cat.includes("printing") || cat.includes("lab")) {
    return "Specification sheet, standard, or measured baseline";
  }
  if (cat.includes("hse") || cat.includes("ergonomics") || cat.includes("safety")) {
    return "Standard, assessment record, or measured baseline";
  }

  return "User benchmark / datasheet reference";
}

function computeInputReferenceSource(
  input: SuperV4Input,
  fallbackSource: string,
): string {
  const ref = input.reference_values;
  if (ref) {
    if (typeof ref === "object" && "source" in ref && typeof (ref as { source?: string }).source === "string") {
      const s = (ref as { source: string }).source.trim();
      if (s && s.length > 0) return s;
    }
  }
  return fallbackSource;
}

function computeTolerancePct(input: SuperV4Input): string | null {
  // If input has a tolerance defined via physical bounds or precision policy
  // This is a display helper; actual tolerance is server-side
  const bounds = input.physical_hard_bounds;
  if (bounds && bounds.min !== null && bounds.max !== null && bounds.min !== bounds.max) {
    return `±${((bounds.max - bounds.min) / (bounds.max + bounds.min) * 100).toFixed(1)}%`;
  }
  return null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function UniversalIndustrialDecisionForm(props: UniversalIndustrialDecisionFormProps) {
  // ── V5.3.1: Defensive contract invariants ──
  const contractErrors: string[] = [];
  if (!props.schema || typeof props.schema !== "object") {
    contractErrors.push("FORM_CONTRACT_SCHEMA_NULL");
  } else {
    if (!props.schema.tool_key || typeof props.schema.tool_key !== "string") {
      contractErrors.push("FORM_CONTRACT_TOOL_KEY_MISSING");
    }
    if (!props.schema.tool_name || typeof props.schema.tool_name !== "string") {
      contractErrors.push("FORM_CONTRACT_TOOL_NAME_MISSING");
    }
    if (!Array.isArray(props.schema.inputs)) {
      contractErrors.push("FORM_CONTRACT_INPUTS_INVALID");
    }
    if (!Array.isArray(props.schema.outputs)) {
      contractErrors.push("FORM_CONTRACT_OUTPUTS_INVALID");
    }
    if (!Array.isArray(props.schema.normalized_inputs)) {
      contractErrors.push("FORM_CONTRACT_NORMALIZED_INPUTS_INVALID");
    }
    if (!props.schema.metadata?.schema_version) {
      contractErrors.push("FORM_CONTRACT_SCHEMA_VERSION_MISSING");
    }
  }

  // V5.3.1: Schema identity check
  const identityCheck = !contractErrors.length && props.toolKey && props.schema
    ? assertToolSchemaIdentity({
        routeToolKey: props.toolKey,
        schemaToolKey: props.schema.tool_key,
        schemaToolId: props.schema.tool_id,
      })
    : null;

  // Minimal fallback schema for machine
  const machineSchema: SuperV4Schema = contractErrors.length
    ? ({
        tool_id: props.toolKey || "",
        tool_key: props.toolKey || "",
        tool_name: props.toolKey || "Tool",
        category: "General",
        scope: "",
        primary_operation: "calculate",
        inputs: [],
        normalized_inputs: [],
        outputs: [],
        formulas: [],
        metadata: { schema_version: "1.0.0", formula_version: "1.0.0" },
        ui_contract: {
          target_renderer: "UniversalIndustrialDecisionForm",
          profile_modes: [],
          input_groups: [],
          sticky_decision_cockpit: false,
          mobile_bottom_action_bar: false,
          normalized_preview_required: false,
          reference_values_visible: false,
          evidence_controls_required: false,
          semantic_error_summary_required: false,
          safety_factor_gauges_required: false,
          hidden_risk_panel_required: false,
          business_impact_panel_required: false,
          standards_clause_panel_required: false,
          protected_methodology_panel_required: false,
          audit_seal_panel_required: false,
          accessibility: {},
        },
        form_runtime_binding: {
          renderer: "UniversalIndustrialDecisionForm",
          schema_generation_runtime: "offline",
          llm_runtime_usage: "FORBIDDEN",
          client_formula_execution: "FORBIDDEN",
          server_execution_required: true,
          state_management_required: true,
          dynamic_ui_contract_required: true,
          json_schema_form_substrate_allowed: false,
          generic_json_schema_form_alone_sufficient: false,
          state_domains: [],
          state_transitions: [],
          execute_request_contract: {},
          execute_response_contract: {
            redaction_status: "REDACTION_NOT_REQUIRED",
            status: "OK",
            pipeline_state: "blocked",
          },
        },
        unit_conversion_contract: { conversion_registry: {} },
        reference_value_policy: {},
        physical_bounds_policy: {},
        validation_contract: {},
        derating_contract: {},
        precision_policy: {},
        output_formatting: {},
        decision_interpretation_contract: {},
        business_impact_contract: {},
        engine_rules: { client_formula_execution: false, llm_enabled: false, server_execution_required: true, fmea: null },
        uncertainty_model: { method: "NONE", confidence_level: null },
        safety_factor_gauges: [],
        proof_pack: { enabled: false, redaction_status: "PUBLIC_SAFE_REDACTED" as const, sections: [] },
        audit_trail_contract: {
          hash_algorithm: "SHA-256",
          seal_config: { enabled: false, include_input_hash: true, include_output_hash: true, include_schema_hash: true, include_formula_version: true },
          redaction_status: "PUBLIC_SAFE_REDACTED",
          seal_fields: [],
        },
        export_contract: { enabled: false, formats: [], redaction_required: true },
        reference_code: { code_language: null, code_block: null },
        test_plan: { test_cases: [], coverage_requirement: "NONE" },
        red_team_review: { review_status: "NOT_REVIEWED", issues: [] },
        risk_level: "MEDIUM",
        brand_safety_policy: { third_party_brand_references: [], legal_proof_claims: [], paid_standard_table_reproductions: [], policy_enforced: true, policy_version: "5.3.1" },
        calculation_basis: { method: "Fallback", assumptions: [], limitations: [] },
        unit_system: { preferred: "GLOBAL", strict: false },
        standards: [], standards_clause_map: [], reference_status: "UNVERIFIED",
        irreversible_commitment_metric: "result", decision_context: {},
      } as SuperV4Schema)
    : props.schema;

  // ── FREE-route detection ──
  // Synchronous check — no state needed. Safe because this is a client component.
  const isFreeRoute: boolean =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/tools/free/") ||
      window.location.pathname.startsWith("/free-tools/"));

  const effectiveAccessTier: "FREE" | "PRO" =
    isFreeRoute ? "FREE" : (props.accessTier ?? "FREE");
  const effectiveInitialMode: ProfileMode =
    isFreeRoute ? "quick" : (props.initialProfileMode ?? "engineering");

  // ── Hooks (unconditional) ──
  const machine = useUniversalIndustrialDecisionFormMachine({
    schema: machineSchema,
    schemaHash: props.schemaHash,
    executeEndpoint: props.executeEndpoint,
    initialProfileMode: effectiveInitialMode,
  });

  const { state } = machine;
  const response = state.serverResponseState.response;
  const premiumHook = state.premiumHookState.hook;

  // Access tier (effective — FREE route overrides wrapper PRO)
  const accessTier = effectiveAccessTier;
  const isPro = accessTier === "PRO";
  // Hydration-safe tier check — use accessTier (from props) not isFreeRoute (uses window)
  const isFreeTier = accessTier === "FREE";
  const hasSession = isPro && !!props.usageSessionId;
  const runsRemaining = props.remainingRuns ?? 0;
  const sessionExhausted = isPro && hasSession && runsRemaining <= 0;
  const creditSessionLoading = props.creditSessionLoading ?? false;
  const isExecuting = state.executionState === "executing";
  const hasResult = hasServerResponse(response);

  const clientBlockerCount = state.blockerState.blockers.filter(
    (b) => b.severity === "BLOCKER" || b.severity === "CRITICAL",
  ).length;

  // Admin bypass: owner email (barisbagirlar@gmail.com) has unlimited Pro access
  // with no credit session required. The server-side API handles bypass.
  const isBypassUser = isPro && !props.onRequestCreditSession;

  const primaryButtonDisabled =
    isExecuting ||
    creditSessionLoading ||
    (isPro && !hasSession && !isBypassUser) ||
    (isPro && sessionExhausted);

  const primaryButtonLabel = isFreeTier
    ? (isExecuting ? "Calculating..." : "Calculate")
    : getPrimaryCtaLabel(accessTier, isExecuting, hasSession || isBypassUser, hasResult, creditSessionLoading);

  const primaryButtonAction = () => {
    if (isPro && (!hasSession || sessionExhausted)) {
      if (props.onRequestCreditSession && props.toolKey) {
        props.onRequestCreditSession(props.toolKey);
        return;
      }
      // No session handler provided (bypass path) → execute directly;
      // the server-side API handles admin/owner bypass internally.
      void machine.submitServerExecution();
      return;
    }
    void machine.submitServerExecution();
  };

  // Display-safe labels
  const schemaRecord = props.schema as unknown as Record<string, unknown>;
  const toolName =
    props.renderContract?.toolName ??
    String(schemaRecord.tool_name ?? schemaRecord.toolName ?? "");
  const rawCategoryLabel =
    props.renderContract?.categoryLabel ??
    String(schemaRecord.category_label ?? schemaRecord.categoryLabel ?? schemaRecord.category ?? "");

  const displayToolName = getDisplayToolName(
    props.schema?.tool_name as string | null | undefined,
    props.schema?.tool_key as string || props.toolKey || "",
  );
  const rawCategory = getDisplayCategoryLabel(props.schema?.category as string | null | undefined);
  const displayCategory = safeDisplayCategory(rawCategoryLabel || rawCategory);
  const rawOperation = props.schema?.primary_operation as string | null | undefined;
  const displayOperation = getDisplayOperationLabel(rawOperation);
  const rawScope = String(props.schema?.scope ?? "");
  const cleanedScope = rawOperation && rawScope.includes(rawOperation)
    ? rawScope.replaceAll(rawOperation, displayOperation)
    : rawScope;
  const displayScope = safeDisplayScope(
    cleanedScope || rawScope,
    displayToolName || toolName,
    displayCategory,
  );

  // FREE-mode hero override for break-even tool
  const freeHeroSubtitle =
    isFreeTier &&
    (props.toolKey === "break-even-and-margin-of-safety-analysis" ||
      props.schema?.tool_key === "break-even-and-margin-of-safety-analysis")
      ? "Find how many units you must sell to cover costs and how much sales buffer you have."
      : displayScope;

  // ── ViewModel ──
  const vmPurpose = isFreeTier ? freeHeroSubtitle : displayScope;
  const vm = useMemo(
    () => buildCalculatorViewModel(
      props.schema, state, machine, props, state.profileModeState.mode, response,
      accessTier, hasSession, runsRemaining, isExecuting, hasResult,
      primaryButtonDisabled, primaryButtonLabel, primaryButtonAction,
      clientBlockerCount, toolName, vmPurpose,
      displayCategory, displayOperation,
      identityCheck as { ok: boolean; reason?: string } | null,
    ),
    [
      props.schema, state, machine, props, state.profileModeState.mode, response,
      accessTier, hasSession, runsRemaining, isExecuting, hasResult,
      primaryButtonDisabled, primaryButtonLabel, primaryButtonAction,
      clientBlockerCount, toolName, vmPurpose,
      displayCategory, displayOperation, identityCheck,
    ],
  );

  // ── Guard blocks (after hooks) ──
  if (contractErrors.length > 0) {
    return <ContractBlocker errors={contractErrors} />;
  }

  if (identityCheck && !identityCheck.ok) {
    return <IdentityBlocker reason={identityCheck.reason!} />;
  }

  return (
    <section
      className={`sc-v531-shell ${props.className ?? ""}`}
      data-renderer="UniversalIndustrialDecisionForm"
      data-v531="true"
    >
      {/* ── 1. Compact hero ── */}
      <header className="sc-v531-hero">
        <h1 className="sc-v531-title">{vm.title}</h1>
        <p className="sc-v531-hero__scope">{vm.purpose}</p>
        <div className="sc-v531-meta-row" aria-label="Tool metadata">
          {vm.badges.map((badge, i) => (
            <span key={i} className="sc-v531-chip">{badge.label}</span>
          ))}
        </div>
      </header>

      {/* ── Main workspace: inputs + action panel ── */}
      <div className="sc-v531-layout">
        <main className="sc-v531-main-panel">
          {/* Input cards */}
          {vm.fields.length === 0 && (
            <p className="sc-v531-empty">No inputs defined for this tool.</p>
          )}
          <div className="sc-v531-field-grid">
            {vm.fields.map((field) => (
              <CalculatorInputField
                key={field.id}
                field={field}
                onValueChange={(value) => machine.setInputValue(field.id, value)}
                onUnitChange={(unit) => machine.setSelectedUnit(field.id, unit)}
                onEvidenceChange={(valueVerified, sourceVerified) => {
                  machine.updateEvidence(field.id, {
                    enabled: valueVerified || sourceVerified,
                    user_verified: valueVerified,
                    source_verified: sourceVerified,
                  });
                }}
              />
            ))}
          </div>

        {/* Results */}
        <section className="sc-v531-section sc-v531-results" aria-label="Results">
          {vm.resultState.hasResult ? (
            <div className="sc-v531-result-content">
              {/* FREE mode: show all outputs in a clean summary panel */}
              {isFreeTier && response?.outputs && response.outputs.length > 0 && (
                <div className="sc-v531-free-results">
                  <h3 className="sc-v531-free-results-title">Business Summary</h3>
                  <div className="sc-v531-free-results-grid">
                    {response.outputs.filter((o) => !isStatusOutput(o)).map((out, idx) => {
                      const formattedValue = typeof out.value === "number"
                        ? formatBusinessResult(out.name, out.value)
                        : formatSafeValue(out.value);
                      const freeUnitSuffix = getFreeOutputUnitSuffix(out);
                      const displayStr = freeUnitSuffix
                        ? (formattedValue.endsWith(freeUnitSuffix) ? formattedValue : `${formattedValue} ${freeUnitSuffix}`)
                        : formattedValue;
                      const isLarge = displayStr.length > 20;
                      return (
                        <div key={idx} className="sc-v531-free-result-item">
                          <span className="sc-v531-free-result-name">{out.name}</span>
                          <span
                            className={`sc-v531-free-result-value${isLarge ? " sc-v531-free-result-value--large" : ""}`}
                          >
                            {displayStr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Decision in FREE mode — structured status + governing driver */}
              {isFreeTier && response?.outputs && response.outputs.length > 0 && (
                <div className="sc-v531-free-decision">
                  {(() => {
                    const mosOutput = response.outputs.find((o) => {
                      const key = (o.name ?? "").toLowerCase().replace(/[\s-]+/g, "_");
                      return key.includes("margin_of_safety_percent")
                        || (key.includes("margin") && key.includes("safety") && (key.includes("percent") || key.includes("%")));
                    });
                    const mosPercent = typeof mosOutput?.value === "number" ? mosOutput.value : null;

                    let decisionStatus: string;
                    let governingDriver: string;

                    if (mosPercent !== null && mosPercent < 0) {
                      decisionStatus = "ACTION REQUIRED";
                      governingDriver = "Actual sales are below break-even";
                    } else if (mosPercent !== null && mosPercent >= 50) {
                      decisionStatus = "HEALTHY BUFFER";
                      governingDriver = "Sales are far above break-even";
                    } else if (mosPercent !== null && mosPercent >= 0) {
                      decisionStatus = "MONITOR";
                      governingDriver = "Sales are above break-even but buffer is limited";
                    } else {
                      decisionStatus = "";
                      governingDriver = "";
                    }

                    const dsCssKey = decisionStatus.toLowerCase().replace(/\s+/g, "_");

                    return (
                      <>
                        {decisionStatus && (
                          <div className="sc-v531-free-decision-row">
                            <span className="sc-v531-free-decision-label">Decision Status</span>
                            <span className={`sc-v531-free-decision-status sc-v531-fds-${dsCssKey}`}>
                              {decisionStatus}
                            </span>
                          </div>
                        )}
                        {governingDriver && (
                          <div className="sc-v531-free-decision-row">
                            <span className="sc-v531-free-decision-label">Governing Driver</span>
                            <span className="sc-v531-free-decision-driver">{governingDriver}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* PRO mode: Decision Summary + Primary Results + Professional Interpretation */}
              {!isFreeTier && response?.outputs && (
                <div className="sc-v531-pro-results-container">
                  {/* Decision Summary */}
                  {(() => {
                    const dsOutput = response.outputs.find((o) =>
                      (o.name ?? "").toLowerCase().replace(/[\s-]+/g, "_").includes("decision_status")
                    );
                    const gdOutput = response.outputs.find((o) =>
                      (o.name ?? "").toLowerCase().replace(/[\s-]+/g, "_").includes("governing_driver")
                    );
                    const dsValue = typeof dsOutput?.value === "string" ? dsOutput.value : "";
                    const gdValue = typeof gdOutput?.value === "string" ? gdOutput.value : "";

                    const isCompressedAir = props.toolKey === "compressed-air-leak-cost-calculator" ||
                      props.schema?.tool_key === "compressed-air-leak-cost-calculator";

                    let displayStatus = dsValue.replace(/_/g, " ");
                    let displayDriver = gdValue;
                    let nextAction = "";
                    let whyItMatters = "";
                    let keyAssumptionCheck = "";

                    if (isCompressedAir) {
                      if (dsValue === "ACTION_REQUIRED") {
                        displayStatus = "ACTION REQUIRED";
                        displayDriver = "Fast repair payback";
                        nextAction = "Repair this leak immediately and verify system pressure after repair.";
                        whyItMatters = "This leak creates recurring energy loss. Under the entered operating hours and electricity price, the repair pays back quickly.";
                        keyAssumptionCheck = "Confirm leak diameter, operating hours, compressor specific power, system pressure and electricity price before using this for procurement or maintenance planning.";
                      } else if (dsValue === "REVIEW") {
                        displayStatus = "MONITOR";
                        displayDriver = "Moderate economic impact";
                        nextAction = "Monitor the leak and schedule repair with the next maintenance window.";
                        whyItMatters = "The estimated annual loss exists, but urgency depends on repair access, downtime and operating schedule.";
                        keyAssumptionCheck = "Confirm operating hours and energy cost before deferring action.";
                      } else if (dsValue === "MONITOR") {
                        displayStatus = "OK";
                        displayDriver = "Low immediate economic impact";
                        nextAction = "Document the result and recheck if pressure, operating hours or electricity price changes.";
                        whyItMatters = "The current estimate does not justify urgent intervention under the entered values.";
                        keyAssumptionCheck = "Confirm that the leak size and compressor power assumptions are realistic.";
                      }
                    }

                    return (
                      <section className="sc-v531-pro-decision-summary" aria-label="Decision Summary">
                        <h3 className="sc-v531-pro-section-title">Decision Summary</h3>
                        {displayStatus && (
                          <div className="sc-v531-pro-ds-row">
                            <span className="sc-v531-pro-ds-label">Decision Status</span>
                            <span className={`sc-v531-pro-ds-value sc-v531-ds-${displayStatus.toLowerCase().replace(/\s+/g, "_")}`}>
                              {displayStatus}
                            </span>
                          </div>
                        )}
                        {displayDriver && (
                          <div className="sc-v531-pro-ds-row">
                            <span className="sc-v531-pro-ds-label">Governing Driver</span>
                            <span className="sc-v531-pro-ds-text">{displayDriver}</span>
                          </div>
                        )}
                        {nextAction && (
                          <div className="sc-v531-pro-ds-block">
                            <span className="sc-v531-pro-ds-label">Recommended Next Action</span>
                            <p className="sc-v531-pro-ds-text">{nextAction}</p>
                          </div>
                        )}
                        {whyItMatters && (
                          <div className="sc-v531-pro-ds-block">
                            <span className="sc-v531-pro-ds-label">Why It Matters</span>
                            <p className="sc-v531-pro-ds-text">{whyItMatters}</p>
                          </div>
                        )}
                        {keyAssumptionCheck && (
                          <div className="sc-v531-pro-ds-block">
                            <span className="sc-v531-pro-ds-label">Key Assumption Check</span>
                            <p className="sc-v531-pro-ds-text">{keyAssumptionCheck}</p>
                          </div>
                        )}
                      </section>
                    );
                  })()}

                  {/* Primary Results */}
                  <section className="sc-v531-pro-results" aria-label="Primary Results">
                    <h3 className="sc-v531-pro-section-title">Primary Results</h3>
                    <div className="sc-v531-pro-results-grid">
                      {response.outputs
                        .filter((o) => !isStatusOutput(o))
                        .map((out, idx) => {
                          const formattedValue = typeof out.value === "number"
                            ? formatDisplayNumber(out.value)
                            : formatSafeValue(out.value);
                          const cleanUnit = getProOutputDisplayUnit(out.id ?? "", out.unit);
                          // Avoid duplicating unit when label already contains it
                          const outLabel = out.name || "";
                          const unitNeeded = cleanUnit && !outLabel.toLowerCase().includes(cleanUnit.toLowerCase());
                          const displayStr = unitNeeded ? `${formattedValue} ${cleanUnit}` : formattedValue;
                          const cleanSymbol = out.id ? getProOutputSymbol(out.id) : "";
                          const meaning = out.public_explanation || "";
                          return (
                            <div key={idx} className="sc-v531-pro-result-card">
                              <span className="sc-v531-pro-result-name">{out.name}</span>
                              <span className="sc-v531-pro-result-value">{displayStr}</span>
                              {cleanSymbol && <span className="sc-v531-pro-result-varid">{cleanSymbol}</span>}
                              {meaning && <p className="sc-v531-pro-result-meaning">{meaning}</p>}
                            </div>
                          );
                        })}
                    </div>
                  </section>

                  {/* ── Result Intelligence (PRO only) ── */}
                  {(() => {
                    const isCompressedAir = props.toolKey === "compressed-air-leak-cost-calculator" ||
                      props.schema?.tool_key === "compressed-air-leak-cost-calculator";
                    if (!isCompressedAir) return null;

                    const annualLeakOutput = response.outputs.find((o) =>
                      (o.id ?? "").includes("annual_leak_cost")
                    );
                    const annualLeakCost = typeof annualLeakOutput?.value === "number" ? annualLeakOutput.value : null;
                    const costUnit = annualLeakOutput?.unit
                      ? getProOutputDisplayUnit("annual_leak_cost", annualLeakOutput.unit)
                      : "Currency/year";
                    const formattedCost = annualLeakCost !== null
                      ? `${formatDisplayNumber(annualLeakCost)} ${costUnit}`
                      : "";

                    const paybackOutput = response.outputs.find((o) =>
                      (o.id ?? "").includes("repair_payback_days")
                    );
                    const paybackDays = typeof paybackOutput?.value === "number" ? paybackOutput.value : null;

                    let actionPriorityLabel = "";
                    let actionPriorityText = "";
                    if (paybackDays !== null) {
                      if (paybackDays <= 30) {
                        actionPriorityLabel = "High";
                        actionPriorityText = "Repair should be prioritized because the expected payback is under 30 days.";
                      } else if (paybackDays <= 180) {
                        actionPriorityLabel = "Medium";
                        actionPriorityText = "Repair can be scheduled in the next maintenance window.";
                      } else {
                        actionPriorityLabel = "Low";
                        actionPriorityText = "Repair may be deferred unless reliability, safety or production constraints require action.";
                      }
                    } else {
                      actionPriorityLabel = "Review Required";
                      actionPriorityText = "Repair priority could not be determined from the available payback output.";
                    }

                    return (
                      <section className="sc-v531-pro-intelligence" aria-label="Result Intelligence">
                        <h3 className="sc-v531-pro-section-title">Result Intelligence</h3>
                        <p className="sc-v531-pro-ri-intro">
                          Use this decision layer to prioritize action, verify assumptions and translate the calculation into maintenance, cost and operational decisions.
                        </p>
                        <div className="sc-v531-pro-ri-grid">
                          {/* 1. Financial Impact */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Financial Impact</h4>
                            {annualLeakCost !== null ? (
                              <p className="sc-v531-pro-ri-card-text">
                                The estimated annual leak cost is {formattedCost}. This is recurring avoidable energy cost under the entered operating schedule and electricity price.
                              </p>
                            ) : (
                              <p className="sc-v531-pro-ri-card-text">
                                The annual cost impact could not be estimated from the available outputs.
                              </p>
                            )}
                          </div>

                          {/* 2. Operational Impact */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Operational Impact</h4>
                            <p className="sc-v531-pro-ri-card-text">
                              The leak increases compressor load during operating hours. Larger leak diameter, higher pressure and longer annual runtime increase the energy penalty.
                            </p>
                          </div>

                          {/* 3. Action Priority */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Action Priority</h4>
                            <p className="sc-v531-pro-ri-card-priority">
                              Priority: <strong>{actionPriorityLabel}</strong>
                            </p>
                            <p className="sc-v531-pro-ri-card-text">{actionPriorityText}</p>
                          </div>

                          {/* 4. Assumption Quality */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Assumption Quality</h4>
                            <p className="sc-v531-pro-ri-card-priority">
                              Status: <strong>Review Required</strong>
                            </p>
                            <p className="sc-v531-pro-ri-card-text">
                              Result quality depends on the accuracy of leak diameter, system pressure, operating hours, compressor specific power, electricity price and repair cost.
                            </p>
                            <ul className="sc-v531-pro-ri-verify-list">
                              <li>Leak diameter</li>
                              <li>System pressure</li>
                              <li>Operating hours</li>
                              <li>Compressor specific power</li>
                              <li>Electricity price</li>
                              <li>Repair cost</li>
                            </ul>
                          </div>

                          {/* 5. Key Sensitivity Drivers */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Key Sensitivity Drivers</h4>
                            <ul className="sc-v531-pro-ri-verify-list">
                              <li>Leak diameter</li>
                              <li>System pressure</li>
                              <li>Operating hours</li>
                              <li>Compressor specific power</li>
                              <li>Electricity price</li>
                              <li>Repair cost</li>
                            </ul>
                          </div>

                          {/* 6. Verification Checklist */}
                          <div className="sc-v531-pro-ri-card">
                            <h4 className="sc-v531-pro-ri-card-title">Verification Checklist</h4>
                            <ul className="sc-v531-pro-ri-verify-list sc-v531-pro-ri-check-list">
                              <li>Confirm leak diameter by site measurement.</li>
                              <li>Confirm pressure at or near the leak location.</li>
                              <li>Confirm annual operating hours.</li>
                              <li>Confirm compressor specific power from equipment or audit records.</li>
                              <li>Confirm electricity tariff.</li>
                              <li>Confirm repair cost estimate.</li>
                            </ul>
                          </div>
                        </div>
                      </section>
                    );
                  })()}

                  {/* Professional Interpretation (PRO only) */}
                  {(() => {
                    const isCompressedAir = props.toolKey === "compressed-air-leak-cost-calculator" ||
                      props.schema?.tool_key === "compressed-air-leak-cost-calculator";
                    if (!isCompressedAir) return null;

                    const paybackOutput = response.outputs.find((o) =>
                      (o.id ?? "").includes("repair_payback_days")
                    );
                    const paybackDays = typeof paybackOutput?.value === "number" ? paybackOutput.value : null;

                    let priorityLabel = "";
                    let priorityText = "";
                    if (paybackDays !== null) {
                      if (paybackDays <= 30) {
                        priorityLabel = "High";
                        priorityText = "Repair should be prioritized because the expected payback is under 30 days.";
                      } else if (paybackDays <= 180) {
                        priorityLabel = "Medium";
                        priorityText = "Repair can be scheduled in the next maintenance window.";
                      } else {
                        priorityLabel = "Low";
                        priorityText = "Repair may be deferred unless reliability, safety or production constraints require action.";
                      }
                    }

                    return (
                      <section className="sc-v531-pro-professional-interpretation" aria-label="Professional Interpretation">
                        <h3 className="sc-v531-pro-section-title">Professional Interpretation</h3>
                        <p className="sc-v531-pro-pi-intro">
                          Use this interpretation to prioritize leak repair, energy-cost reduction and maintenance scheduling.
                        </p>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">1. Operating Impact</h4>
                          <p className="sc-v531-pro-pi-text">
                            The estimated air loss increases compressor load during operating hours. Higher pressure, larger leak diameter and longer annual runtime increase the loss.
                          </p>
                        </div>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">2. Cost Impact</h4>
                          <p className="sc-v531-pro-pi-text">
                            Annual leak cost is driven by air loss, compressor specific power, operating hours and electricity price. Use site-specific energy tariffs for final maintenance decisions.
                          </p>
                        </div>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">3. Payback Interpretation</h4>
                          <p className="sc-v531-pro-pi-text">
                            The repair payback period compares estimated repair cost against annualized leakage cost. Short payback indicates high maintenance priority.
                          </p>
                        </div>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">4. Action Priority</h4>
                          {paybackDays !== null ? (
                            <>
                              <p className="sc-v531-pro-pi-priority">
                                Priority: <strong>{priorityLabel}</strong>
                              </p>
                              <p className="sc-v531-pro-pi-text">{priorityText}</p>
                            </>
                          ) : (
                            <p className="sc-v531-pro-pi-text">Payback period could not be determined.</p>
                          )}
                        </div>

                        <div className="sc-v531-pro-pi-block">
                          <h4 className="sc-v531-pro-pi-subtitle">5. Assumption Quality</h4>
                          <p className="sc-v531-pro-pi-text">
                            Result quality depends on the accuracy of leak diameter, pressure, operating hours, compressor specific power and electricity price. For final procurement decisions, validate these values from site measurements or maintenance records.
                          </p>
                        </div>
                      </section>
                    );
                  })()}
                </div>
              )}
              </div>
            ) : (
              <div className="sc-v531-placeholder">
                <p className="sc-v531-placeholder-title">No result yet</p>
                <p className="sc-v531-placeholder-text">
                  {isFreeTier
                    ? "Enter your values and click \"Calculate\" to see your results."
                    : "Enter values and run the calculation. Results and decision guidance will appear here."
                  }
                </p>
              </div>
            )}
          </section>

          {/* Premium hook (hidden in FREE mode) */}
          {!isFreeRoute && premiumHook && (
            <PremiumPanel hook={premiumHook} onCheckout={() => machine.requestCheckout()} />
          )}
        </main>

        {/* Right: action panel */}
        <aside className="sc-v531-side-panel" aria-label="Action panel">
          <div className="sc-v531-side-panel-inner">
            <button
              type="button"
              className="sc-v531-primary-action"
              disabled={vm.action.disabled}
              aria-disabled={vm.action.disabled}
              onClick={vm.action.onAction}
            >
              {vm.action.label}
            </button>

            {vm.action.disabled && vm.action.disabledReason && (
              <p className="sc-v531-disabled-reason" role="status">
                {vm.action.disabledReason}
              </p>
            )}

            <button type="button" className="sc-v531-side-secondary" onClick={machine.resetInputs}>
              Reset inputs
            </button>
          </div>
        </aside>
      </div>

      {/* ── 3. Advanced details (collapsed by default — native <details>) ── */}
      <details className="sc-v531-advanced" data-testid="advanced-details">
        <summary className="sc-v531-advanced-summary">
          <span>Advanced details</span>
          <span className="sc-v531-advanced-links">
            {isFreeTier
              ? "Formula logic · Validation notes · Calculation assumptions"
              : "Formula logic · Validation notes · Sensitivity · Audit trail · Export"
            }
          </span>
        </summary>
        <div className="sc-v531-advanced-body">
          <FormulaLogicSection toolKey={props.toolKey} schema={props.schema} />
          <ValidationNotesSection isFreeTier={isFreeTier} />
          {isFreeTier && <CalculationAssumptionsSection />}
          {!isFreeTier && (
            <>
              <SensitivitySection toolKey={props.toolKey} />
              <ProAuditTrailSection />
              <ProExportSection />
            </>
          )}
          </div>
      </details>

      {/* Mobile bar */}
      <div className="sc-v531-mobile-action-bar">
        <span>
          {hasResult
            ? (response?.decision_interpretation?.primary_decision ?? vm.resultState.executionLabel)
            : clientBlockerCount > 0
              ? "Review required"
              : "Ready"}
        </span>
        <button
          type="button"
          className="sc-v531-primary-button"
          disabled={vm.action.disabled}
          onClick={vm.action.onAction}
        >
          {vm.action.label}
        </button>
      </div>
    </section>
  );
}

// ── Input field — clean primary UI ──────────────────────────────────────────────

function CalculatorInputField({
  field,
  onValueChange,
  onUnitChange,
  onEvidenceChange,
}: {
  field: FieldViewModel;
  onValueChange: (value: string | number | boolean | null) => void;
  onUnitChange: (unit: string) => void;
  onEvidenceChange: (valueVerified: boolean, sourceVerified: boolean) => void;
}) {
  const inputId = `sc-v531-input-${field.id}`;
  const hasBlocker = field.blockers.length > 0;

  return (
    <div className="sc-v531-field-card" data-criticality={field.criticality.toLowerCase()} data-error={hasBlocker}>
      {/* Header: label + symbol */}
      <div className="sc-v531-field-header">
        <label htmlFor={inputId} className="sc-v531-field-title">{field.label}</label>
        {field.symbol && <span className="sc-v531-field-symbol">({field.symbol})</span>}
      </div>

      {/* Help text */}
      {field.helpText && <p className="sc-v531-field-help">{field.helpText}</p>}

      {/* Input + unit row */}
      <div className="sc-v531-input-row">
        {renderValueInput(inputId, field, onValueChange)}
        {field.allowedUnits.length > 0 && (
          <select
            className="sc-v531-unit-select"
            value={field.selectedUnit || field.allowedUnits[0]}
            aria-label={`${field.label} unit`}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onUnitChange(e.target.value)}
          >
            {field.allowedUnits.map((unit) => (
              <option key={unit} value={unit}>{formatCleanUnitLabel(unit)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Clean reference helper — one line per input */}
      {field.cleanReferenceHelper && (
        <p className="sc-v531-ref-helper">{field.cleanReferenceHelper}</p>
      )}
    </div>
  );
}

function renderValueInput(
  inputId: string,
  field: FieldViewModel,
  onValueChange: (value: string | number | boolean | null) => void,
) {
  if (field.type === "boolean") {
    return (
      <label className="sc-v531-toggle">
        <input
          type="checkbox"
          checked={field.value === true}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange(e.target.checked)}
        />
        <span>Confirmed</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={inputId}
        className="sc-v531-input"
        value={typeof field.value === "string" ? field.value : ""}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onValueChange(e.target.value)}
      >
        <option value="">Select value</option>
        {field.allowedValues.map((opt) => (
          <option key={opt} value={opt}>{humanizeEnum(opt)}</option>
        ))}
      </select>
    );
  }

  const unitHint = field.allowedUnits.some((u) => /[\$€£¥₺]/i.test(u) || /usd|eur|gbp|try|tl/i.test(u))
    ? "Use decimal point for cents, e.g. 500000.005"
    : "";

  return (
    <input
      id={inputId}
      className="sc-v531-input"
      inputMode={field.type === "number" || field.type === "integer" ? "decimal" : "text"}
      type="text"
      placeholder={unitHint || ""}
      value={field.type === "number" || field.type === "integer" ? (typeof field.value === "number" ? String(field.value) : "") : (typeof field.value === "string" ? field.value : "")}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (field.type === "number" || field.type === "integer") {
          if (e.target.value === "") { onValueChange(null); return; }
          const raw = e.target.value.replace(",", ".");
          const next = Number(raw);
          if (Number.isFinite(next)) {
            onValueChange(next);
          }
          // else: ignore invalid intermediate text (controlled input reverts to last valid value)
        } else {
          onValueChange(e.target.value);
        }
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        // Normalize comma decimals on blur (e.g. "500000,005" → "500000.005")
        if ((field.type === "number" || field.type === "integer") && e.target.value.includes(",")) {
          const normalized = e.target.value.replace(",", ".");
          const next = Number(normalized);
          if (Number.isFinite(next)) {
            onValueChange(next);
          }
        }
      }}
    />
  );
}

// ── Guard components ───────────────────────────────────────────────────────────

function ContractBlocker({ errors }: { errors: string[] }) {
  return (
    <section className="sc-v531-contract-blocker" role="alert">
      <h2>Schema contract rejected</h2>
      <p>The form cannot render this schema until V5.3.1 contract blockers are corrected.</p>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </section>
  );
}

function IdentityBlocker({ reason }: { reason: string }) {
  return (
    <section className="sc-v531-contract-blocker" role="alert">
      <h2>Schema identity mismatch</h2>
      <p>{reason}</p>
      <p>The requested tool does not match the resolved schema. No inputs or execution are available.</p>
    </section>
  );
}

// ── Post-execution panels (in advanced details) —────────────────────────────────
// ── NO server response data rendered here. Only controlled static text. ─────────

/**
 * Static formula description by tool_key.
 * No server response data (proof_pack_public.sections) is rendered in normal Advanced.
 */
function getFormulaText(toolKey: string | undefined): string {
  switch (toolKey) {
    case "compressed-air-leak-cost-calculator":
      return "The calculation estimates air loss from leak diameter and pressure, converts air loss into annual energy use using compressor specific power and operating hours, then estimates annual cost and repair payback.";
    case "break-even-and-margin-of-safety-analysis":
      return "This calculator uses the entered cost, price, variable cost and sales volume values to estimate break-even volume, break-even revenue and margin of safety.";
    default:
      return "Calculation uses standard engineering formulas based on input parameters. Exact formula expressions are protected.";
  }
}

/** Controlled formula logic — static text, no server data. */
function FormulaLogicSection({
  toolKey,
  schema,
}: {
  toolKey?: string;
  schema: SuperV4Schema;
}) {
  const formulaText = getFormulaText(toolKey);
  const standards = Array.isArray(schema.standards) ? (schema.standards as Array<{ name?: string }>) : [];
  const standardNames = standards
    .map((s) => s.name)
    .filter((n): n is string => Boolean(n));

  return (
    <section className="sc-v531-advanced-section" aria-label="Formula logic">
      <h3 className="sc-v531-advanced-title">Formula logic</h3>
      <p className="sc-v531-methodology-text">{formulaText}</p>
      {standardNames.length > 0 && (
        <div className="sc-v531-methodology-stack">
          <p className="sc-v531-methodology-text">
            <strong>Standards referenced:</strong> {standardNames.join(", ")}
          </p>
        </div>
      )}
    </section>
  );
}

/** Controlled validation notes — static text, no server warnings. */
function ValidationNotesSection({ isFreeTier }: { isFreeTier: boolean }) {
  return (
    <section className="sc-v531-advanced-section" aria-label="Validation notes">
      <h3 className="sc-v531-advanced-title">Validation notes</h3>
      <ul className="sc-v531-assumption-list">
        <li className="sc-v531-assumption-item">Inputs are checked against visible reference ranges.</li>
        <li className="sc-v531-assumption-item">Values outside the reference range may reduce decision quality.</li>
        <li className="sc-v531-assumption-item">
          {isFreeTier
            ? "Verify commercial values before using the result for pricing or planning."
            : "Evidence is recommended before final maintenance or procurement decision."
          }
        </li>
      </ul>
    </section>
  );
}

/** Controlled calculation assumptions — static text for FREE. */
function CalculationAssumptionsSection() {
  return (
    <section className="sc-v531-advanced-section" aria-label="Calculation assumptions">
      <h3 className="sc-v531-advanced-title">Calculation assumptions</h3>
      <ul className="sc-v531-assumption-list">
        <li className="sc-v531-assumption-item">Currency values use the selected display currency.</li>
        <li className="sc-v531-assumption-item">Results depend on user-entered values.</li>
        <li className="sc-v531-assumption-item">This output is decision support, not audited financial advice.</li>
      </ul>
    </section>
  );
}

/** Controlled sensitivity — static text from tool_key map. */
function SensitivitySection({ toolKey }: { toolKey?: string }) {
  const bullets = getSensitivityBullets(toolKey);
  return (
    <section className="sc-v531-advanced-section" aria-label="Sensitivity">
      <h3 className="sc-v531-advanced-title">Sensitivity</h3>
      <ul className="sc-v531-assumption-list">
        {bullets.map((b, i) => (
          <li key={i} className="sc-v531-assumption-item">{b}</li>
        ))}
      </ul>
    </section>
  );
}

function getSensitivityBullets(toolKey: string | undefined): string[] {
  switch (toolKey) {
    case "compressed-air-leak-cost-calculator":
      return [
        "Leak diameter and system pressure strongly affect estimated air loss.",
        "Operating hours and compressor specific power strongly affect annual energy loss.",
        "Electricity price and repair cost drive the economic payback.",
      ];
    default:
      return [
        "Verify key input values before making decisions based on results.",
      ];
  }
}

/** Controlled audit trail — PRO only. Clean text only. */
function ProAuditTrailSection() {
  return (
    <section className="sc-v531-advanced-section" aria-label="Audit trail">
      <h3 className="sc-v531-advanced-title">Audit trail</h3>
      <p className="sc-v531-methodology-text">
        Calculation inputs, normalized values, outputs and proof-pack metadata are
        audit-traceable. Raw developer payload is not displayed in the customer interface.
      </p>
    </section>
  );
}

/** Controlled export — PRO only. Clean text only. */
function ProExportSection() {
  return (
    <section className="sc-v531-advanced-section" aria-label="Export">
      <h3 className="sc-v531-advanced-title">Export</h3>
      <p className="sc-v531-methodology-text">
        Export-ready report structure is prepared for production workflows.
      </p>
    </section>
  );
}

function PremiumPanel({
  hook,
  onCheckout,
}: {
  hook: import("@/sectorcalc/monetization/monetization-types").PremiumHookPublic;
  onCheckout: () => Promise<string | null>;
}) {
  const [loading, setLoading] = useState(false);
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const url = await onCheckout();
      if (url) window.location.href = url;
    } finally { setLoading(false); }
  };
  return (
    <section className="sc-v531-advanced-section" aria-label="Premium hook">
      <h3 className="sc-v531-advanced-title">Monetary loss exposure</h3>
      <div className="sc-v531-premium-card">
        <strong>{hook.pain_metric.label}</strong>
        <p className="sc-v531-premium-value">
          {hook.pain_metric.value !== null
            ? `${formatSafeValue(hook.pain_metric.value)} ${hook.pain_metric.unit}`
            : "Insufficient input context."}
        </p>
        <p>{hook.pain_metric.explanation}</p>
        <p className="sc-v531-legal-disclaimer">{hook.pain_metric.safety_note}</p>
        <button type="button" className="sc-v531-primary-button" disabled={loading} onClick={handleCheckout}>
          {loading ? "Opening..." : hook.cta.label}
        </button>
        <p className="sc-v531-empty">{hook.cta.subtext}</p>
      </div>
    </section>
  );
}

// ── Shared small components ─────────────────────────────────────────────────────

function WarningCard({ severity, title, detail }: { severity: string; title: string; detail: string }) {
  if (!hasMessage(title)) return null;
  return (
    <div className="sc-v531-warning-card" data-severity={severity.toLowerCase()}>
      <span className="sc-v531-warning-severity">{severity}</span>
      <strong className="sc-v531-warning-title">{title}</strong>
      {hasMessage(detail) && <p className="sc-v531-warning-detail">{detail}</p>}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function executionStateToStatus(state: string): CalcStatus {
  if (state === "server_ok") return "OK";
  if (state === "server_review") return "REVIEW";
  if (state === "server_blocked" || state === "client_precheck_blocked" || state === "schema_rejected") return "BLOCKED";
  if (state === "server_reprice") return "REPRICE";
  if (state === "server_reject") return "REJECT";
  if (state === "server_hold") return "HOLD";
  return "REVIEW";
}

export default UniversalIndustrialDecisionForm;
