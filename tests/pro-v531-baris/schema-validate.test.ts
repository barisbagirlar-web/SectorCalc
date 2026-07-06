import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SCHEMAS_DIR = path.resolve(__dirname, "../../src/sectorcalc/schemas/pro-v531");

const REQUIRED_TOP_KEYS = [
  "tool_id", "tool_key", "tool_name", "category", "scope",
  "primary_operation", "decision_context", "irreversible_commitment_metric",
  "standards", "standards_clause_map", "reference_status", "risk_level",
  "brand_safety_policy", "calculation_basis", "unit_system",
  "unit_conversion_contract", "inputs", "normalized_inputs",
  "reference_value_policy", "form_runtime_binding", "physical_bounds_policy",
  "validation_contract", "derating_contract", "precision_policy",
  "formulas", "outputs", "output_formatting",
  "decision_interpretation_contract", "business_impact_contract",
  "engine_rules", "uncertainty_model", "safety_factor_gauges",
  "proof_pack", "audit_trail_contract", "export_contract",
  "ui_contract", "reference_code", "test_plan",   "red_team_review",
  "metadata",
];

describe("pro-v531-baris: schema validation", () => {
  const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".schema.json"));

  it("each file should be valid JSON", () => {
    for (const file of files) {
      const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
    }
  });

  it("each schema should have all 40 required top-level keys", () => {
    for (const file of files) {
      const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8");
      const schema = JSON.parse(content);
      const keys = Object.keys(schema);
      for (const key of REQUIRED_TOP_KEYS) {
        expect(keys).toContain(key);
      }
    }
  });

  it("each schema should have PROTECTED_SERVER_FORMULA formula basis", () => {
    for (const file of files) {
      const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8");
      const schema = JSON.parse(content);
      expect(schema.calculation_basis.basis_type).toBe(
        "PROTECTED_SERVER_FORMULA_GRAPH_WITH_PUBLIC_SAFE_SCHEMA_CONTRACT"
      );
    }
  });

  it("each schema should require private formula registry", () => {
    for (const file of files) {
      const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8");
      const schema = JSON.parse(content);
      expect(schema.calculation_basis.formula_storage).toBe(
        "PRIVATE_SERVER_SIDE_FORMULA_REGISTRY_REQUIRED_FOR_LIVE_EXECUTION"
      );
    }
  });

  it("each schema should have FORBIDDEN third-party brand use", () => {
    for (const file of files) {
      const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8");
      const schema = JSON.parse(content);
      expect(schema.brand_safety_policy.third_party_brand_use).toBe("FORBIDDEN");
    }
  });
});
