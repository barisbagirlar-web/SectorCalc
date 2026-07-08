// SectorCalc SuperV4 Universal Industrial Decision Form — Contract Types V5.3.1
// All UI text, identifiers, and schema-facing strings are pure technical English.

export type ProfileMode = "quick" | "engineering" | "cost" | "audit" | "diagnostic";

export type CalcStatus = "OK" | "REVIEW" | "BLOCKED" | "REPRICE" | "REJECT" | "HOLD";

export type Severity = "INFO" | "REVIEW" | "WARNING" | "CRITICAL" | "BLOCKER" | "BLOCKED";

export type SourceStatus =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "CONTEXT_ONLY"
  | "USER_VERIFIED"
  | "NEEDS_SOURCE_VERIFICATION"
  | "NEEDS_CLAUSE_VERIFICATION"
  | "UNVERIFIED"
  | "NOT_APPLICABLE";

export type ReferenceValueStatus =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "CONTEXT_ONLY"
  | "USER_VERIFIED"
  | "NEEDS_SOURCE_VERIFICATION"
  | "NOT_APPLICABLE";

export type RedactionStatus =
  | "PUBLIC_SAFE_REDACTED"
  | "INTERNAL_TRACE_RESTRICTED"
  | "REDACTION_NOT_REQUIRED"
  | "REDACTION_FAILED_BLOCKED";

export type UnitFamily =
  | "LENGTH"
  | "AREA"
  | "VOLUME"
  | "MASS"
  | "FORCE"
  | "PRESSURE"
  | "STRESS"
  | "TEMPERATURE_ABSOLUTE"
  | "TEMPERATURE_INTERVAL"
  | "ENERGY"
  | "POWER"
  | "TIME"
  | "RATE"
  | "DENSITY"
  | "ANGLE"
  | "DIMENSIONLESS"
  | "CURRENCY"
  | "CUSTOM";

export type ExecutionState =
  | "idle"
  | "schema_loading"
  | "schema_ready"
  | "schema_rejected"
  | "input_draft"
  | "unit_dirty"
  | "normalized_preview_ready"
  | "reference_range_warning"
  | "evidence_gap"
  | "client_precheck_blocked"
  | "ready_to_execute"
  | "executing"
  | "server_ok"
  | "server_review"
  | "server_blocked"
  | "server_reprice"
  | "server_reject"
  | "server_hold"
  | "public_response_redacted"
  | "export_ready"
  | "audit_sealed"
  | "error";

export type StateDomainId =
  | "schemaState"
  | "profileModeState"
  | "rawInputState"
  | "selectedUnitState"
  | "normalizedPreviewState"
  | "evidenceState"
  | "touchedState"
  | "validationState"
  | "referenceRangeState"
  | "blockerState"
  | "advancedDisclosureState"
  | "scenarioState"
  | "executionState"
  | "serverResponseState"
  | "auditSealState"
  | "exportState";

export type StateTransitionId =
  | "INIT_SCHEMA"
  | "VALIDATE_SCHEMA_CONTRACT"
  | "SET_PROFILE_MODE"
  | "SET_INPUT_VALUE"
  | "SET_SELECTED_UNIT"
  | "PRESERVE_PHYSICAL_QUANTITY_ON_UNIT_CHANGE"
  | "UPDATE_NORMALIZED_PREVIEW"
  | "UPDATE_EVIDENCE_STATUS"
  | "RUN_CLIENT_PRECHECK"
  | "BLOCK_CLIENT_EXECUTION"
  | "SUBMIT_SERVER_EXECUTION"
  | "RECEIVE_SERVER_RESPONSE"
  | "RECEIVE_SERVER_BLOCKERS"
  | "RECEIVE_SERVER_ERROR"
  | "RESET_INPUTS"
  | "RESET_RESULT_ONLY";

export interface ConversionEntry {
  unit: string;
  factor: number;
  offset?: number;
  label?: string;
}

export interface ConversionRegistryItem {
  base_unit: string;
  unit_family?: UnitFamily;
  units: ConversionEntry[];
}

export type ConversionRegistry = Record<string, ConversionRegistryItem>;

