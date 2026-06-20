// Auto-generated from deep-fry-calculator-schema.json
import * as z from 'zod';

export interface Deep_fry_calculatorInput {
  oilVolume: number;
  initialTemp: number;
  fryingTemp: number;
  fryingTime: number;
  fryerPower: number;
  electricityCost: number;
  oilCostPerLiter: number;
  oilLifeBatches: number;
  dataConfidence?: number;
}

export const Deep_fry_calculatorInputSchema = z.object({
  oilVolume: z.number().default(20),
  initialTemp: z.number().default(20),
  fryingTemp: z.number().default(180),
  fryingTime: z.number().default(10),
  fryerPower: z.number().default(3.5),
  electricityCost: z.number().default(0.15),
  oilCostPerLiter: z.number().default(1.5),
  oilLifeBatches: z.number().default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Deep_fry_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oilVolume * 0.92; results["mass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mass"] = Number.NaN; }
  try { const v = input.fryingTemp - input.initialTemp; results["deltaT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deltaT"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["mass"])) * 1.67 * (toNumericFormulaValue(results["deltaT"])) / 3600; results["energyHeating"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyHeating"] = Number.NaN; }
  try { const v = input.fryerPower * (input.fryingTime / 60); results["energyFrying"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyFrying"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyHeating"])) + (toNumericFormulaValue(results["energyFrying"])); results["totalEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalEnergy"])) * input.electricityCost; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCost"] = Number.NaN; }
  try { const v = (input.oilVolume * input.oilCostPerLiter) / input.oilLifeBatches; results["oilCostPerBatch"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oilCostPerBatch"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyCost"])) + (toNumericFormulaValue(results["oilCostPerBatch"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateDeep_fry_calculator(input: Deep_fry_calculatorInput): Deep_fry_calculatorOutput {
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


export interface Deep_fry_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
