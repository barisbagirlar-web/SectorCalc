/**
 * Generate SuperV4Schema JSON files for 50 free V5.3.1 formulas.
 * Reads the formula registry, builds minimal valid schemas.
 * Output: src/sectorcalc/schemas/free-v531/ (prefix 295-344)
 *
 * PUBLIC UI QUALITY:
 * - Labels are auto-cleaned: trailing unit suffixes stripped, title casing corrected
 * - Category strings mapped to human-readable display vocabulary
 * - symbol set to null (no debug parentheses in public UI)
 * - allowed_display_units populated with base_unit (no empty dropdowns)
 * - Help text shortened to professional English
 *
 * Run: npx tsx scripts/generate-free-v531-schemas.ts
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { freeV531FormulaRegistry } from "../src/sectorcalc/formulas/free-v531";
import type { SuperV4Input } from "../src/sectorcalc/pro-form/contract-types";

const SCHEMAS_DIR = join(process.cwd(), "src/sectorcalc/schemas/free-v531");
const START_INDEX = 295;

// Ensure output dir exists
if (!existsSync(SCHEMAS_DIR)) {
  mkdirSync(SCHEMAS_DIR, { recursive: true });
}

const formulaEntries = Object.entries(freeV531FormulaRegistry);

// ─── PUBLIC UI DISPLAY VOCABULARY ────────────────────────────────────────

const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  machining_cnc: "Machining & CNC",
  welding_steel: "Welding & Steel",
  production_operations: "Production Operations",
  carbon_cbam: "Carbon & CBAM",
  quote_sme_finance: "Quote & SME Finance",
  inventory_logistics: "Inventory & Logistics",
  sector_hooks: "Industrial Decision Support",
};

// ─── LABEL CLEANUP ────────────────────────────────────────────────────────

/** Patterns to strip from end of a label (trailing unit/technical suffixes). */
const TRAILING_UNIT_PATTERNS = [
  /\s+M\s+Min$/i,
  /\s+Mm$/i,
  /\s+Kg$/i,
  /\s+Kwh$/i,
  /\s+Co2$/i,
  /\s+M\/Min$/i,
  /\s*\/\s*Min$/i,
  /\s*\/\s*Tooth$/i,
  /\s+Cm$/i,
  /\s+Km$/i,
  /\s+Lb$/i,
  /\s+Lbs$/i,
  /\s+Hz$/i,
  /\s+Kw$/i,
];

/** Known label expansions (short → long). */
const KNOWN_EXPANSIONS: Record<string, string> = {
  max: "Maximum",
  min: "Minimum",
  rpm: "RPM",
  cnc: "CNC",
  co2: "CO₂",
  cbam: "CBAM",
  oee: "OEE",
  eoq: "EOQ",
  gsm: "GSM",
  fmea: "FMEA",
  iso: "ISO",
  en: "EN",
  astm: "ASTM",
  aws: "AWS",
  aisi: "AISI",
  sae: "SAE",
};

/** Words that should remain lowercase in English titles (except first/last). */
const LOWERCASE_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "by", "with", "from", "per", "vs",
]);

/**
 * Clean a label from the formula registry into a human-readable English label.
 * Steps:
 * 1. Strip trailing unit suffixes
 * 2. Expand known abbreviations
 * 3. Apply proper English title casing
 */
function cleanLabel(raw: string): string {
  let label = raw.trim();

  // Strip trailing unit patterns
  for (const pattern of TRAILING_UNIT_PATTERNS) {
    label = label.replace(pattern, "");
  }

  // Strip leading/trailing whitespace again after stripping
  label = label.trim();

  // Expand known abbreviations (case-insensitive word replacement)
  const words = label.split(/\s+/);
  const expanded = words.map((w) => {
    const lower = w.toLowerCase();
    const expansion = KNOWN_EXPANSIONS[lower];
    if (expansion) return expansion;
    return w;
  });
  label = expanded.join(" ");

  // Label override map: fix labels where unit stripping produces bad English.
  // These are checked AFTER unit-pattern strip but BEFORE title casing.
  const LABEL_OVERRIDE_MAP: Record<string, string> = {
    "Rate Per": "Rate per Distance",
    "Consumable Cost Per": "Consumable Cost",
    "Material Cost Per": "Material Cost",
    "Rebar Cost Per": "Rebar Cost",
    "Fabric Cost Per": "Fabric Cost",
    "Batch Idle": "Batch Idle Energy",
    "Electricity": "Electricity Consumption",
    "Fuel Surcharge Percent": "Fuel Surcharge",
    "User Verified Grid Factor Kgco2E": "Grid Emission Factor",
  };
  const overrideKey = label.trim();
  if (LABEL_OVERRIDE_MAP[overrideKey]) {
    label = LABEL_OVERRIDE_MAP[overrideKey];
  }

  // Proper English title casing
  const titleWords = label.split(/\s+/);
  const cased = titleWords.map((w, i) => {
    const lower = w.toLowerCase();
    // First and last words always capitalize first letter
    if (i === 0 || i === titleWords.length - 1) {
      return w.charAt(0).toUpperCase() + lower.slice(1);
    }
    // Known expansion words or acronyms (all-uppercase) keep their form
    if (w === w.toUpperCase() && w.length > 1) return w;
    // Lowercase words stay lowercase
    if (LOWERCASE_WORDS.has(lower)) return lower;
    // Otherwise capitalize first letter
    return w.charAt(0).toUpperCase() + lower.slice(1);
  });

  return cased.join(" ");
}

