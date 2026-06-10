import { describe, expect, test } from "vitest";
import { getRequiredInputs, getVisibleInputs } from "@/lib/smart-form/requirements";
import { getSmartFormDefinition } from "@/lib/smart-form/scenarios";
import { validateSmartForm } from "@/lib/smart-form/validation";

describe("dynamic smart form requirements", () => {
  test("CNC quick scenario hides advanced inputs in simple mode", () => {
    const definition = getSmartFormDefinition("cnc-quote-risk-analyzer");
    expect(definition).not.toBeNull();
    const visible = getVisibleInputs(definition!, {}, "simple", "quick_quote_check");
    expect(visible.map((input) => input.key).sort()).toEqual(
      ["cycleTime", "machineRate", "quantity", "riskMargin", "setupTime"].sort(),
    );
  });

  test("Welding production scenario requires consumables", () => {
    const definition = getSmartFormDefinition("welding-bid-risk-analyzer");
    expect(definition).not.toBeNull();
    const required = getRequiredInputs(
      definition!,
      {
        materialCost: 100,
        laborHours: 4,
        laborRate: 50,
        gasConsumableCost: 20,
        fitUpHours: 1,
        reworkRiskPercent: 10,
        targetMargin: 25,
      },
      "advanced",
      "production_weld_bid",
    );
    expect(required.map((input) => input.key)).toContain("gasConsumableCost");
  });

  test("blocks CNC calculation when machine rate is zero", () => {
    const definition = getSmartFormDefinition("cnc-quote-risk-analyzer");
    const result = validateSmartForm(
      definition!,
      {
        setupTime: 30,
        cycleTime: 5,
        quantity: 10,
        machineRate: 0,
        riskMargin: 15,
      },
      "simple",
      "quick_quote_check",
    );
    expect(result.ok).toBe(false);
    expect(result.invalid.some((item) => item.key === "machineRate")).toBe(true);
  });

  test("blocks missing required HVAC inputs", () => {
    const definition = getSmartFormDefinition("hvac-project-margin-guard");
    const result = validateSmartForm(
      definition!,
      {
        equipmentCost: 5000,
        laborHours: "",
        laborRate: 75,
        callbackRiskPercent: 8,
        targetMargin: 22,
      },
      "simple",
      "small_service_job",
    );
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("laborHours");
  });
});