export interface UnitConversionContract {
  internal_base_system?: string;
  currency_policy?: string;
  temperature_policy?: string;
  conversion_registry: ConversionRegistry;
  unsupported_conversion_behavior?: "BLOCK_CALCULATION" | string;
  unit_change_behavior?: "PRESERVE_PHYSICAL_QUANTITY" | string;
  formula_input_rule?: "FORMULAS_USE_NORMALIZED_BASE_UNITS_ONLY" | string;
}

export interface PhysicalHardBounds {
  min: number | null;
  max: number | null;
  unit: string;
  basis: string;
  violation_behavior: "BLOCK" | "REVIEW" | "WARNING";
  semantic_error_message_min?: string;
  semantic_error_message_max?: string;
  semantic_error_message?: string;
}

export interface EngineeringReferenceRange {
  min: number | null;
  max: number | null;
  unit: string;
  source: string;
  status: ReferenceValueStatus;
  warning_behavior?: "BELOW" | "ABOVE" | "OUTSIDE" | "NOT_APPLICABLE";
  not_applicable_reason?: string;
}

export interface ReferenceValuesObject {
  reference_value_type:
    | "MEASURED_VALUE"
    | "CERTIFIED_DOCUMENT"
    | "MANUFACTURER_DATASHEET"
    | "OFFICIAL_STANDARD_OR_CODE"
    | "ERP"
    | "LABORATORY_TEST"
    | "USER_VERIFIED"
    | "CONTEXT_ONLY"
    | "NOT_UNIVERSAL";
  source: string;
  reference_status: ReferenceValueStatus;
  user_must_verify: boolean;
  public_note: string;
}

export interface LegacyReferenceValue {
  type: string;
  value: number | string | null;
  unit?: string | null;
  low?: number | null;
  high?: number | null;
  source: string;
  status: ReferenceValueStatus;
  public_note: string;
}

export interface EvidenceRequirement {
  required: boolean;
  accepted_evidence: string[];
  missing_evidence_behavior: "BLOCK" | "REVIEW" | "WARN";
  public_help_text: string;
}

export interface InputPrecisionPolicy {
  input_decimals: number | null;
  display_decimals: number | null;
  calculation_precision: "FULL_DOUBLE_PRECISION_NO_PRE_ROUNDING" | "FULL_DOUBLE" | "DECIMAL_FIXED";
  rounding_rule?: "DISPLAY_ONLY" | string;
}

export interface InputUiBinding {
  group_id: string;
  field_order: number;
  component: "number_with_unit" | "select" | "boolean" | "text" | "evidence_toggle" | "number" | "toggle";
  unit_dropdown_required: boolean;
  reference_values_visible: boolean;
  advanced: boolean;
  visible_in_modes: ProfileMode[];
  required_for_calculation: boolean;
  required_for_clause_evidence: boolean;
}

export interface SuperV4Input {
  id: string;
  name: string;
  symbol: string;
  quantity_kind: string;
  unit_selectable: boolean;
  base_unit: string | null;
  allowed_display_units: string[];
  normalized_id: string | null;
  type: "number" | "integer" | "select" | "boolean" | "string" | "text";
  required: boolean;
  criticality: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  allowed_values?: string[];
  confidence_label?: SourceStatus;
  source_status?: SourceStatus;
  physical_hard_bounds?: PhysicalHardBounds;
  engineering_range?: EngineeringReferenceRange;
  engineering_reference_range?: EngineeringReferenceRange;
  resolution?: number | null;
  precision_policy?: InputPrecisionPolicy;
  precision?: {
    input_decimals: number;
    display_decimals: number;
    calculation_precision: "FULL_DOUBLE" | "DECIMAL_FIXED";
  };
  default_policy:
    | "NO_DEFAULT"
    | "USER_SELECTABLE_SMART_DEFAULT"
    | "LAST_USED_VALUE_OPTIONAL"
    | "NON_CRITICAL_SAFE_DEFAULT"
    | "USER_SELECTABLE_CONTEXT_DEFAULT"
    | "DERIVED_NON_DECISION_DEFAULT";
  default_value?: number | string | boolean | null;
  default?: number | string | boolean | null;
  smart_defaults?: Array<Record<string, unknown>>;
  reference_values: ReferenceValuesObject | LegacyReferenceValue[];
  source_priority?: string[];
  source?: string;
  evidence_requirement: EvidenceRequirement | string;
  standard_clause_bindings?: string[];
  formula_bindings: string[];
  output_bindings: string[];
  warning_bindings?: string[];
  ui_binding?: Partial<InputUiBinding>;
  user_help_text?: string;
  help_text?: string;
  warning_if_missing_or_estimated?: string;
  semantic_error_messages?: Record<string, string>;
  uncertainty_statement?: string;
}

