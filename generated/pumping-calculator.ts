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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pumping_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.flowRate * input.head * input.fluidDensity * 9.81) / 3600000; results["hydraulicPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hydraulicPower"] = 0; }
  try { const v = (input.flowRate * input.head * input.fluidDensity * 9.81) / (3600000 * (input.pumpEfficiency / 100)); results["shaftPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shaftPower"] = 0; }
  try { const v = (input.flowRate * input.head * input.fluidDensity * 9.81) / (3600000 * (input.pumpEfficiency / 100) * (input.motorEfficiency / 100)); results["motorPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["motorPower"] = 0; }
  try { const v = (input.flowRate * input.head * input.fluidDensity * 9.81 * input.operatingHours) / (3600000 * (input.pumpEfficiency / 100) * (input.motorEfficiency / 100)); results["dailyEnergyConsumption"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyEnergyConsumption"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePumping_calculator(input: Pumping_calculatorInput): Pumping_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["motorPower"]));
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


export interface Pumping_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