// ─── HELP TEXT ────────────────────────────────────────────────────────────

const SHORT_HELP_TEXT =
  "Enter the verified shop-floor value. Reference ranges are advisory only.";

// ─── SCHEMA BUILDERS ─────────────────────────────────────────────────────

// Helper: map FreeV531RiskLevel to risk_level string
function mapRiskLevel(level: string): string {
  return level; // Already LOW | MEDIUM | HIGH | CRITICAL
}

// Helper: map FreeV531InputSpec to SuperV4Input
function buildSchemaInput(
  spec: { id: string; label: string; quantityKind: string; required: true; criticality: string; baseUnit: string; sourceStatus: string; defaultPolicy: string; publicHelpText: string },
): SuperV4Input {
  const sourceStatus = spec.sourceStatus === "USER_VERIFIED"
    ? "USER_VERIFIED"
    : spec.sourceStatus === "NEEDS_SOURCE_VERIFICATION"
      ? "NEEDS_SOURCE_VERIFICATION"
      : "CONTEXT_ONLY";

  const defaultPolicy = spec.defaultPolicy === "NO_DEFAULT_ALLOWED"
    ? "NO_DEFAULT"
    : spec.defaultPolicy === "USER_SELECTABLE_SMART_DEFAULT"
      ? "USER_SELECTABLE_SMART_DEFAULT"
      : spec.defaultPolicy === "NON_CRITICAL_SAFE_DEFAULT"
        ? "NON_CRITICAL_SAFE_DEFAULT"
        : "NO_DEFAULT";

  const cleanName = cleanLabel(spec.label);
  const baseUnit = spec.baseUnit === "user_unit" ? null : spec.baseUnit;
  // Only allow unit selection when a real base unit exists
  const hasRealUnit = baseUnit !== null && baseUnit !== "user_unit" && baseUnit !== "";
  const allowedUnits = hasRealUnit ? [baseUnit] : [];

  return {
    id: spec.id,
    name: cleanName,
    symbol: null, // Free tools: no debug parentheses in public UI
    quantity_kind: spec.quantityKind,
    unit_selectable: hasRealUnit,
    base_unit: baseUnit,
    allowed_display_units: allowedUnits,
    normalized_id: `n_${spec.id}`,
    type: "number",
    required: spec.required,
    criticality: spec.criticality as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    source_status: sourceStatus as any,
    confidence_label: sourceStatus as any,
    reference_values: {
      reference_value_type: "CONTEXT_ONLY",
      source: "User-entered value",
      reference_status: sourceStatus as any,
      user_must_verify: true,
      public_note: SHORT_HELP_TEXT,
    },
    evidence_requirement: {
      required: false,
      accepted_evidence: ["User-entered value", "Engineering estimate", "Measurement record", "Vendor or catalog data"],
      missing_evidence_behavior: "WARN",
      public_help_text: SHORT_HELP_TEXT,
    },
    formula_bindings: [],
    output_bindings: [],
    default_policy: defaultPolicy as any,
    user_help_text: SHORT_HELP_TEXT,
    help_text: SHORT_HELP_TEXT,
  };
}

// Helper: build normalized inputs from the input spec list
function buildNormalizedInputs(
  inputs: Array<{ id: string; quantityKind: string; baseUnit: string }>,
) {
  return inputs.map((spec) => ({
    id: `n_${spec.id}`,
    from_input: spec.id,
    quantity_kind: spec.quantityKind,
    base_unit: spec.baseUnit === "user_unit" ? "user_unit" : spec.baseUnit,
  }));
}

