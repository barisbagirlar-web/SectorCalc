// Auto-generated from afp-calculator-schema.json
import * as z from 'zod';

export interface Afp_calculatorInput {
  fuelPrice: number;
  annualDistance: number;
  fuelConsumption: number;
  maintenanceCost: number;
  insuranceCost: number;
  taxCost: number;
  otherCost: number;
  dataConfidence?: number;
}

export const Afp_calculatorInputSchema = z.object({
  fuelPrice: z.number().default(20),
  annualDistance: z.number().default(20000),
  fuelConsumption: z.number().default(7),
  maintenanceCost: z.number().default(3000),
  insuranceCost: z.number().default(2500),
  taxCost: z.number().default(1500),
  otherCost: z.number().default(1000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Afp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelPrice * (input.annualDistance / 100) * input.fuelConsumption + input.maintenanceCost + input.insuranceCost + input.taxCost + input.otherCost; results["totalAnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAnnualCost"] = 0; }
  try { const v = input.fuelPrice * (input.annualDistance / 100) * input.fuelConsumption; results["fuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelCost"] = 0; }
  try { const v = input.maintenanceCost + input.insuranceCost + input.taxCost + input.otherCost; results["otherAnnualCosts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["otherAnnualCosts"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAfp_calculator(input: Afp_calculatorInput): Afp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalAnnualCost"]);
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


export interface Afp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
