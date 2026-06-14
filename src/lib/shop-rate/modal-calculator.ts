import * as z from "zod";
import type { GeneratedCalculatorModule, GeneratedToolResult } from "@/lib/generated-tools/types";

export const ShopRateHourlyCostCalculatorInputSchema = z.object({
  directLaborCostPerHour: z.number().min(0).default(25),
  overheadRate: z.number().min(0).default(150),
  machineCostPerHour: z.number().min(0).default(10),
  materialCostPerUnit: z.number().min(0).default(5),
  productionRatePerHour: z.number().min(0.001).default(10),
  defectRate: z.number().min(0).max(100).default(2),
  utilizationRate: z.number().min(0).max(100).default(85),
  profitMargin: z.number().min(0).default(20),
  dataConfidence: z.enum(["low", "medium", "high"]).default("medium"),
});

export type ShopRateHourlyCostCalculatorInput = z.infer<
  typeof ShopRateHourlyCostCalculatorInputSchema
>;

function evaluateShopRateFormulas(
  input: ShopRateHourlyCostCalculatorInput,
): Record<string, number> {
  const effectiveLaborCostPerHour = input.directLaborCostPerHour * (1 + input.overheadRate / 100);
  const costPerUnitLabor = effectiveLaborCostPerHour / input.productionRatePerHour;
  const costPerUnitMachine = input.machineCostPerHour / input.productionRatePerHour;
  const costPerUnitMaterial = input.materialCostPerUnit;
  const totalCostPerUnit = costPerUnitLabor + costPerUnitMachine + costPerUnitMaterial;
  const yieldRate = 1 - input.defectRate / 100;
  const adjustedCostPerUnit = totalCostPerUnit / yieldRate;
  const shopRatePerHour =
    (adjustedCostPerUnit *
      input.productionRatePerHour *
      (1 + input.profitMargin / 100)) /
    (input.utilizationRate / 100);
  const dataConfidenceAdjusted =
    shopRatePerHour *
    (1 +
      (input.dataConfidence === "low"
        ? 0.1
        : input.dataConfidence === "medium"
          ? 0.05
          : 0));

  return {
    effectiveLaborCostPerHour,
    costPerUnitLabor,
    costPerUnitMachine,
    costPerUnitMaterial,
    totalCostPerUnit,
    yieldRate,
    adjustedCostPerUnit,
    shopRatePerHour,
    dataConfidenceAdjusted,
  };
}

export function calculateShopRateHourlyCostCalculator(
  rawInput: Record<string, unknown>,
): GeneratedToolResult {
  const input = ShopRateHourlyCostCalculatorInputSchema.parse(rawInput);
  const computed = evaluateShopRateFormulas(input);

  const hiddenLossDrivers: string[] = [];
  if (input.defectRate > 5) {
    hiddenLossDrivers.push("High defect rate increases cost per good unit");
  }
  if (input.utilizationRate < 70) {
    hiddenLossDrivers.push("Low utilization inflates hourly rate");
  }

  const suggestedActions: string[] = [];
  if (input.defectRate > 5) {
    suggestedActions.push("Implement SPC and root cause analysis to reduce defects");
  }
  if (input.utilizationRate < 70) {
    suggestedActions.push("Conduct OEE analysis to improve equipment effectiveness");
  }
  if (input.overheadRate > 200) {
    suggestedActions.push("Review overhead allocation and reduce non-value-added activities");
  }

  return {
    ...computed,
    breakdown: {
      effectiveLaborCostPerHour: computed.effectiveLaborCostPerHour,
      costPerUnitLabor: computed.costPerUnitLabor,
      costPerUnitMachine: computed.costPerUnitMachine,
      costPerUnitMaterial: computed.costPerUnitMaterial,
      totalCostPerUnit: computed.totalCostPerUnit,
      yieldRate: computed.yieldRate,
      adjustedCostPerUnit: computed.adjustedCostPerUnit,
    },
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted: computed.dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export", "CSV Export", "Trend Analysis", "Benchmark Comparison"],
  };
}

export const SHOP_RATE_MODAL_CALCULATOR: GeneratedCalculatorModule = {
  inputSchema: ShopRateHourlyCostCalculatorInputSchema,
  calculate: calculateShopRateHourlyCostCalculator,
};