// Helper: build formula specs
function buildFormulas(inputs: Array<{ id: string; label: string }>, primaryMetricId: string) {
  const formulas: Array<Record<string, any>> = [];
  let idx = 1;

  for (const inp of inputs) {
    const cleanName = cleanLabel(inp.label);
    formulas.push({
      id: `F${idx}_NORM_${inp.id}`,
      name: `Normalize ${cleanName}`,
      visibility: {
        public_ui: false,
        public_export: false,
        internal_admin_trace: true,
      },
      expression: "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI",
      uses: [inp.id],
      output: `n_${inp.id}`,
      unit: "user_unit",
      proof_role: "unit normalization",
      assumptions: ["User provides correct unit"],
      limitations: ["Rounding errors possible"],
      edge_cases: [],
      public_proof_summary: `Normalizes ${cleanName} to calculation base unit.`,
      protected_methodology_summary: "Unit normalization is internal server logic.",
      checker_note: "Verify source unit before entry.",
      formula_leak_risk: "LOW",
      public_formula_expression_policy: "FORBIDDEN",
    });
    idx++;
  }

  // Primary calculation formula
  formulas.push({
    id: `F${idx}_CALC`,
    name: "Primary Calculation",
    visibility: {
      public_ui: false,
      public_export: false,
      internal_admin_trace: true,
    },
    expression: "INTERNAL_SERVER_ONLY_EXPRESSION_NOT_FOR_PUBLIC_UI",
    uses: inputs.map((i) => `n_${i.id}`),
    output: primaryMetricId,
    unit: "user_unit",
    proof_role: "primary decision metric calculation",
    assumptions: ["All inputs are within expected engineering ranges"],
    limitations: ["Screening-grade calculation only"],
    edge_cases: [],
    public_proof_summary: "Calculation performed server-side using deterministic formula.",
    protected_methodology_summary: "Formula is server-only and not exposed publicly.",
    checker_note: "Verify input values and units before reviewing results.",
    formula_leak_risk: "MEDIUM",
    public_formula_expression_policy: "FORBIDDEN",
  });

  return formulas;
}

// Helper: build outputs
function buildOutputs(primaryMetricId: string, toolName: string) {
  return [
    {
      id: primaryMetricId,
      name: "Result",
      value: null,
      unit: null,
      status: "REVIEW",
      formula_source: null,
      public_explanation: `Primary result for ${toolName}.`,
      operator_explanation: "Check result and compare to your threshold.",
      engineer_explanation: "Review inputs and assumptions before using this result for decisions.",
      owner_cfo_explanation: "This is a screening result. Verify before committing resources.",
      checker_explanation: "Verify all source inputs and unit selections before accepting this result.",
      decision_use: "Primary decision indicator",
      evidence_level: "SCREENING_ONLY",
    },
    {
      id: "primary_decision_state",
      name: "Decision State",
      value: null,
      unit: null,
      status: "REVIEW",
      formula_source: null,
      public_explanation: "Overall decision state for this calculation.",
      operator_explanation: "Follow the suggested action based on the decision state.",
      engineer_explanation: "The decision state reflects the calculated risk level.",
      owner_cfo_explanation: "Use the decision state to guide next actions.",
      checker_explanation: "Verify the decision state logic against your acceptance criteria.",
      decision_use: "Decision guidance",
      evidence_level: "SCREENING_ONLY",
    },
  ];
}

// Helper: build UI contract
function buildUiContract(inputIds: string[]) {
  return {
    target_renderer: "UniversalIndustrialDecisionForm",
    profile_modes: ["quick", "engineering", "cost", "audit"],
    input_groups: [
      {
        id: "primary_inputs",
        title: "Inputs",
        description: "Enter the required values for calculation.",
        fields: inputIds,
        mode_visibility: ["quick", "engineering", "cost", "audit"],
        visible_in_modes: ["quick", "engineering", "cost", "audit"],
      },
    ],
    sticky_decision_cockpit: true,
    mobile_bottom_action_bar: true,
    normalized_preview_required: true,
    reference_values_visible: true,
    evidence_controls_required: false,
    semantic_error_summary_required: true,
    safety_factor_gauges_required: false,
    hidden_risk_panel_required: true,
    business_impact_panel_required: false,
    standards_clause_panel_required: false,
    protected_methodology_panel_required: true,
    audit_seal_panel_required: true,
    accessibility: {
      high_contrast_supported: true,
      keyboard_navigation: true,
      screen_reader_labels: true,
      min_touch_target: "44px",
    },
  };
}

