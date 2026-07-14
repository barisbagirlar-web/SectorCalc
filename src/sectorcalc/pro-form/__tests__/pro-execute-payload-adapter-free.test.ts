import { describe, expect, it } from "vitest";
import {
  breakEvenFormToSchemaMap,
  buildExecutePayload,
  getFormToSchemaMap,
} from "../pro-execute-payload-adapter";

describe("form-to-schema execute payload adapter", () => {
  it("materializes a guarded identity map for a certified Free tool", () => {
    const map = getFormToSchemaMap("cnc-shop-hourly-rate");
    expect(map).not.toBeNull();

    const payload = buildExecutePayload({
      formState: {
        annual_admin_allocation: 12000,
        annual_available_machine_hours: 1800,
        annual_depreciation: 24000,
      },
      selectedUnits: {},
      toolKey: "cnc-shop-hourly-rate",
      toolId: "FREE_V531_002",
      schemaVersion: "5.3.1",
      formToSchemaMap: map!,
      userProfileMode: "quick",
    });

    expect(payload.raw_inputs).toEqual({
      annual_admin_allocation: 12000,
      annual_available_machine_hours: 1800,
      annual_depreciation: 24000,
    });
    expect(payload.selected_units).toEqual({});
    expect(payload.tool_key).toBe("cnc-shop-hourly-rate");
  });

  it("does not create an identity adapter for an unregistered tool", () => {
    expect(getFormToSchemaMap("not-a-certified-sectorcalc-tool")).toBeNull();
  });

  it("keeps Pro mappings explicit and rejects cross-tool form state", () => {
    expect(() => buildExecutePayload({
      formState: {
        initial_investment: 500000,
        annual_net_cash_flow: 250000,
        discount_rate: 0.4,
        analysis_years: 12,
        residual_value: 50000,
        stress_downside_factor: 0.8,
        labor_rate: 80000,
        overhead_rate: 30000,
        defect_or_loss_cost: 15000,
        source_confidence_ratio: 0.95,
        uncertainty_multiplier: 2,
        cross_tool_input: 1,
      },
      selectedUnits: {},
      toolKey: "break-even-survival-cash-calculator",
      toolId: "PRO_031",
      schemaVersion: "2.0.0",
      formToSchemaMap: breakEvenFormToSchemaMap,
    })).toThrow("FORM_SCHEMA_CONTRACT_VIOLATION");
  });
});
