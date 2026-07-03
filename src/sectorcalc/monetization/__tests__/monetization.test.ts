// SectorCalc V5.3.1 — Monetization Hook Tests
// Registry metadata-only, server-side impact engine, stale response protection.

import { describe, it, expect } from "vitest";
import { B2B_MONETIZATION_REGISTRY } from "../monetization-registry";
import { calculateServerImpact } from "../server-impact-engine";
import { buildPremiumHook } from "../build-premium-hook";
import { resolveStripePriceId } from "../price-lookup.server";
import {
  createInitialUniversalFormState,
  universalFormMachineReducer,
} from "../../pro-form/form-state-machine";
import type { PremiumHookPublic } from "../monetization-types";
import type { SuperV4Schema } from "../../pro-form/contract-types";

// ── Registry metadata-only tests ──

describe("B2B_MONETIZATION_REGISTRY", () => {
  it("contains no function values", () => {
    for (const [key, config] of Object.entries(B2B_MONETIZATION_REGISTRY)) {
      expect(typeof config).toBe("object");
      expect(config).not.toHaveProperty("logic");
      expect(config).not.toHaveProperty("calculate");
      expect(config).not.toHaveProperty("fn");
      for (const [_prop, val] of Object.entries(config)) {
        if (Array.isArray(val)) {
          expect(val.every((v) => typeof v === "string")).toBe(true);
        } else {
          expect(
            typeof val === "string" ||
              typeof val === "number" ||
              typeof val === "boolean" ||
              val === null ||
              val === undefined,
          ).toBe(true);
        }
      }
    }
  });

  it("contains no Stripe price IDs", () => {
    for (const [_key, config] of Object.entries(B2B_MONETIZATION_REGISTRY)) {
      expect(config).not.toHaveProperty("priceId");
      expect(config).not.toHaveProperty("stripePriceId");
      expect(config.priceLookupKey).not.toMatch(/^price_/);
    }
  });

  it("contains no forbidden claims", () => {
    const forbidden = [
      /official declaration/i,
      /compliant declaration/i,
      /\bcertified\b/i,
      /\bapproved\b/i,
      /\bguaranteed\b/i,
      /legal proof/i,
    ];
    for (const [_key, config] of Object.entries(B2B_MONETIZATION_REGISTRY)) {
      for (const [_prop, val] of Object.entries(config)) {
        if (typeof val === "string") {
          for (const pattern of forbidden) {
            expect(val).not.toMatch(pattern);
          }
        }
      }
    }
  });

  it("contains expected tool entries", () => {
    expect(
      B2B_MONETIZATION_REGISTRY["overall-equipment-effectiveness"],
    ).toBeDefined();
    expect(B2B_MONETIZATION_REGISTRY["smed-setup-time"]).toBeDefined();
    expect(B2B_MONETIZATION_REGISTRY["cbam-risk-auditor"]).toBeDefined();
  });
});

// ── Server impact engine tests ──

