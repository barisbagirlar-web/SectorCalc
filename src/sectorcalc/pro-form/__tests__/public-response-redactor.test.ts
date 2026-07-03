// Test: Public response redactor — safe/unsafe detection

import { describe, it, expect } from "vitest";
import { redactPublicResponse, isPublicExportSafe } from "../public-response-redactor";
import type { ExecuteResponse } from "../contract-types";

function minimalResponse(): ExecuteResponse {
  return {
    status: "OK",
    pipeline_state: "OK",
    outputs: [],
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

describe("Public response redactor", () => {
  it("returns PUBLIC_SAFE_REDACTED for clean response", () => {
    const result = redactPublicResponse(minimalResponse());
    expect(result.status).toBe("PUBLIC_SAFE_REDACTED");
  });

  it("removes exact_expression from response body", () => {
    const response = minimalResponse();
    (response as any).exact_expression = "a + b";
    const { response: safe } = redactPublicResponse(response);
    expect((safe as any).exact_expression).toBeUndefined();
  });

  it("removes proprietary_coefficients from response body", () => {
    const response = minimalResponse();
    (response as any).proprietary_coefficients = { a: 1.5 };
    const { response: safe } = redactPublicResponse(response);
    expect((safe as any).proprietary_coefficients).toBeUndefined();
  });

  it("detects forbidden patterns in string values and fails redaction", () => {
    const response = minimalResponse();
    response.warnings.push({
      id: "leak",
      severity: "WARNING" as const,
      message: "containing registry_hash abc123 leaked",
      why_it_matters: "test",
      suggested_action: "test",
    });
    const result = redactPublicResponse(response);
    expect(result.status).toBe("REDACTION_FAILED_BLOCKED");
  });

  it("isPublicExportSafe returns true for PUBLIC_SAFE_REDACTED", () => {
    const response = minimalResponse();
    response.redaction_status = "PUBLIC_SAFE_REDACTED";
    expect(isPublicExportSafe(response)).toBe(true);
  });

  it("isPublicExportSafe returns false for REDACTION_FAILED_BLOCKED", () => {
    const response = minimalResponse();
    response.redaction_status = "REDACTION_FAILED_BLOCKED";
    expect(isPublicExportSafe(response)).toBe(false);
  });
});
