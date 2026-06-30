import { describe, expect, it } from "vitest";
import {
  calculateEOQOptimizer,
  mapInventoryToolInputsToEOQ,
} from "@/lib/features/inventory/eoq-optimizer";

describe("eoq optimizer", () => {
  it("calculates EOQ, reorder point and safety stock", () => {
    const output = calculateEOQOptimizer({
      annualDemand: 10000,
      orderingCost: 50,
      holdingCostRate: 20,
      unitCost: 10,
      leadTimeDays: 7,
      workingDaysPerYear: 250,
      demandStdDev: 5,
      leadTimeStdDev: 0,
      serviceLevel: 95,
    });

    expect(output.eoq).toBeGreaterThan(0);
    expect(output.reorderPoint).toBeGreaterThanOrEqual(output.safetyStock);
    expect(output.totalCost).toBeGreaterThan(0);
  });

  it("maps inventory tool inputs into optimizer defaults", () => {
    expect(
      mapInventoryToolInputsToEOQ({
        annualDemand: 12000,
        orderingCost: 80,
        unitCost: 25,
        carryingCostRate: 18,
        leadTimeDays: 10,
        workingDaysPerYear: 260,
      }),
    ).toEqual({
      annualDemand: 12000,
      orderingCost: 80,
      unitCost: 25,
      holdingCostRate: 18,
      leadTimeDays: 10,
      workingDaysPerYear: 260,
    });
  });
});
