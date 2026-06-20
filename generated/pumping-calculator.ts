// Auto-generated from pumping-calculator-schema.json
import * as z from 'zod';

export interface Pumping_calculatorInput {
  flowRate: number;
  head: number;
  fluidDensity: number;
  pumpEfficiency: number;
  motorEfficiency: number;
  operatingHours: number;
  dataConfidence?: number;
}

export const Pumping_calculatorInputSchema = z.object({
  flowRate: z.number().default(100),
  head: z.number().default(20),
  fluidDensity: z.number().default(1000),
  pumpEfficiency: z.number().default(75),
  motorEfficiency: z.number().default(90),
  operatingHours: z.number().default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pumping_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.flowRate * input.head * input.fluidDensity * 9.81) / 3600000; results["hydraulicPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hydraulicPower"] = Number.NaN; }
  try { const v = (input.flowRate * input.head * input.fluidDensity * 9.81) / (3600000 * (input.pumpEfficiency / 100)); results["shaftPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shaftPower"] = Number.NaN; }
  try { const v = (input.flowRate * input.head * input.fluidDensity * 9.81) / (3600000 * (input.pumpEfficiency / 100) * (input.motorEfficiency / 100)); results["motorPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["motorPower"] = Number.NaN; }
  try { const v = (input.flowRate * input.head * input.fluidDensity * 9.81 * input.operatingHours) / (3600000 * (input.pumpEfficiency / 100) * (input.motorEfficiency / 100)); results["dailyEnergyConsumption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyEnergyConsumption"] = Number.NaN; }
  return results;
}


export function calculatePumping_calculator(input: Pumping_calculatorInput): Pumping_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["motorPower"]);
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


export interface Pumping_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
