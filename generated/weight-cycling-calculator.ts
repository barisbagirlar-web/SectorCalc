// Auto-generated from weight-cycling-calculator-schema.json
import * as z from 'zod';

export interface Weight_cycling_calculatorInput {
  mass: number;
  height: number;
  cyclesPerDay: number;
  operatingDays: number;
  efficiency: number;
  energyCost: number;
  dataConfidence?: number;
}

export const Weight_cycling_calculatorInputSchema = z.object({
  mass: z.number().default(100),
  height: z.number().default(5),
  cyclesPerDay: z.number().default(100),
  operatingDays: z.number().default(250),
  efficiency: z.number().default(90),
  energyCost: z.number().default(0.15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weight_cycling_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mass * 9.81 * input.height) / (3.6e6) / (input.efficiency / 100); results["energyPerCycle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energyPerCycle"] = 0; }
  try { const v = input.cyclesPerDay * input.operatingDays; results["totalCycles"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCycles"] = 0; }
  try { const v = (asFormulaNumber(results["energyPerCycle"])) * (asFormulaNumber(results["totalCycles"])); results["totalEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEnergy"] = 0; }
  try { const v = (asFormulaNumber(results["totalEnergy"])) * input.energyCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWeight_cycling_calculator(input: Weight_cycling_calculatorInput): Weight_cycling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["energyPerCycle"]);
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


export interface Weight_cycling_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
