import { test, expect } from "vitest";
import { runPremiumSchemaEngine } from "@/lib/features/premium-schema/premium-schema-engine";
import { DYE_RECIPE_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/dye-recipe-cost-analyzer";

test("dye-recipe-cost-analyzer correctly calculates array inputs", () => {
  const inputs1 = {
    bathRatio: 10,
    fabricWeight: 100,
    dyeConcentrations: "1.5, 2.0",
    dyePrices: "20, 15",
    dosages: "1, 0.5",
    chemPrices: "5, 10",
    waterTariff: 3,
    heatingCost: 25,
    wasteTreatmentCost: 2,
    rftPct: 85,
    reworkCost: 75
  };

  const result1 = runPremiumSchemaEngine(DYE_RECIPE_COST_SCHEMA, inputs1, "en");
  
  // calculation manual check:
  // dot(dye) = 1.5 * 20 + 2.0 * 15 = 30 + 30 = 60
  // dyeCost = 60 * 10 * 100 / 1000 = 60
  // dot(chem) = 1 * 5 + 0.5 * 10 = 5 + 5 = 10
  // chemCost = 10 * 10 * 100 / 1000 = 10
  // totalBatchCost = 60 + 10 + 3 + 25 + 2 = 100
  
  const batchCostOut1 = result1.outputs.find(o => o.id === "totalBatchCost");
  expect(batchCostOut1?.raw).toBe(100);

  // If we change array inputs, result should change:
  const inputs2 = {
    ...inputs1,
    dyeConcentrations: "1.5, 3.0", // increased second dye
  };

  const result2 = runPremiumSchemaEngine(DYE_RECIPE_COST_SCHEMA, inputs2, "en");
  
  // dot(dye) = 1.5 * 20 + 3.0 * 15 = 30 + 45 = 75
  // dyeCost = 75 * 10 * 100 / 1000 = 75
  // totalBatchCost = 75 + 10 + 3 + 25 + 2 = 115
  
  const batchCostOut2 = result2.outputs.find(o => o.id === "totalBatchCost");
  expect(batchCostOut2?.raw).toBe(115);
  
  expect(batchCostOut2?.raw).not.toBe(batchCostOut1?.raw);
});