export interface NormalizedInputSpec {
  id: string;
  from_input: string;
  quantity_kind: string;
  base_unit: string;
  conversion_source?: string;
  validation_after_conversion?: string[];
  audit_required?: boolean;
}

export interface FormulaSpecPublic {
  id: string;
  name?: string;
  visibility?: {
    public_ui: false;
    public_export: false;
    internal_admin_trace: boolean;
    internal_checker_trace?: boolean;
  };
  expression?: "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI" | string;
  uses: string[];
  output: string;
  unit?: string;
  proof_role: string;
  standard_clause_bindings?: string[];
  input_bindings?: string[];
  normalized_input_bindings?: string[];
  output_bindings?: string[];
  assumptions?: string[];
  limitations?: string[];
  edge_cases?: string[];
  public_proof_summary?: string;
  protected_methodology_summary?: string;
  checker_note?: string;
  acceptance_logic?: string;
  rejection_logic?: string;
  review_required_logic?: string;
  uncertainty_expression?: string;
  formula_leak_risk?: "LOW" | "MEDIUM" | "HIGH";
  public_formula_expression_policy?: "FORBIDDEN";
}

export interface ServerOutput {
  id: string;
  name: string;
  value: number | string | boolean | null;
  unit?: string | null;
  status?: CalcStatus;
  formula_source?: string | null;
  public_explanation: string;
  operator_explanation?: string;
  engineer_explanation?: string;
  owner_cfo_explanation?: string;
  checker_explanation?: string;
  decision_use: string;
  evidence_level?: "FULL" | "PARTIAL" | "SCREENING_ONLY" | "USER_VERIFIED_REQUIRED" | "NEEDS_SOURCE_VERIFICATION";
}

export interface ServerWarning {
  id: string;
  severity: Severity;
  affected_input_id?: string | null;
  affected_output_id?: string | null;
  affected_clause_id?: string | null;
  message: string;
  why_it_matters: string;
  suggested_action: string;
}

export interface NormalizedInputAudit {
  input_id: string;
  normalized_id: string;
  display_value: number | string | boolean | null;
  display_unit?: string | null;
  base_value: number | string | boolean | null;
  base_unit?: string | null;
  source_status: SourceStatus;
}

export interface ReferenceRangeAudit {
  input_id: string;
  value: number;
  unit: string;
  range_min: number | null;
  range_max: number | null;
  range_unit: string;
  status: "BELOW" | "INSIDE" | "ABOVE" | "NOT_APPLICABLE";
  source: string;
  warning_message: string;
}

export interface SensitivityItem {
  id: string;
  driver: string;
  effect: string;
  severity: Severity;
}

export interface ScenarioComparison {
  baseline_label: string;
  scenarios: Array<{
    id: string;
    label: string;
    result_summary: string;
    decision: CalcStatus;
  }>;
}

export interface FmeaItem {
  failure_mode: string;
  effect: string;
  cause?: string;
  current_control?: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
  mitigation_action?: string;
  review_owner?: string;
  calculation_status?: CalcStatus;
  control_measure?: string;
}

export interface FmeaSummary {
  triggered: boolean;
  items: FmeaItem[];
  total_rpn: number;
  highest_rpn: number;
  threshold_exceeded: boolean;
}

export interface PublicProofPack {
  enabled: boolean;
  redaction_status: RedactionStatus;
  sections: Array<{ id: string; title: string; public_content: string }>;
}

export interface DecisionInterpretation {
  primary_decision: CalcStatus;
  primary_reason: string;
  user_profile_summary: {
    operator: string;
    engineer: string;
    owner_cfo: string;
    checker_auditor: string;
  };
  hidden_risk_explanations: Array<{
    id: string;
    severity: Severity;
    affected_input_id?: string | null;
    affected_output_id?: string | null;
    affected_clause_id?: string | null;
    message: string;
    why_it_matters: string;
    suggested_action: string;
  }>;
  money_impact_summary: {
    enabled: boolean;
    currency: string | null;
    money_at_risk_formatted: string | null;
    main_cost_driver: string | null;
    quote_or_decision_impact: string;
  };
  what_can_flip_the_decision: string[];
  next_best_actions: string[];
  premium_unlock_reason: string;
}

