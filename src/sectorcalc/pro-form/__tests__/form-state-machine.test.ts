// Test: Form State Machine — V5.3.1 universal form machine reducer

import { describe, it, expect } from "vitest";
import {
  createInitialUniversalFormState,
  universalFormMachineReducer,
  getExecutionStateLabel,
} from "../form-state-machine";

describe("Form State Machine V5.3.1", () => {
  it("creates initial state as idle", () => {
    const state = createInitialUniversalFormState("engineering");
    expect(state.executionState).toBe("idle");
    expect(state.schemaState.schema).toBeNull();
  });

  it("transitions schema_loading -> schema_ready on VALIDATE_SCHEMA_CONTRACT (no errors)", () => {
    const state = createInitialUniversalFormState("engineering");
    const next = universalFormMachineReducer(state, {
      type: "VALIDATE_SCHEMA_CONTRACT",
      errors: [],
    });
    expect(next.executionState).toBe("schema_ready");
    expect(next.schemaState.validation_status).toBe("valid");
  });

  it("transitions schema_loading -> schema_rejected on VALIDATE_SCHEMA_CONTRACT (with errors)", () => {
    const state = createInitialUniversalFormState("engineering");
    const next = universalFormMachineReducer(state, {
      type: "VALIDATE_SCHEMA_CONTRACT",
      errors: ["Missing form_runtime_binding.renderer"],
    });
    expect(next.executionState).toBe("schema_rejected");
    expect(next.schemaState.validation_status).toBe("invalid");
  });

  it("transitions idle -> input_draft on SET_PROFILE_MODE", () => {
    const state = createInitialUniversalFormState("engineering");
    const next = universalFormMachineReducer(state, {
      type: "SET_PROFILE_MODE",
      mode: "cost",
    });
    expect(next.profileModeState.mode).toBe("cost");
    expect(next.executionState).toBe("input_draft");
  });

  it("transitions any -> executing on SUBMIT_SERVER_EXECUTION", () => {
    const state = createInitialUniversalFormState("engineering");
    const next = universalFormMachineReducer(state, {
      type: "SUBMIT_SERVER_EXECUTION",
    });
    expect(next.executionState).toBe("executing");
  });

  it("transitions executing -> server_ok on RECEIVE_SERVER_RESPONSE (status OK)", () => {
    const state = createInitialUniversalFormState("engineering");
    const next = universalFormMachineReducer(state, {
      type: "SUBMIT_SERVER_EXECUTION",
    });
    const result = universalFormMachineReducer(next, {
      type: "RECEIVE_SERVER_RESPONSE",
      response: {
        status: "OK",
        pipeline_state: "OK",
        outputs: [],
        warnings: [],
        normalized_input_audit: [],
        sensitivity: [],
        scenario_compare: null,
        fmea_summary: null,
        proof_pack_public: { enabled: false, redaction_status: "PUBLIC_SAFE_REDACTED", sections: [] },
        decision_interpretation: {
          primary_decision: "OK",
          primary_reason: "All checks passed",
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
          executed_at: new Date().toISOString(),
          redaction_status: "PUBLIC_SAFE_REDACTED",
          signature_status: "UNSIGNED",
        },
        redaction_status: "PUBLIC_SAFE_REDACTED",
      },
    });
    expect(result.executionState).toBe("server_ok");
    expect(result.serverResponseState.response?.status).toBe("OK");
  });

  it("transitions executing -> server_blocked on RECEIVE_SERVER_BLOCKERS", () => {
    const state = createInitialUniversalFormState("engineering");
    const next = universalFormMachineReducer(state, {
      type: "SUBMIT_SERVER_EXECUTION",
    });
    const result = universalFormMachineReducer(next, {
      type: "RECEIVE_SERVER_BLOCKERS",
      blockers: [{
        id: "BLOCK_001",
        severity: "BLOCKER",
        affected_input_id: "input_1",
        message: "Critical input missing",
        why_it_matters: "Calculation cannot proceed.",
        suggested_action: "Provide the missing value.",
      }],
    });
    expect(result.executionState).toBe("server_blocked");
  });

  it("resets inputs preserving schema on RESET_INPUTS", () => {
    const state = createInitialUniversalFormState("engineering");
    const withSchema = universalFormMachineReducer(state, {
      type: "INIT_SCHEMA",
      schema: {
        tool_id: "test",
        tool_key: "test",
        tool_name: "Test",
        category: "test",
        scope: "test",
        primary_operation: "test",
        decision_context: {},
        irreversible_commitment_metric: "cost",
        standards: [],
        standards_clause_map: [],
        reference_status: "CONTEXT_ONLY",
        risk_level: "LOW",
        brand_safety_policy: {},
        calculation_basis: {},
        unit_system: {},
        unit_conversion_contract: { conversion_registry: {} },
        inputs: [{
          id: "required_value",
          name: "Required Value",
          symbol: "RV",
          quantity_kind: "number",
          unit_selectable: false,
          base_unit: "unit",
          allowed_display_units: ["unit"],
          normalized_id: "n_required_value",
          type: "number",
          required: true,
          criticality: "CRITICAL",
          physical_hard_bounds: {
            min: 1,
            max: 100,
            unit: "unit",
            basis: "PROCESS_LIMIT",
            violation_behavior: "BLOCK",
          },
          default_policy: "NO_DEFAULT",
          default_value: null,
          reference_values: [],
          evidence_requirement: "required",
          formula_bindings: [],
          output_bindings: [],
        }],
        normalized_inputs: [],
        reference_value_policy: {},
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
          profile_modes: ["quick", "engineering", "cost", "audit"],
          input_groups: [],
          sticky_decision_cockpit: true,
          mobile_bottom_action_bar: true,
          normalized_preview_required: true,
          reference_values_visible: true,
          evidence_controls_required: true,
          semantic_error_summary_required: true,
          safety_factor_gauges_required: true,
          hidden_risk_panel_required: true,
          business_impact_panel_required: true,
          standards_clause_panel_required: true,
          protected_methodology_panel_required: true,
          audit_seal_panel_required: true,
          accessibility: {},
        },
        reference_code: {},
        test_plan: {},
        red_team_review: {},
        metadata: { schema_version: "1.0.0", formula_version: "1.0.0" },
      },
      schema_hash: "abc123",
    });
    const validated = universalFormMachineReducer(withSchema, {
      type: "VALIDATE_SCHEMA_CONTRACT",
      errors: [],
    });
    expect(withSchema.rawInputState.required_value).toBeNull();
    expect(withSchema.evidenceState.required_value.user_verified).toBe(false);
    const edited = universalFormMachineReducer(validated, {
      type: "SET_INPUT_VALUE",
      input_id: "required_value",
      value: 42,
    });
    const reset = universalFormMachineReducer(edited, {
      type: "RESET_INPUTS",
    });
    expect(edited.rawInputState.required_value).toBe(42);
    expect(reset.rawInputState.required_value).toBeNull();
    expect(reset.evidenceState.required_value.user_verified).toBe(false);
    expect(reset.schemaState.schema).not.toBeNull();
    expect(reset.schemaState.schema_hash).toBe("abc123");
  });

  it("getExecutionStateLabel returns label for all states", () => {
    const states: Array<ReturnType<typeof createInitialUniversalFormState>["executionState"]> = [
      "idle", "schema_loading", "schema_ready", "schema_rejected", "input_draft",
      "unit_dirty", "normalized_preview_ready", "reference_range_warning",
      "evidence_gap", "client_precheck_blocked", "ready_to_execute",
      "executing", "server_ok", "server_review", "server_blocked",
      "server_reprice", "server_reject", "server_hold",
      "public_response_redacted", "export_ready", "audit_sealed", "error",
    ];
    for (const s of states) {
      expect(getExecutionStateLabel(s).length).toBeGreaterThan(0);
    }
  });

  it("client_precheck_blocked state blocks execution", () => {
    const state = createInitialUniversalFormState("engineering");
    const blocked = universalFormMachineReducer(state, {
      type: "BLOCK_CLIENT_EXECUTION",
      blockers: [{
        id: "BLOCKER_001",
        severity: "BLOCKER",
        message: "Required input missing",
        suggested_action: "Enter a value.",
      }],
    });
    expect(blocked.executionState).toBe("client_precheck_blocked");
    expect(blocked.blockerState.can_execute).toBe(false);
  });

  it("RUN_CLIENT_PRECHECK with no blockers sets can_execute true", () => {
    const state = createInitialUniversalFormState("engineering");
    const ready = universalFormMachineReducer(state, {
      type: "RUN_CLIENT_PRECHECK",
      issues: [],
    });
    expect(ready.executionState).toBe("ready_to_execute");
    expect(ready.blockerState.can_execute).toBe(true);
  });
});