// Helper: generate file name
function sanitizeFileName(toolKey: string): string {
  return toolKey;
}

// ─── MAIN LOOP ────────────────────────────────────────────────────────────

let idx = 0;
const generated: string[] = [];

for (const [toolKey, formula] of formulaEntries) {
  const num = START_INDEX + idx;
  const toolId = formula.toolId;
  const toolName = formula.toolName;
  const rawCategory = formula.category || "Industrial Decision Support";
  const displayCategory = CATEGORY_DISPLAY_MAP[rawCategory] ?? rawCategory;
  const riskLevel = mapRiskLevel(formula.riskLevel);
  const inputs = formula.inputs;
  const primaryMetricId = formula.primaryMetricId;

  const inputIds = inputs.map((i: any) => i.id);
  const schemaInputs = inputs.map((spec: any) => buildSchemaInput(spec as any));
  const normalizedInputs = buildNormalizedInputs(inputs as any);

  // Category in schema: human-readable display name without internal suffix
  const categoryDisplay = `${displayCategory}`;

  const schema = {
    tool_id: toolId,
    tool_key: toolKey,
    tool_name: toolName,
    category: categoryDisplay,
    scope: `${toolName} as one SuperV4 single-operation decision-support schema for screening, review, audit evidence, and commercial risk interpretation.`,
    primary_operation: `${toolKey}_decision_screening`,
    decision_context: {
      system_boundary: `${toolName} evaluates one controlled decision boundary inside ${displayCategory} and excludes broad ERP, dashboard, or multi-module workflows.`,
      single_operation_scope: `${toolName} as one SuperV4 single-operation decision-support schema for screening, review, audit evidence, and commercial risk interpretation.`,
      decision_owner: "operator, engineer, owner_cfo, or checker_auditor depending on selected profile mode",
      decision_after_output: `Decide whether to proceed, hold, reprice, reject, repair, inspect, derate, outsource, scrap, rework, or escalate the ${toolName.toLowerCase()} case.`,
      cost_of_wrong_decision: `Wrong ${toolName.toLowerCase()} result can cause rework, wrong quote, missed capacity, unsafe screening confidence, downtime, cash leakage, or unnecessary escalation.`,
      failure_mode_if_formula_wrong: "False PASS, false REPRICE, false HOLD, hidden evidence gap, wrong unit conversion, or public formula leakage.",
      primary_metric: primaryMetricId,
      secondary_metrics: [
        "margin_index",
        "expanded_uncertainty",
        "money_at_risk",
        "primary_decision_state",
      ],
      required_source_documents: [
        "user-verified source evidence for critical inputs",
        "unit source confirmation",
        "measurement or quotation record when available",
        "calibration or uncertainty note when measured values are used",
      ],
      excluded_use_cases: [
        "certified compliance claim",
        "legal proof",
        "replacement for qualified engineering review",
        "replacement for official tax or regulatory advice",
        "broad multi-operation ERP workflow",
      ],
      field_use_limitations: [
        "Screening-grade decision support only.",
        "Exact acceptance limits must come from user-verified project, asset, standard, material, tax, or commercial source.",
        "Public output must not expose internal formula expressions.",
      ],
      tool_use_classification: "DECISION_SUPPORT_ONLY_NOT_CERTIFICATION",
    },
    irreversible_commitment_metric: {
      primary: "money_at_risk",
      technical: primaryMetricId,
      confidence: "evidence_confidence_and_uncertainty_crossing",
      description: `${toolName} should not create an irreversible purchase, quote, production, safety, or capital commitment without source verification and review when thresholds are crossed.`,
    },
    standards: [
      {
        name: "SI unit system context",
        role: "Unit normalization and unit display consistency",
        status: "CONTEXT_ONLY",
        restricted_table_reproduction: "FORBIDDEN",
      },
      {
        name: "GUM-style measurement uncertainty context",
        role: "Uncertainty language, coverage factor, and review logic",
        status: "CONTEXT_ONLY",
        restricted_table_reproduction: "FORBIDDEN",
      },
      {
        name: "Internal SectorCalc V5.3.1 formula governance",
        role: "Formula redaction, audit seal, golden hash, and server-only execution",
        status: "VERIFIED",
        restricted_table_reproduction: "FORBIDDEN",
      },
    ],
    standards_clause_map: [],
    reference_status: {
      overall: "NEEDS_SOURCE_VERIFICATION",
      exact_standard_clauses_supplied_by_user: false,
      standards_clause_map_policy: "EMPTY_UNLESS_USER_SUPPLIES_EXACT_REFERENCES",
      restricted_table_reproduction: "FORBIDDEN",
    },
    risk_level: riskLevel,
    brand_safety_policy: {
      third_party_brand_use: "FORBIDDEN",
      comparative_brand_language: "FORBIDDEN",
      affiliation_implication: "FORBIDDEN",
      competitor_name_generation: "FORBIDDEN",
      public_output_brand_mentions: "FORBIDDEN",
      legal_proof_claim: "FORBIDDEN",
      certified_compliance_claim: "FORBIDDEN",
      allowed_description: "Generic professional engineering evidence pattern",
      approved_terms: [
        "review-ready calculation evidence",
        "auditable engineering calculation note",
        "checker-ready calculation summary",
        "engineering proof pack",
        "standards-context calculation dossier",
        "source-evidence calculation record",
        "audit-ready decision support",
      ],
      violation_behavior: "REJECT_SCHEMA",
    },
    calculation_basis: {
      method: "Deterministic formula execution with source-evidence validation",
      domain: displayCategory,
      evidence_standard: "SCREENING_ONLY_NOT_CERTIFICATION",
      public_safety_rule: "No formula exposure, no exact reference reproduction.",
    },
    unit_system: {
      primary: "SI",
      secondary: "IMPERIAL",
      user_selectable: true,
      default: "SI",
      conversion_policy: "Allow-all with user verification",
    },
    unit_conversion_contract: {
      internal_base_system: "SI",
      currency_policy: "No currency conversion — user provides single-currency values",
      temperature_policy: "Absolute and interval distinction",
      conversion_registry: {},
      unsupported_conversion_behavior: "BLOCK_CALCULATION",
      unit_change_behavior: "PRESERVE_PHYSICAL_QUANTITY",
      formula_input_rule: "FORMULAS_USE_NORMALIZED_BASE_UNITS_ONLY",
    },
    inputs: schemaInputs,
    normalized_inputs: normalizedInputs,
    reference_value_policy: {
      policy: "USER_MUST_VERIFY",
      default_status: "NEEDS_SOURCE_VERIFICATION",
      critical_input_requires_verified_source: true,
      non_critical_input_accepts_context_only: true,
      restricted_table_reproduction: "FORBIDDEN",
    },
    form_runtime_binding: {
      renderer: "UniversalIndustrialDecisionForm",
      schema_generation_runtime: "V5.3.1 automated generation",
      llm_runtime_usage: "FORBIDDEN",
      client_formula_execution: "FORBIDDEN",
      server_execution_required: true,
      state_management_required: true,
      dynamic_ui_contract_required: true,
      json_schema_form_substrate_allowed: true,
      generic_json_schema_form_alone_sufficient: false,
      state_domains: [
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
      ],
      state_transitions: [
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
      ],
      execute_request_contract: {
        tool_id: "string",
        tool_key: "string",
        schema_version: "string",
        raw_inputs: "Record<string, unknown>",
        selected_units: "Record<string, string>",
        output_units: "Record<string, string>",
        display_currency: "string | null",
        user_profile_mode: "ProfileMode",
      },
      execute_response_contract: {
        status: "CalcStatus",
        outputs: "ServerOutput[]",
        warnings: "ServerWarning[]",
        normalized_input_audit: "NormalizedInputAudit[]",
        decision_interpretation: "DecisionInterpretation",
        audit_seal: "AuditSeal",
        redaction_status: "RedactionStatus",
      },
    },
    physical_bounds_policy: {
      policy: "NO_AUTOMATIC_BOUNDS_FOR_PUBLIC_FREE_TOOLS",
      default_violation_behavior: "WARNING_ONLY",
      critical_input_requires_user_set_bounds: true,
      non_critical_input_uses_reference_range_only: true,
    },
    validation_contract: {
      fail_closed: true,
      semantic_errors_required: true,
      rules: [
        {
          id: "V_MISSING_REQUIRED",
          type: "REQUIRED_INPUT",
          affected_inputs: inputIds,
          level: "BLOCK",
          message: "All required input values must be provided.",
          semantic_message: "Enter a value for this required input before calculation.",
        },
        {
          id: "V_NUMERIC_RANGE",
          type: "NUMERIC_RANGE",
          affected_inputs: inputIds,
          level: "WARN",
          message: "Check input value range.",
          semantic_message: "The entered value may be outside expected range.",
        },
      ],
      custom_validation: "Server-side formula validation",
      preflight_validation_required: true,
      error_message_style: "Semantic with field reference",
    },
    derating_contract: {
      enabled: false,
      policy: "No automatic derating for free screening tools.",
      derating_factors: [],
    },
    precision_policy: {
      input_decimals: null,
      display_decimals: 2,
      calculation_precision: "FULL_DOUBLE_PRECISION_NO_PRE_ROUNDING",
      rounding_rule: "DISPLAY_ONLY",
    },
    formulas: buildFormulas(inputs as any, primaryMetricId),
    outputs: buildOutputs(primaryMetricId, toolName),
    output_formatting: {
      default_decimals: 2,
      money_decimals: 2,
      ratio_decimals: 4,
      percent_display_allowed: true,
      rounding_rule: "DISPLAY_ONLY",
      non_color_status_labels_required: true,
      public_formula_expression_visible: false,
    },
    decision_interpretation_contract: {
      always_include_decision_state: true,
      always_include_hidden_risk: true,
      always_include_next_actions: true,
      always_include_premium_unlock_reason: true,
      profile_modes: ["operator", "engineer", "owner_cfo", "checker_auditor"],
    },
    business_impact_contract: {
      enabled: false,
      currency: null,
      description: "Business impact analysis not available for free screening tools.",
    },
    engine_rules: {
      deterministic_execution: true,
      formula_redaction_policy: "REDACT_ALL_PUBLIC_FORMULA_EXPRESSIONS",
      public_formula_expression_policy: "FORBIDDEN",
      llm_runtime_usage: "FORBIDDEN",
      client_formula_execution: "FORBIDDEN",
    },
    uncertainty_model: {
      model: "NONE",
      description: "No uncertainty propagation for free screening tools.",
    },
    safety_factor_gauges: [],
    proof_pack: {
      enabled: true,
      redaction_status: "PUBLIC_SAFE_REDACTED",
      sections: [
        {
          id: "execution_summary",
          title: "Execution Summary",
          public_content: "Calculation executed server-side. Results are for decision support only.",
        },
        {
          id: "standard_refs",
          title: "Standards Context",
          public_content: "This calculation references engineering standards contextually. Full reproduction of tables is forbidden.",
        },
      ],
    },
    audit_trail_contract: {
      enabled: true,
      events: ["SCHEMA_LOAD", "INPUT_ENTRY", "UNIT_SELECTION", "EXECUTION", "RESULT_VIEW"],
      required_for_export: true,
    },
    export_contract: {
      pdf_enabled: true,
      json_audit_enabled: true,
      copy_summary_enabled: false,
      cad_bim_erp_export: {
        status: "FUTURE_OPTIONAL_OR_CUSTOM_IMPLEMENTATION",
        allowed_formats: [],
      },
      free_tier_export_disabled: true,
      pdf_generates_free_tier_paywall_message: true,
    },
    ui_contract: buildUiContract(inputIds),
    reference_code: {
      policy: "No public reference tables reproduced.",
      reproduction_policy: "FORBIDDEN",
    },
    test_plan: {
      policy: "Golden hash comparison via tests/golden/.",
      required_pass_rate: "100%",
    },
    red_team_review: {
      status: "AUTOMATED",
      findings: [],
    },
    metadata: {
      schema_version: "5.3.1",
      formula_version: "5.3.1",
      prompt_version: "5.3.1",
      generation_method: "automated_from_formula_registry",
      generation_date: new Date().toISOString().split("T")[0],
      source_formula: toolKey,
      tool_id: toolId,
      tool_key: toolKey,
      tool_name: toolName,
    },
  };

  const fileName = `${String(num).padStart(3, "0")}-${sanitizeFileName(toolKey)}.json`;
  const filePath = join(SCHEMAS_DIR, fileName);
  writeFileSync(filePath, JSON.stringify(schema, null, 2), "utf8");
  generated.push(fileName);
  idx++;
}

console.log(`Generated ${generated.length} schema files in ${SCHEMAS_DIR}:`);
for (const f of generated) {
  console.log(`  ${f}`);
}
console.log(`\nNext index: ${START_INDEX + generated.length}`);
