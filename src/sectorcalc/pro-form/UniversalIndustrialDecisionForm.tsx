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
  RedactionStatus,
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
  shouldShowHiddenRiskPanel,
  shouldShowBusinessImpactPanel,
  shouldShowFmeaPanel,
  shouldShowAuditSealPanel,
  shouldShowExportPanel,
  safeBasePreview,
  safeReferenceLabel,
  hasUsefulReferenceValues,
  safeDisplayCategory,
  hasClientBlockers,
  getPrimaryCtaLabel,
  safeRedactionDisplay,
  formatSafeValue,
  safeDisplayScope,
  formatDisplayUnit,
} from "./form-render-helpers";
import "./universal-industrial-decision-form.css";

// ── ViewModel types ────────────────────────────────────────────────────────────

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
  clientWarningCount: number,
  toolName: string,
  displayScope: string,
  displayCategory: string,
  displayOperation: string,
  identityCheck: { ok: boolean; reason?: string } | null,
): CalculatorViewModel {
  const decision = response?.decision_interpretation;

  // Badges
  const badges: CalculatorViewModel["badges"] = [];
  badges.push({ label: displayCategory || "Calculator", type: "category" });
  badges.push({ label: accessTier === "PRO" ? "Pro" : "Free", type: "tier" });
  badges.push({ label: `Risk: ${schema.risk_level}`, type: "risk" });
  badges.push({ label: `v${schema.metadata.schema_version}`, type: "version" });
  if (accessTier === "PRO" && hasSession) {
    badges.push({ label: `${runsRemaining}/10 runs`, type: "runs" });
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
        const preview = machine.normalizedPreview.find((item) => item.input_id === input.id);
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

      return {
        id: input.id,
        label: input.name,
        symbol: input.symbol ?? null,
        type: input.type === "integer" ? "integer" : (input.type as FieldViewModel["type"]),
        value: state.rawInputState[input.id] ?? null,
        selectedUnit: state.selectedUnitState[input.id] ?? "",
        allowedUnits: input.allowed_display_units ?? [],
        unitSelectable: !!input.unit_selectable,
        allowedValues: input.allowed_values ?? [],
        helpText: input.user_help_text ?? input.help_text ?? "",
        criticality: input.criticality,
        blockers: state.validationState.client_precheck_errors.filter((issue) => issue.input_id === input.id),
        basePreview: basePreviewVal,
        referenceSource: inputRefSource,
        tolerancePct: tolPct,
        evidence: {
          valueVerified: evState?.user_verified === true || evState?.enabled === true,
          sourceVerified: evState?.source_verified === true,
          evidenceRequired,
          evidenceLabel,
        },
      };
    });

  // Action
  const action: ActionViewModel = {
    label: primaryButtonLabel,
    disabled: primaryButtonDisabled,
    disabledReason: primaryButtonDisabled
      ? (isExecuting
          ? "Server execution in progress."
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

  // Warnings
  const warnings: CalculatorViewModel["warnings"] = [];
  for (const issue of state.validationState.client_precheck_errors) {
    warnings.push({
      severity: issue.severity,
      title: issue.message,
      detail: issue.suggested_action ?? "Resolve before execution.",
    });
  }
  if (response?.warnings) {
    for (const w of response.warnings) {
      warnings.push({ severity: w.severity, title: w.message, detail: w.suggested_action ?? "" });
    }
  }

  return { title: toolName, purpose: displayScope, badges, fields, action, secondaryActions, resultState, warnings };
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

  // ── Hooks (unconditional) ──
  const machine = useUniversalIndustrialDecisionFormMachine({
    schema: machineSchema,
    schemaHash: props.schemaHash,
    executeEndpoint: props.executeEndpoint,
    initialProfileMode: props.initialProfileMode ?? "engineering",
  });

  const { state } = machine;
  const response = state.serverResponseState.response;
  const activeMode = state.profileModeState.mode;
  const premiumHook = state.premiumHookState.hook;

  const status = response?.status ?? executionStateToStatus(state.executionState);

  // Access tier
  const accessTier = props.accessTier ?? "FREE";
  const isPro = accessTier === "PRO";
  const hasSession = isPro && !!props.usageSessionId;
  const runsRemaining = props.remainingRuns ?? 0;
  const sessionExhausted = isPro && hasSession && runsRemaining <= 0;
  const creditSessionLoading = props.creditSessionLoading ?? false;
  const isExecuting = state.executionState === "executing";
  const hasResult = hasServerResponse(response);

  const clientBlockerCount = state.blockerState.blockers.filter(
    (b) => b.severity === "BLOCKER" || b.severity === "CRITICAL",
  ).length;
  const clientWarningCount = state.validationState.client_precheck_errors.filter(
    (b) => b.severity !== "BLOCKER" && b.severity !== "CRITICAL",
  ).length;

  const primaryButtonDisabled =
    isExecuting ||
    creditSessionLoading ||
    (isPro && !hasSession) ||
    (isPro && sessionExhausted);

  const primaryButtonLabel = getPrimaryCtaLabel(
    accessTier,
    isExecuting,
    hasSession,
    hasResult,
    creditSessionLoading,
  );

  const primaryButtonAction = () => {
    if (isPro && (!hasSession || sessionExhausted)) {
      if (props.onRequestCreditSession && props.toolKey) {
        props.onRequestCreditSession(props.toolKey);
      }
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
  const operationLabel =
    props.renderContract?.operationLabel ??
    String(schemaRecord.primary_operation ?? "Calculate");

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

  // ── ViewModel ──
  const vm = useMemo(
    () => buildCalculatorViewModel(
      props.schema, state, machine, props, activeMode, response,
      accessTier, hasSession, runsRemaining, isExecuting, hasResult,
      primaryButtonDisabled, primaryButtonLabel, primaryButtonAction,
      clientBlockerCount, clientWarningCount, toolName, displayScope,
      displayCategory, displayOperation,
      identityCheck as { ok: boolean; reason?: string } | null,
    ),
    [
      props.schema, state, machine, props, activeMode, response,
      accessTier, hasSession, runsRemaining, isExecuting, hasResult,
      primaryButtonDisabled, primaryButtonLabel, primaryButtonAction,
      clientBlockerCount, clientWarningCount, toolName, displayScope,
      displayCategory, displayOperation, identityCheck,
    ],
  );

  // ── State for collapsed advanced section ──
  const [advancedOpen, setAdvancedOpen] = useState(false);

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

      {/* ── Mode selector (subtle row) ── */}
      <div className="sc-v531-mode-tabs" role="tablist" aria-label="Profile mode">
        {PROFILE_MODE_OPTIONS.map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={activeMode === mode.id}
            className={`sc-v531-mode-tab${activeMode === mode.id ? " sc-v531-mode-tab--active" : ""}`}
            onClick={() => machine.setProfileMode(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* ── 2. Main workspace: inputs + action panel ── */}
      <div className="sc-v531-layout">
        <main className="sc-v531-main-panel">
          {/* Warnings */}
          {vm.warnings.length > 0 && (
            <div className="sc-v531-warning-stack">
              {vm.warnings.map((w, i) => (
                <WarningCard key={i} severity={w.severity} title={w.title} detail={w.detail} />
              ))}
            </div>
          )}

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
                {vm.resultState.primaryOutput && (
                  <div className="sc-v531-result-primary">
                    <span className="sc-v531-result-label">{vm.resultState.primaryOutput.name}</span>
                    <span className="sc-v531-result-value">
                      {vm.resultState.primaryOutput.value}
                      {vm.resultState.primaryOutput.unit ? ` ${vm.resultState.primaryOutput.unit}` : ""}
                    </span>
                    <p className="sc-v531-result-explanation">{vm.resultState.primaryOutput.explanation}</p>
                  </div>
                )}
                {vm.resultState.decision && (
                  <div className="sc-v531-result-decision">
                    <span className="sc-v531-decision-label">Decision</span>
                    <span className="sc-v531-decision-value">{vm.resultState.decision}</span>
                    {vm.resultState.reason && <p className="sc-v531-decision-reason">{vm.resultState.reason}</p>}
                  </div>
                )}
                {vm.resultState.nextAction && (
                  <div className="sc-v531-result-next">
                    <span className="sc-v531-next-label">Next action</span>
                    <p className="sc-v531-next-text">{vm.resultState.nextAction}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="sc-v531-placeholder">
                <p className="sc-v531-placeholder-title">No result yet</p>
                <p className="sc-v531-placeholder-text">
                  Enter inputs and run the server calculation. Results, decision guidance, risk
                  analysis, and audit status will appear here.
                </p>
              </div>
            )}
          </section>

          {/* Premium hook */}
          {premiumHook && (
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

            <div className="sc-v531-side-metrics">
              <div className="sc-v531-side-metric">
                <span className="sc-v531-side-metric-label">Blockers</span>
                <span className="sc-v531-side-metric-value">{clientBlockerCount}</span>
              </div>
              <div className="sc-v531-side-metric">
                <span className="sc-v531-side-metric-label">Warnings</span>
                <span className="sc-v531-side-metric-value">{clientWarningCount + (response?.warnings ?? []).length}</span>
              </div>
              <div className="sc-v531-side-metric">
                <span className="sc-v531-side-metric-label">State</span>
                <span className="sc-v531-side-metric-value">{vm.resultState.executionLabel}</span>
              </div>
            </div>

            <button type="button" className="sc-v531-side-secondary" onClick={machine.runClientPrecheck}>
              Check inputs
            </button>
            <button type="button" className="sc-v531-side-secondary" onClick={machine.resetInputs}>
              Reset inputs
            </button>

            {vm.resultState.hasResult && (
              <button type="button" className="sc-v531-side-ghost" onClick={machine.resetResultOnly}>
                Clear result
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ── 3. Advanced details (collapsed) ── */}
      <details
        className="sc-v531-advanced"
        open={advancedOpen}
        onToggle={(e) => setAdvancedOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="sc-v531-advanced-summary">
          <span>Advanced details</span>
          <span className="sc-v531-advanced-meta">
            Hidden risk · Business impact · FMEA · Methodology · Audit · Export
          </span>
        </summary>
        {advancedOpen && (
          <div className="sc-v531-advanced-body">
            {hasResult && shouldShowHiddenRiskPanel(response) && (
              <HiddenRiskPanel response={response} />
            )}
            {hasResult && shouldShowBusinessImpactPanel(response) && (
              <BusinessImpactPanel response={response} />
            )}
            {hasResult && shouldShowFmeaPanel(response) && (
              <FmeaPanel response={response} />
            )}
            <ProtectedMethodologyPanel schema={props.schema} response={response} />
            {hasResult && shouldShowAuditSealPanel(response) && (
              <AuditSealPanel response={response} redactionStatus={response!.redaction_status} />
            )}
            {hasResult && shouldShowExportPanel(response) && (
              <ExportPanel
                pdfAvailable={state.exportState.pdf_available}
                jsonAuditAvailable={state.exportState.json_audit_available}
                copySummaryAvailable={state.exportState.copy_summary_available}
                redactionStatus={response!.redaction_status}
              />
            )}
          </div>
        )}
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

// ── Profile mode tabs ─────────────────────────────────────────────────────────

const PROFILE_MODE_OPTIONS: Array<{ id: ProfileMode; label: string }> = [
  { id: "quick", label: "Quick" },
  { id: "engineering", label: "Engineering" },
  { id: "cost", label: "Cost" },
  { id: "audit", label: "Audit" },
];

// ── Input field with full reference/evidence structure ──────────────────────────

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
      {/* Header: label + symbol + tolerance */}
      <div className="sc-v531-field-header">
        <label htmlFor={inputId} className="sc-v531-field-title">{field.label}</label>
        {field.symbol && <span className="sc-v531-field-symbol">({field.symbol})</span>}
        {field.criticality === "CRITICAL" && (
          <span className="sc-v531-field-critical" title="Critical input">!</span>
        )}
        {field.tolerancePct && (
          <span className="sc-v531-field-tolerance" title="Expected tolerance range">{field.tolerancePct}</span>
        )}
      </div>

      {/* Help text */}
      {field.helpText && <p className="sc-v531-field-help">{field.helpText}</p>}

      {/* Input + unit row */}
      <div className="sc-v531-input-row">
        {renderValueInput(inputId, field, onValueChange)}
        {field.unitSelectable && field.allowedUnits.length > 0 && (
          <select
            className="sc-v531-unit-select"
            value={field.selectedUnit}
            aria-label={`${field.label} unit`}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onUnitChange(e.target.value)}
          >
            {field.allowedUnits.map((unit) => (
              <option key={unit} value={unit}>{formatDisplayUnit(unit)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Reference source label */}
      {field.referenceSource && (
        <p className="sc-v531-field-reference">{field.referenceSource}</p>
      )}

      {/* Base preview */}
      {field.basePreview && (
        <div className="sc-v531-field-preview">
          <span className="sc-v531-field-preview-label">Base</span>
          <span>{field.basePreview}</span>
        </div>
      )}

      {/* Evidence row (compact) */}
      <div className="sc-v531-field-evidence" aria-label={`${field.label} evidence`}>
        <span className="sc-v531-evidence-title">{field.evidence.evidenceLabel}</span>
        <div className="sc-v531-evidence-options">
          <label>
            <input
              type="checkbox"
              checked={field.evidence.valueVerified}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onEvidenceChange(e.target.checked, field.evidence.sourceVerified)
              }
            />
            <span>Verified</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={field.evidence.sourceVerified}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onEvidenceChange(field.evidence.valueVerified, e.target.checked)
              }
            />
            <span>Source verified</span>
          </label>
        </div>
      </div>

      {/* Validation blockers */}
      {hasBlocker && (
        <ul className="sc-v531-field-issues">
          {field.blockers.map((issue) => (
            <li key={issue.id} data-severity={issue.severity.toLowerCase()}>
              {issue.message}
            </li>
          ))}
        </ul>
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

  return (
    <input
      id={inputId}
      className="sc-v531-input"
      inputMode={field.type === "number" || field.type === "integer" ? "decimal" : "text"}
      type={field.type === "number" || field.type === "integer" ? "number" : "text"}
      step={field.type === "integer" ? "1" : "0.000001"}
      value={field.type === "number" || field.type === "integer" ? (typeof field.value === "number" ? String(field.value) : "") : (typeof field.value === "string" ? field.value : "")}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (field.type === "number" || field.type === "integer") {
          if (e.target.value === "") { onValueChange(null); return; }
          const next = Number(e.target.value);
          onValueChange(Number.isFinite(next) ? next : null);
        } else {
          onValueChange(e.target.value);
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

// ── Post-execution panels (in advanced details) ────────────────────────────────

function HiddenRiskPanel({ response }: { response: ExecuteResponse | null }) {
  const risks = response?.decision_interpretation?.hidden_risk_explanations ?? [];
  if (risks.length === 0) return null;
  return (
    <section className="sc-v531-advanced-section" aria-label="Risk explanations">
      <h3 className="sc-v531-advanced-title">Hidden risk explanations</h3>
      <div className="sc-v531-warning-stack">
        {risks.map((risk) => (
          <WarningCard key={risk.id} severity={risk.severity} title={risk.message} detail={risk.suggested_action} />
        ))}
      </div>
    </section>
  );
}

function BusinessImpactPanel({ response }: { response: ExecuteResponse | null }) {
  if (!response) return null;
  const impact = response.decision_interpretation?.money_impact_summary;
  return (
    <section className="sc-v531-advanced-section" aria-label="Business impact">
      <h3 className="sc-v531-advanced-title">Business impact</h3>
      <dl className="sc-v531-advanced-grid">
        {impact?.money_at_risk_formatted ? <ContextItem label="Money at risk" value={impact.money_at_risk_formatted} /> : null}
        {impact?.main_cost_driver ? <ContextItem label="Main cost driver" value={impact.main_cost_driver} /> : null}
        {impact?.quote_or_decision_impact ? <ContextItem label="Decision impact" value={impact.quote_or_decision_impact} /> : null}
      </dl>
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

function FmeaPanel({ response }: { response: ExecuteResponse | null }) {
  const fmea = response?.fmea_summary;
  if (!fmea?.triggered) return null;
  return (
    <section className="sc-v531-advanced-section" aria-label="FMEA analysis">
      <h3 className="sc-v531-advanced-title">FMEA analysis</h3>
      <div className="sc-v531-fmea-grid">
        <div className="sc-v531-fmea-metric"><span>Highest RPN</span><strong>{fmea.highest_rpn}</strong></div>
        <div className="sc-v531-fmea-metric"><span>Total RPN</span><strong>{fmea.total_rpn}</strong></div>
        <div className="sc-v531-fmea-metric"><span>Threshold</span><strong>{fmea.threshold_exceeded ? "Exceeded" : "OK"}</strong></div>
      </div>
      {fmea.items.map((item, i) => (
        <div key={i} className="sc-v531-fmea-item">
          <strong>{item.failure_mode}</strong>
          <p>{item.effect}</p>
          <span>RPN {item.rpn}</span>
        </div>
      ))}
    </section>
  );
}

function ProtectedMethodologyPanel({ schema, response }: { schema: SuperV4Schema; response: ExecuteResponse | null }) {
  const proofSections = response?.proof_pack_public?.sections ?? [];
  return (
    <section className="sc-v531-advanced-section" aria-label="Methodology">
      <h3 className="sc-v531-advanced-title">Protected methodology</h3>
      <p className="sc-v531-methodology-text">
        This public form shows method context and audit status without exposing exact formulas or private execution logic.
      </p>
      {proofSections.length > 0 && (
        <div className="sc-v531-methodology-stack">
          {proofSections.map((section) => (
            <div key={section.id} className="sc-v531-methodology-item">
              <strong>{section.title}</strong>
              <p>{section.public_content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AuditSealPanel({ response, redactionStatus }: { response: ExecuteResponse | null; redactionStatus: RedactionStatus | null }) {
  const seal = response?.audit_seal;
  if (!seal) return null;
  return (
    <section className="sc-v531-advanced-section" aria-label="Audit seal">
      <h3 className="sc-v531-advanced-title">Audit seal</h3>
      <dl className="sc-v531-advanced-grid">
        <ContextItem label="Status" value={seal.seal_status} />
        <ContextItem label="Schema" value={seal.schema_version} />
        <ContextItem label="Formula" value={seal.formula_version} />
        <ContextItem label="Runtime" value={seal.runtime_version} />
        <ContextItem label="Redaction" value={safeRedactionDisplay(redactionStatus)} />
        <ContextItem label="Algorithm" value={seal.hash_algorithm} />
      </dl>
    </section>
  );
}

function ExportPanel(props: { pdfAvailable: boolean; jsonAuditAvailable: boolean; copySummaryAvailable: boolean; redactionStatus: RedactionStatus | null }) {
  return (
    <section className="sc-v531-advanced-section" aria-label="Export">
      <h3 className="sc-v531-advanced-title">Export</h3>
      <div className="sc-v531-export-row">
        <button type="button" className="sc-v531-secondary-button" disabled={!props.pdfAvailable}>PDF</button>
        <button type="button" className="sc-v531-secondary-button" disabled={!props.jsonAuditAvailable}>JSON audit</button>
        <button type="button" className="sc-v531-secondary-button" disabled={!props.copySummaryAvailable}>Copy summary</button>
      </div>
      <p className="sc-v531-export-redaction">Redaction: {safeRedactionDisplay(props.redactionStatus)}</p>
    </section>
  );
}

// ── Shared small components ─────────────────────────────────────────────────────

function ContextItem({ label, value }: { label: string; value: string }) {
  if (!value || !value.trim()) return null;
  return (
    <div className="sc-v531-context-item">
      <span className="sc-v531-context-label">{label}</span>
      <span className="sc-v531-context-value">{value}</span>
    </div>
  );
}

function WarningCard({ severity, title, detail }: { severity: string; title: string; detail: string }) {
  return (
    <div className="sc-v531-warning-card" data-severity={severity.toLowerCase()}>
      <span className="sc-v531-warning-severity">{severity}</span>
      <strong className="sc-v531-warning-title">{title}</strong>
      {detail && <p className="sc-v531-warning-detail">{detail}</p>}
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