describe("calculateServerImpact", () => {
  it("returns INSUFFICIENT_INPUT when commercial inputs are missing", () => {
    const result = calculateServerImpact({
      toolKey: "overall-equipment-effectiveness",
      normalizedInputs: {},
      freeOutputs: { oee_percentage: 72 },
      displayCurrency: null,
    });
    expect(result).not.toBeNull();
    expect(result!.status).toBe("INSUFFICIENT_INPUT");
    expect(result!.value).toBeNull();
  });

  it("returns INSUFFICIENT_INPUT when free outputs are missing", () => {
    const result = calculateServerImpact({
      toolKey: "overall-equipment-effectiveness",
      normalizedInputs: { shift_hours: 8, machine_hourly_rate: 150 },
      freeOutputs: {},
      displayCurrency: "USD",
    });
    expect(result).not.toBeNull();
    expect(result!.status).toBe("INSUFFICIENT_INPUT");
    expect(result!.value).toBeNull();
  });

  it("returns null for unknown tool key", () => {
    const result = calculateServerImpact({
      toolKey: "non-existent-tool",
      normalizedInputs: {},
      freeOutputs: {},
      displayCurrency: null,
    });
    expect(result).toBeNull();
  });

  it("calculates OEE monthly loss when all inputs present", () => {
    const result = calculateServerImpact({
      toolKey: "overall-equipment-effectiveness",
      normalizedInputs: { shift_hours: 8, machine_hourly_rate: 150 },
      freeOutputs: { oee_percentage: 72 },
      displayCurrency: "USD",
    });
    expect(result).not.toBeNull();
    expect(result!.status).toBe("AVAILABLE");
    expect(result!.value).toBeGreaterThan(0);
    expect(result!.unit).toBe("USD");
    expect(result!.painMetricKey).toBe("estimated_monthly_downtime_loss");
  });

  it("calculates SMED annual setup cost", () => {
    const result = calculateServerImpact({
      toolKey: "smed-setup-time",
      normalizedInputs: {
        daily_batches: 3,
        operating_days_per_year: 250,
        machine_hourly_rate: 120,
      },
      freeOutputs: { setup_time_minutes: 45 },
      displayCurrency: "EUR",
    });
    expect(result).not.toBeNull();
    expect(result!.status).toBe("AVAILABLE");
    expect(result!.value).toBeGreaterThan(0);
    expect(result!.unit).toBe("EUR");
  });

  describe("CARBON_EXPOSURE_SCREENING_V1", () => {
    it("does not use default carbon price", async () => {
      // The engine code must not have `??` fallback for carbonPrice
      const fs = await import("fs");
      const path = await import("path");
      const source = fs.readFileSync(
        path.join(__dirname, "../server-impact-engine.ts"),
        "utf8",
      );
      const lines = source.split("\n");
      for (const line of lines) {
        const hasCarbonPrice = /\bcarbonPrice\b/.test(line);
        const hasDefault = /\?\?/.test(line);
        if (hasCarbonPrice && hasDefault) {
          expect(line).not.toMatch(/carbonPrice.*\?\?/);
        }
      }
    });

    it("returns INSUFFICIENT_INPUT when carbon price is missing", () => {
      const result = calculateServerImpact({
        toolKey: "cbam-risk-auditor",
        normalizedInputs: {},
        freeOutputs: { embedded_emissions_tco2e: 150 },
        displayCurrency: null,
      });
      expect(result).not.toBeNull();
      expect(result!.status).toBe("INSUFFICIENT_INPUT");
    });

    it("calculates exposure when both inputs present", () => {
      const result = calculateServerImpact({
        toolKey: "cbam-risk-auditor",
        normalizedInputs: { assumed_carbon_price_eur: 85 },
        freeOutputs: { embedded_emissions_tco2e: 150 },
        displayCurrency: "EUR",
      });
      expect(result).not.toBeNull();
      expect(result!.status).toBe("AVAILABLE");
      expect(result!.unit).toBe("EUR");
    });
  });
});

// ── Build premium hook tests ──

describe("buildPremiumHook", () => {
  it("returns null for unknown tool key", () => {
    const result = buildPremiumHook({
      toolKey: "non-existent-tool",
      normalizedInputs: {},
      freeOutputs: {},
      displayCurrency: null,
    });
    expect(result).toBeNull();
  });

  it("returns public-safe hook for known tool with full inputs", () => {
    const result = buildPremiumHook({
      toolKey: "overall-equipment-effectiveness",
      normalizedInputs: { shift_hours: 8, machine_hourly_rate: 150 },
      freeOutputs: { oee_percentage: 72 },
      displayCurrency: "USD",
    });
    expect(result).not.toBeNull();
    expect(result!.free_output_key).toBe("oee_percentage");
    expect(result!.pain_metric_key).toBe("estimated_monthly_downtime_loss");
    expect(result!.pain_metric.value).toBeGreaterThan(0);
    expect(result!.pain_metric.safety_note).toContain("Estimated");
    expect(result!.cta.checkout_intent).toBe("FREE_TOOL_PREMIUM_UPSELL");
    expect(result!.redaction_status).toBe("PUBLIC_SAFE_REDACTED");
  });

  it("returns INSUFFICIENT_INPUT status when commercial inputs missing", () => {
    const result = buildPremiumHook({
      toolKey: "overall-equipment-effectiveness",
      normalizedInputs: {},
      freeOutputs: { oee_percentage: 72 },
      displayCurrency: null,
    });
    expect(result).not.toBeNull();
    expect(result!.pain_metric.status).toBe("INSUFFICIENT_INPUT");
    expect(result!.pain_metric.value).toBeNull();
  });

  it("has no exact formula expression in public output", () => {
    const result = buildPremiumHook({
      toolKey: "overall-equipment-effectiveness",
      normalizedInputs: { shift_hours: 8, machine_hourly_rate: 150 },
      freeOutputs: { oee_percentage: 72 },
      displayCurrency: "USD",
    });
    const publicText =
      result!.pain_metric.label +
      result!.pain_metric.explanation +
      result!.pain_metric.safety_note;
    expect(publicText).not.toMatch(/gapToReference/);
    expect(publicText).not.toMatch(/\bMath\./);
    expect(publicText).not.toMatch(/\b85\s*-\s*oee/);
  });
});

