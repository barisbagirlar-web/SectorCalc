// Auto-generated from water-heater-calculator-schema.json
import * as z from 'zod';

export interface Water_heater_calculatorInput {
  volume: number;
  coldTemp: number;
  hotTemp: number;
  power: number;
  efficiency: number;
  electricityCost: number;
  dataConfidence?: number;
}

export const Water_heater_calculatorInputSchema = z.object({
  volume: z.number().default(150),
  coldTemp: z.number().default(15),
  hotTemp: z.number().default(60),
  power: z.number().default(3),
  efficiency: z.number().default(95),
  electricityCost: z.number().default(0.15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Water_heater_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volume * input.electricityCost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.volume * input.electricityCost * (1 + (input.efficiency / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.volume * input.electricityCost * (1 + (input.efficiency / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateWater_heater_calculator(input: Water_heater_calculatorInput): Water_heater_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface Water_heater_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
