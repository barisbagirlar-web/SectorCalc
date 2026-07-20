/**
 * Strip server-only schema payloads before they cross the RSC → client boundary.
 *
 * Live CWV diagnosis (2026-07-20): von-mises free-tool HTML was ~329KB because the
 * full V531 schema was serialized into `self.__next_f` flight props. `test_plan`
 * alone was ~102KB and `red_team_review` ~24KB — neither is rendered by
 * UniversalIndustrialDecisionForm (Advanced details uses static copy).
 *
 * Constraint 2 (FAZ 2.1):
 * - KEEP inputs (user_help_text, bounds, enriched `_reference_*` Source/Declared span)
 *   so client SSR HTML retains E-E-A-T signals Googlebot reads from the document.
 * - KEEP interactive contract fields (outputs, normalized_inputs, ui_contract,
 *   form_runtime_binding, unit_conversion_contract, standards names).
 * - DROP / stub audit QA dossiers and non-rendered policy blobs from flight props.
 *
 * Execute path continues to load the full schema server-side — never from client body.
 */

import type { SuperV4Schema } from "./contract-types";

/** Top-level keys safe to replace with empty objects (not read by free/PRO form UI). */
const EMPTY_OBJECT_KEYS = [
  "validation_contract",
  "proof_pack",
  "decision_interpretation_contract",
  "derating_contract",
  "engine_rules",
  "export_contract",
  "business_impact_contract",
  "brand_safety_policy",
  "physical_bounds_policy",
  "precision_policy",
  "reference_value_policy",
  "uncertainty_model",
  "audit_trail_contract",
  "calculation_basis",
  "reference_code",
  "output_formatting",
] as const;

const EMPTY_ARRAY_KEYS = ["standards_clause_map", "safety_factor_gauges"] as const;

const METADATA_KEEP = new Set([
  "schema_version",
  "formula_version",
  "tool_id",
  "tool_key",
  "tool_name",
  "prompt_version",
]);

function slimMetadata(
  metadata: SuperV4Schema["metadata"] | undefined,
): SuperV4Schema["metadata"] {
  const src = metadata ?? { schema_version: "1.0.0", formula_version: "1.0.0" };
  const out: SuperV4Schema["metadata"] = {
    schema_version: typeof src.schema_version === "string" ? src.schema_version : "1.0.0",
    formula_version: typeof src.formula_version === "string" ? src.formula_version : "1.0.0",
  };
  for (const key of METADATA_KEEP) {
    if (key === "schema_version" || key === "formula_version") continue;
    if (key in src && src[key] !== undefined) out[key] = src[key];
  }
  return out;
}

/**
 * Standards are kept as name-only stubs for the static "Standards referenced" SSR line.
 * Full clause maps are stripped separately.
 */
function slimStandards(standards: unknown[]): unknown[] {
  if (!Array.isArray(standards)) return [];
  return standards.map((item) => {
    if (!item || typeof item !== "object") return item;
    const s = item as Record<string, unknown>;
    return {
      ...(typeof s.name === "string" ? { name: s.name } : {}),
      ...(typeof s.id === "string" ? { id: s.id } : {}),
      ...(typeof s.code === "string" ? { code: s.code } : {}),
    };
  });
}

export function toClientRenderableSchema(schema: SuperV4Schema): SuperV4Schema {
  const next: SuperV4Schema = {
    ...schema,
    test_plan: {
      test_cases: [],
      coverage_requirement: "NONE",
    },
    red_team_review: {
      review_status: "NOT_REVIEWED",
      issues: [],
    },
    formulas: [],
    metadata: slimMetadata(schema.metadata),
    standards: slimStandards(Array.isArray(schema.standards) ? schema.standards : []),
    decision_context: {},
  };

  for (const key of EMPTY_OBJECT_KEYS) {
    (next as unknown as Record<string, unknown>)[key] = {};
  }
  for (const key of EMPTY_ARRAY_KEYS) {
    (next as unknown as Record<string, unknown>)[key] = [];
  }

  if (
    next.irreversible_commitment_metric &&
    typeof next.irreversible_commitment_metric === "object"
  ) {
    next.irreversible_commitment_metric = "CLIENT_STUB";
  }

  return next;
}
