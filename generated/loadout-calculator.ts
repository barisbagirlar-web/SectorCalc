// Auto-generated from loadout-calculator-schema.json
import * as z from 'zod';

export interface Loadout_calculatorInput {
  cargoWeight: number;
  vehicleCapacity: number;
  palletCount: number;
  palletWeight: number;
  safetyFactor: number;
  axleLimit: number;
  numberOfAxles: number;
  dataConfidence?: number;
}

export const Loadout_calculatorInputSchema = z.object({
  cargoWeight: z.number().default(0),
  vehicleCapacity: z.number().default(10000),
  palletCount: z.number().default(0),
  palletWeight: z.number().default(20),
  safetyFactor: z.number().default(1.1),
  axleLimit: z.number().default(5000),
  numberOfAxles: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Loadout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cargoWeight + input.palletCount * input.palletWeight) * input.safetyFactor; results["totalLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLoad"] = 0; }
  try { const v = ((input.cargoWeight + input.palletCount * input.palletWeight) * input.safetyFactor / input.vehicleCapacity) * 100; results["loadUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["loadUtilization"] = 0; }
  try { const v = input.vehicleCapacity - (input.cargoWeight + input.palletCount * input.palletWeight) * input.safetyFactor; results["remainingCapacity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["remainingCapacity"] = 0; }
  try { const v = ((input.cargoWeight + input.palletCount * input.palletWeight) * input.safetyFactor) / input.numberOfAxles; results["axleLoadPerAxle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["axleLoadPerAxle"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLoadout_calculator(input: Loadout_calculatorInput): Loadout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["loadUtilization"]);
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


export interface Loadout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
