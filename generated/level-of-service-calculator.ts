// Auto-generated from level-of-service-calculator-schema.json
import * as z from 'zod';

export interface Level_of_service_calculatorInput {
  meanDemandDdlt: number;
  stdDevDemandDdlt: number;
  reorderPoint: number;
  orderQuantity: number;
  dataConfidence?: number;
}

export const Level_of_service_calculatorInputSchema = z.object({
  meanDemandDdlt: z.number().default(1000),
  stdDevDemandDdlt: z.number().default(200),
  reorderPoint: z.number().default(1200),
  orderQuantity: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Level_of_service_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.reorderPoint - input.meanDemandDdlt) / input.stdDevDemandDdlt; results["z"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["z"] = 0; }
  try { const v = input.reorderPoint - input.meanDemandDdlt; results["safetyStock"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safetyStock"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLevel_of_service_calculator(input: Level_of_service_calculatorInput): Level_of_service_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["safetyStock"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Level_of_service_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