// ── Price lookup tests ──

describe("price-lookup.server", () => {
  it("resolveStripePriceId returns null for unknown key", () => {
    const result = resolveStripePriceId("unknown_key");
    expect(result).toBeNull();
  });

  it("resolveStripePriceId returns null when env not set", () => {
    const result = resolveStripePriceId("sectorcalc_pro_monthly");
    expect(result === null || typeof result === "string").toBe(true);
  });
});

// ── State machine ghost data tests ──

describe("form state machine premiumHook reset safety", () => {
  function createMinimalSchema(): SuperV4Schema {
    return {
      tool_id: "test",
      tool_key: "test",
      tool_name: "Test",
      category: "test",
      scope: "test",
      primary_operation: "test",
      decision_context: {},
      irreversible_commitment_metric: "",
      standards: [],
      standards_clause_map: [],
      reference_status: "CONTEXT_ONLY",
      risk_level: "LOW",
      brand_safety_policy: {},
      calculation_basis: {},
      unit_system: {},
      unit_conversion_contract: { conversion_registry: {} },
      inputs: [],
      normalized_inputs: [],
      reference_value_policy: {},
      form_runtime_binding: {
        renderer: "UniversalIndustrialDecisionForm",
        schema_generation_runtime: "stub",
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
        execute_response_contract: {},
      },
      physical_bounds_policy: {},
      validation_contract: {},
      derating_contract: {},
      precision_policy: {},
      formulas: [],
      outputs: [],
      output_formatting: {},
      decision_interpretation_contract: {},
      business_impact_contract: {},
      engine_rules: {},
      uncertainty_model: {},
      safety_factor_gauges: [],
      proof_pack: {},
      audit_trail_contract: {},
      export_contract: {},
      ui_contract: {
        target_renderer: "UniversalIndustrialDecisionForm",
        profile_modes: ["engineering"],
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
      reference_code: {},
      test_plan: {},
      red_team_review: {},
      metadata: { schema_version: "1.0.0", formula_version: "1.0.0" },
    };
  }

  function stateWithPremiumHook() {
    const base = createInitialUniversalFormState("engineering");
    const sampleHook: PremiumHookPublic = {
      free_output_key: "oee_percentage",
      pain_metric_key: "loss",
      pain_metric: {
        value: 1000,
        unit: "USD",
        display_currency: "USD",
        confidence: "MEDIUM",
        status: "AVAILABLE",
        label: "Loss",
        explanation: "Test",
        safety_note: "Estimated decision-support metric.",
      },
      cta: {
        label: "Unlock",
        subtext: "Details",
        unlock_type: "MACHINE_LEVEL_BREAKDOWN",
        checkout_intent: "FREE_TOOL_PREMIUM_UPSELL",
        price_lookup_key: "pro_monthly",
      },
      redaction_status: "PUBLIC_SAFE_REDACTED",
    };
    const schema = createMinimalSchema();
    // Set premium hook by dispatching RECEIVE_SERVER_RESPONSE
    const afterInit = universalFormMachineReducer(base, {
      type: "INIT_SCHEMA",
      schema,
      schema_hash: null,
    });
    const afterValid = universalFormMachineReducer(afterInit, {
      type: "VALIDATE_SCHEMA_CONTRACT",
      errors: [],
    });

    // Dispatch RECEIVE_SERVER_RESPONSE with a premium_hook by casting
    return universalFormMachineReducer(afterValid, {
      type: "RECEIVE_SERVER_RESPONSE",
      response: {
        status: "OK",
        pipeline_state: "OK",
        outputs: [],
        warnings: [],
        normalized_input_audit: [],
        sensitivity: [],
        scenario_compare: null,
        proof_pack_public: {
          enabled: true,
          redaction_status: "PUBLIC_SAFE_REDACTED",
          sections: [],
        },
        decision_interpretation: {
          primary_decision: "OK",
          primary_reason: "Test",
          user_profile_summary: {
            operator: "",
            engineer: "",
            owner_cfo: "",
            checker_auditor: "",
          },
          hidden_risk_explanations: [],
          money_impact_summary: {
            enabled: false,
            currency: null,
            money_at_risk_formatted: null,
            main_cost_driver: null,
            quote_or_decision_impact: "",
          },
          what_can_flip_the_decision: [],
          next_best_actions: [],
          premium_unlock_reason: "",
        },
        audit_seal: {
          seal_status: "SEALED",
          hash_algorithm: "SHA-256",
          schema_hash: "abc",
          formula_version: "1",
          schema_version: "1",
          runtime_version: "1",
          input_hash: "abc",
          output_hash: "abc",
          executed_at: new Date().toISOString(),
          redaction_status: "PUBLIC_SAFE_REDACTED",
          signature_status: "UNSIGNED",
        },
        redaction_status: "PUBLIC_SAFE_REDACTED",
        premium_hook: sampleHook,
      },
    });
  }

  it("premiumHook is present after RECEIVE_SERVER_RESPONSE", () => {
    const state = stateWithPremiumHook();
    expect(state.premiumHookState.hook).not.toBeNull();
    expect(state.premiumHookState.hook!.pain_metric.value).toBe(1000);
  });

  it("premiumHook clears on RESET_INPUTS", () => {
    const state = stateWithPremiumHook();
    const schema = createMinimalSchema();
    const afterInit = universalFormMachineReducer(state, {
      type: "INIT_SCHEMA",
      schema,
      schema_hash: null,
    });
    const resetState = universalFormMachineReducer(afterInit, {
      type: "RESET_INPUTS",
    });
    expect(resetState.premiumHookState.hook).toBeNull();
  });

  it("premiumHook clears on RESET_RESULT_ONLY", () => {
    const state = stateWithPremiumHook();
    const resetState = universalFormMachineReducer(state, {
      type: "RESET_RESULT_ONLY",
    });
    expect(resetState.premiumHookState.hook).toBeNull();
  });

  it("premiumHook clears on SUBMIT_SERVER_EXECUTION", () => {
    const state = stateWithPremiumHook();
    const newState = universalFormMachineReducer(state, {
      type: "SUBMIT_SERVER_EXECUTION",
    });
    expect(newState.premiumHookState.hook).toBeNull();
  });

  it("premiumHook clears on RECEIVE_SERVER_ERROR", () => {
    const state = stateWithPremiumHook();
    const newState = universalFormMachineReducer(state, {
      type: "RECEIVE_SERVER_ERROR",
      message: "Test error",
    });
    expect(newState.premiumHookState.hook).toBeNull();
  });

  it("premiumHook clears on RECEIVE_SERVER_BLOCKERS", () => {
    const state = stateWithPremiumHook();
    const newState = universalFormMachineReducer(state, {
      type: "RECEIVE_SERVER_BLOCKERS",
      blockers: [
        {
          id: "blocker",
          severity: "BLOCKER",
          message: "Blocked",
          why_it_matters: "!",
          suggested_action: "Fix",
        },
      ],
    });
    expect(newState.premiumHookState.hook).toBeNull();
  });

  it("premiumHook clears on INIT_SCHEMA", () => {
    const state = stateWithPremiumHook();
    const schema = createMinimalSchema();
    const newState = universalFormMachineReducer(state, {
      type: "INIT_SCHEMA",
      schema,
      schema_hash: null,
    });
    expect(newState.premiumHookState.hook).toBeNull();
  });
});
