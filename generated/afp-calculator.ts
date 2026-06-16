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

function evaluateAllFormulas(input: Afp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelPrice * (input.annualDistance / 100) * input.fuelConsumption + input.maintenanceCost + input.insuranceCost + input.taxCost + input.otherCost; results["totalAnnualCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualCost"] = 0; }
  try { const v = input.fuelPrice * (input.annualDistance / 100) * input.fuelConsumption; results["fuelCost"] = Number.isFinite(v) ? v : 0; } catch { results["fuelCost"] = 0; }
  try { const v = input.maintenanceCost + input.insuranceCost + input.taxCost + input.otherCost; results["otherAnnualCosts"] = Number.isFinite(v) ? v : 0; } catch { results["otherAnnualCosts"] = 0; }
  return results;
}


export function calculateAfp_calculator(input: Afp_calculatorInput): Afp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalAnnualCost"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
