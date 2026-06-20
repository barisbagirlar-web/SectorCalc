// Auto-generated from drying-calculator-schema.json
import * as z from 'zod';

export interface Drying_calculatorInput {
  initialMoisture: number;
  finalMoisture: number;
  materialMass: number;
  dryingTime: number;
  energyConsumption: number;
  energyCost: number;
  dataConfidence?: number;
}

export const Drying_calculatorInputSchema = z.object({
  initialMoisture: z.number().default(50),
  finalMoisture: z.number().default(10),
  materialMass: z.number().default(1000),
  dryingTime: z.number().default(8),
  energyConsumption: z.number().default(1.5),
  energyCost: z.number().default(0.12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drying_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialMass * (input.initialMoisture - input.finalMoisture) / 100; results["waterToRemove"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterToRemove"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["waterToRemove"])) * input.energyConsumption; results["totalEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalEnergy"])) * input.energyCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["waterToRemove"])) / input.dryingTime; results["dryingRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dryingRate"] = Number.NaN; }
  return results;
}


export function calculateDrying_calculator(input: Drying_calculatorInput): Drying_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Drying_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