export interface AuditSeal {
  seal_status: "SEALED" | "UNSEALED" | "FAILED";
  hash_algorithm: "SHA-256" | "SHA-512";
  tool_id?: string;
  tool_key?: string;
  schema_hash: string;
  formula_version: string;
  schema_version: string;
  runtime_version: string;
  input_hash: string;
  normalized_input_hash?: string;
  output_hash: string;
  proof_pack_hash?: string;
  executed_at: string;
  redaction_status: RedactionStatus;
  signature_status: "SERVER_SIGNATURE_OPTIONAL" | "UNSIGNED" | "SIGNED" | "FAILED";
  tamper_warning?: string;
}

export interface ExecuteRequest {
  tool_id: string;
  tool_key: string;
  schema_version: string;
  raw_inputs: Record<string, unknown>;
  selected_units: Record<string, string>;
  output_units?: Record<string, string>;
  display_currency?: string | null;
  scenario_request?: unknown | null;
  user_profile_mode: ProfileMode;
  evidence_state?: Record<string, unknown>;
  client_schema_hash?: string;
}

export interface ExecuteResponse {
  status: CalcStatus;
  pipeline_state: string;
  outputs: ServerOutput[];
  warnings: ServerWarning[];
  normalized_input_audit: NormalizedInputAudit[];
  reference_range_warnings?: ReferenceRangeAudit[];
  reference_range_audit?: ReferenceRangeAudit[];
  evidence_status?: Record<string, unknown>;
  sensitivity: SensitivityItem[];
  scenario_compare: ScenarioComparison | null;
  fmea_summary?: FmeaSummary | null;
  proof_pack_public: PublicProofPack;
  decision_interpretation: DecisionInterpretation;
  audit_seal: AuditSeal;
  redaction_status: RedactionStatus;
  premium_hook?: import("@/sectorcalc/monetization/monetization-types").PremiumHookPublic | null;
  /** V5.4 Universal Result Perspectives — enriched multi-card result display. */
  universal_result?: UniversalCalculationResult;
}

export interface UIInputGroup {
  id: string;
  title: string;
  description: string;
  mode_visibility?: ProfileMode[];
  visible_in_modes?: ProfileMode[];
  fields: string[];
  advanced?: boolean;
}

export interface FormRuntimeBinding {
  renderer: "UniversalIndustrialDecisionForm";
  schema_generation_runtime: string;
  llm_runtime_usage: "FORBIDDEN";
  client_formula_execution: "FORBIDDEN";
  server_execution_required: true;
  state_management_required: true;
  dynamic_ui_contract_required: true;
  json_schema_form_substrate_allowed: boolean;
  generic_json_schema_form_alone_sufficient: false;
  state_domains: StateDomainId[];
  state_transitions: StateTransitionId[];
  execute_request_contract: Record<string, string>;
  execute_response_contract: Record<string, string>;
}

export interface UiContract {
  target_renderer: "UniversalIndustrialDecisionForm";
  profile_modes: ProfileMode[];
  input_groups: UIInputGroup[];
  sticky_decision_cockpit: boolean;
  mobile_bottom_action_bar: boolean;
  normalized_preview_required: boolean;
  reference_values_visible: boolean;
  evidence_controls_required: boolean;
  semantic_error_summary_required: boolean;
  safety_factor_gauges_required: boolean;
  hidden_risk_panel_required: boolean;
  business_impact_panel_required: boolean;
  standards_clause_panel_required: boolean;
  protected_methodology_panel_required: boolean;
  audit_seal_panel_required: boolean;
  accessibility: Record<string, unknown>;
}

