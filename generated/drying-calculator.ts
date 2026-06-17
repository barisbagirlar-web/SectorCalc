// @ts-nocheck
// Auto-generated from drying-calculator-schema.json
import * as z from 'zod';

export interface Drying_calculatorInput {
  initialMoisture: number;
  finalMoisture: number;
  materialMass: number;
  dryingTime: number;
  energyConsumption: number;
  energyCost: number;
}

export const Drying_calculatorInputSchema = z.object({
  initialMoisture: z.number().default(50),
  finalMoisture: z.number().default(10),
  materialMass: z.number().default(1000),
  dryingTime: z.number().default(8),
  energyConsumption: z.number().default(1.5),
  energyCost: z.number().default(0.12),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Drying_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.materialMass * (input.initialMoisture - input.finalMoisture) / 100; results["waterToRemove"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["waterToRemove"] = 0; }
  try { const v = (asFormulaNumber(results["waterToRemove"])) * input.energyConsumption; results["totalEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalEnergy"] = 0; }
  try { const v = (asFormulaNumber(results["totalEnergy"])) * input.energyCost; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["waterToRemove"])) / input.dryingTime; results["dryingRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dryingRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDrying_calculator(input: Drying_calculatorInput): Drying_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
