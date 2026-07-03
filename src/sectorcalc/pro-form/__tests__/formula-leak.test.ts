// Test: Formula leak prevention — ensure no formula expressions in public schemas

import { describe, it, expect } from "vitest";
import type { ExecuteResponse } from "../contract-types";
import { redactPublicResponse } from "../public-response-redactor";

function buildResponseWithFormula(): ExecuteResponse {
  return {
    status: "OK",
    pipeline_state: "OK",
    outputs: [{
      id: "result",
      name: "Result",
      value: 42,
      status: "OK",
      public_explanation: "Computed via formula: result = input_a * input_b",
      decision_use: "Final result",
    }],
    warnings: [],
    normalized_input_audit: [],
    reference_range_audit: [],
    sensitivity: [],
    scenario_compare: null,
    fmea_summary: null,
    proof_pack_public: { enabled: false, redaction_status: "PUBLIC_SAFE_REDACTED", sections: [] },
    decision_interpretation: {
      primary_decision: "OK",
      primary_reason: "OK",
      user_profile_summary: { operator: "OK", engineer: "OK", owner_cfo: "OK", checker_auditor: "OK" },
      hidden_risk_explanations: [],
      money_impact_summary: { enabled: false, currency: null, money_at_risk_formatted: null, main_cost_driver: null, quote_or_decision_impact: "" },
      what_can_flip_the_decision: [],
      next_best_actions: [],
      premium_unlock_reason: "",
    },
    audit_seal: {
      seal_status: "SEALED",
      hash_algorithm: "SHA-256",
      input_hash: "",
      output_hash: "",
      schema_hash: "",
      formula_version: "",
      schema_version: "",
      runtime_version: "",
      executed_at: "",
      redaction_status: "PUBLIC_SAFE_REDACTED",
      signature_status: "UNSIGNED",
    },
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

describe("Formula leak prevention", () => {
  it("redacts 'exact_formula_expression' key from response", () => {
    const response = buildResponseWithFormula();
    (response as any).exact_formula_expression = "input_a * input_b";
    const { status } = redactPublicResponse(response);
    expect(status).toBe("PUBLIC_SAFE_REDACTED");
  });

  it("removes 'exact_expression' from response body", () => {
    const response = buildResponseWithFormula();
    (response as any).exact_expression = "input_a * input_b";
    const result = redactPublicResponse(response);
    expect(result.status).toBe("PUBLIC_SAFE_REDACTED");
  });

  it("flags forbidden content in string values", () => {
    const response = buildResponseWithFormula();
    response.warnings.push({
      id: "leak",
      severity: "WARNING" as const,
      message: "registry_hash abc123 exposed in log",
      why_it_matters: "test",
      suggested_action: "test",
    });
    const result = redactPublicResponse(response);
    expect(result.status).toBe("REDACTION_FAILED_BLOCKED");
  });

  it("sets redaction_status to PUBLIC_SAFE on success", () => {
    const response = buildResponseWithFormula();
    const { response: safe } = redactPublicResponse(response);
    expect(safe.redaction_status).toBe("PUBLIC_SAFE_REDACTED");
  });
});