export interface SuperV4Schema {
  tool_id: string;
  tool_key: string;
  tool_name: string;
  category: string;
  scope: string;
  primary_operation: string;
  decision_context: Record<string, unknown>;
  irreversible_commitment_metric: string | Record<string, unknown>;
  standards: unknown[];
  standards_clause_map: unknown[];
  reference_status: SourceStatus;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  brand_safety_policy: Record<string, unknown>;
  calculation_basis: Record<string, unknown>;
  unit_system: Record<string, unknown>;
  unit_conversion_contract: UnitConversionContract;
  inputs: SuperV4Input[];
  normalized_inputs: NormalizedInputSpec[];
  reference_value_policy: Record<string, unknown>;
  form_runtime_binding: FormRuntimeBinding;
  physical_bounds_policy: Record<string, unknown>;
  validation_contract: Record<string, unknown>;
  derating_contract: Record<string, unknown>;
  precision_policy: Record<string, unknown>;
  formulas: FormulaSpecPublic[];
  outputs: ServerOutput[];
  output_formatting: Record<string, unknown>;
  decision_interpretation_contract: Record<string, unknown>;
  business_impact_contract: Record<string, unknown>;
  engine_rules: Record<string, unknown>;
  uncertainty_model: Record<string, unknown>;
  safety_factor_gauges: unknown[];
  proof_pack: Record<string, unknown>;
  audit_trail_contract: Record<string, unknown>;
  export_contract: Record<string, unknown>;
  ui_contract: UiContract;
  reference_code: Record<string, unknown>;
  test_plan: Record<string, unknown>;
  red_team_review: Record<string, unknown>;
  metadata: {
    schema_version: string;
    formula_version: string;
    prompt_version?: "5.3.1" | string;
    [key: string]: unknown;
  };
}

export const V531_REQUIRED_STATE_DOMAINS: StateDomainId[] = [
  "schemaState",
  "profileModeState",
  "rawInputState",
  "selectedUnitState",
  "normalizedPreviewState",
  "evidenceState",
  "touchedState",
  "validationState",
  "referenceRangeState",
  "blockerState",
  "advancedDisclosureState",
  "scenarioState",
  "executionState",
  "serverResponseState",
  "auditSealState",
  "exportState",
];

export const V531_REQUIRED_STATE_TRANSITIONS: StateTransitionId[] = [
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

export const V531_APPROVED_TOP_LEVEL_KEYS = [
  "tool_id",
  "tool_key",
  "tool_name",
  "category",
  "scope",
  "primary_operation",
  "decision_context",
  "irreversible_commitment_metric",
  "standards",
  "standards_clause_map",
  "reference_status",
  "risk_level",
  "brand_safety_policy",
  "calculation_basis",
  "unit_system",
  "unit_conversion_contract",
  "inputs",
  "normalized_inputs",
  "reference_value_policy",
  "form_runtime_binding",
  "physical_bounds_policy",
  "validation_contract",
  "derating_contract",
  "precision_policy",
  "formulas",
  "outputs",
  "output_formatting",
  "decision_interpretation_contract",
  "business_impact_contract",
  "engine_rules",
  "uncertainty_model",
  "safety_factor_gauges",
  "proof_pack",
  "audit_trail_contract",
  "export_contract",
  "ui_contract",
  "reference_code",
  "test_plan",
  "red_team_review",
  "metadata",
] as const;

// ══════════════════════════════════════════════════════════════════════════════
// Universal Result Perspectives Layer — V5.4
// ══════════════════════════════════════════════════════════════════════════════

export type ResultPerspective =
  | "primary"
  | "cost_basis"
  | "commercial_price"
  | "technical_limit"
  | "risk_sensitivity"
  | "decision_state"
  | "audit_note";

export type ResultCardSeverity = "info" | "pass" | "warning" | "danger";

export interface UniversalResultCard {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  perspective: ResultPerspective;
  priority: number;
  formula?: string;
  explanation?: string;
  severity?: ResultCardSeverity;
}

export interface DecisionStateCard {
  label: string;
  severity: ResultCardSeverity;
  reason: string;
}

export interface UniversalCalculationResult {
  primary: UniversalResultCard;
  cards: UniversalResultCard[];
  decisionState: DecisionStateCard;
  assumptions: string[];
  warnings: string[];
}

export type ResultProfileId =
  | "cost_plus_margin"
  | "technical_limit_with_cost"
  | "pass_fail_with_safety_margin"
  | "savings_roi"
  | "cost_capacity_efficiency"
  | "commercial_decision"
  | "risk_quality_decision"
  | "compliance_audit_package";
