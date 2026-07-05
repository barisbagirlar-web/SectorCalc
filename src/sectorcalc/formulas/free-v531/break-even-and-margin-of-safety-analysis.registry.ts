// SectorCalc V5.4 Core — Free Pilot Formula Registry Registration
// Server-side only. Registers CVP formula nodes for the break-even free tool.
import "server-only";
import { formulaRegistry, FormulaRegistry, FormulaRegistryRecord, FormulaRegistryNode } from "@/sectorcalc/pro-runtime/formula-registry";
import { SchemaRegistry } from "@/sectorcalc/pro-form/schema-registry";

const TOOL_ID = "FREE_030_BREAK_EVEN_MARGIN_OF_SAFETY_ANALYSIS";
const TOOL_KEY = "break-even-and-margin-of-safety-analysis";
const FORMULA_VERSION = "5.3.1-superv4-pro-grade";

const nodes: FormulaRegistryNode[] = [
  {
    formula_id: "F_CONTRIBUTION_MARGIN",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "SUBTRACT",
    constant_refs: [],
    input_refs: ["n_selling_price_per_unit", "n_variable_cost_per_unit"],
    output_ref: "contribution_margin_per_unit",
    unit_dimension_rule: "CURRENCY",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "contribution_margin_per_unit > 0",
    review_rule: "contribution_margin_per_unit <= 0.01",
    rejection_rule: "contribution_margin_per_unit <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_BREAK_EVEN",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "DIVIDE",
    constant_refs: [],
    input_refs: ["n_fixed_costs", "contribution_margin_per_unit"],
    output_ref: "break_even_units",
    unit_dimension_rule: "COUNT",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "break_even_units > 0",
    review_rule: "break_even_units <= 0",
    rejection_rule: "contribution_margin_per_unit <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_BREAK_EVEN_REVENUE",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "MULTIPLY",
    constant_refs: [],
    input_refs: ["break_even_units", "n_selling_price_per_unit"],
    output_ref: "break_even_revenue",
    unit_dimension_rule: "CURRENCY",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "break_even_revenue > 0",
    review_rule: "break_even_revenue <= 0",
    rejection_rule: "break_even_revenue <= 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_MARGIN_SAFETY_UNITS",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "SUBTRACT",
    constant_refs: [],
    input_refs: ["n_actual_sales_units", "break_even_units"],
    output_ref: "margin_of_safety_units",
    unit_dimension_rule: "COUNT",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "margin_of_safety_units >= 0",
    review_rule: "margin_of_safety_units < 0",
    rejection_rule: "margin_of_safety_units < 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_MARGIN_SAFETY_RATIO",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "DIVIDE",
    constant_refs: [],
    input_refs: ["margin_of_safety_units", "n_actual_sales_units"],
    output_ref: "mos_intermediate_ratio",
    unit_dimension_rule: "RATIO",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "mos_intermediate_ratio >= 0",
    review_rule: "mos_intermediate_ratio < 0.10",
    rejection_rule: "mos_intermediate_ratio < 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
  {
    formula_id: "F_MARGIN_SAFETY_PCT",
    formula_version: FORMULA_VERSION,
    schema_hash_binding: "",
    formula_registry_hash: "",
    operation: "WEIGHTED_SUM",
    constant_refs: [100],
    input_refs: ["mos_intermediate_ratio"],
    output_ref: "margin_of_safety_percent",
    unit_dimension_rule: "RATIO",
    uncertainty_rule: "NONE",
    sensitivity_rule: "DERIVATIVE",
    fmea_trigger_rule: null,
    acceptance_rule: "margin_of_safety_percent >= 0",
    review_rule: "margin_of_safety_percent < 10.0",
    rejection_rule: "margin_of_safety_percent < 0",
    redaction_rule: "PUBLIC_SAFE_REDACTED",
  },
];

// Compute registry hash
const formulaRegistryHash = FormulaRegistry.computeRegistryHash(nodes);
for (const node of nodes) {
  node.formula_registry_hash = formulaRegistryHash;
}

export function registerFreePilotFormulas(schema: unknown): void {
  const existing = formulaRegistry.fetch(TOOL_ID, FORMULA_VERSION);
  if (existing) return;

  const schemaHash = SchemaRegistry.computeSchemaHash(schema as Parameters<typeof SchemaRegistry.computeSchemaHash>[0]);

  for (const node of nodes) {
    node.schema_hash_binding = schemaHash;
  }

  const record: FormulaRegistryRecord = {
    tool_id: TOOL_ID,
    tool_key: TOOL_KEY,
    formula_version: FORMULA_VERSION,
    formula_registry_hash: formulaRegistryHash,
    schema_hash_binding: schemaHash,
    nodes,
    internal_trace_policy: "RESTRICTED_CHECKER",
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    approved_by: "v54-core-release",
  };

  formulaRegistry.register(record);
}
