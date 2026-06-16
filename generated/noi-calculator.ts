// Auto-generated from noi-calculator-schema.json
import * as z from 'zod';

export interface Noi_calculatorInput {
  grossRentalIncome: number;
  vacancyLoss: number;
  propertyManagementFees: number;
  repairsMaintenance: number;
  propertyTaxes: number;
  insurance: number;
  utilities: number;
  otherOperatingExpenses: number;
}

export const Noi_calculatorInputSchema = z.object({
  grossRentalIncome: z.number().default(100000),
  vacancyLoss: z.number().default(5000),
  propertyManagementFees: z.number().default(8000),
  repairsMaintenance: z.number().default(6000),
  propertyTaxes: z.number().default(10000),
  insurance: z.number().default(4000),
  utilities: z.number().default(3000),
  otherOperatingExpenses: z.number().default(2000),
});

function evaluateAllFormulas(input: Noi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossRentalIncome - input.vacancyLoss; results["effectiveGrossIncome"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveGrossIncome"] = 0; }
  try { const v = input.propertyManagementFees + input.repairsMaintenance + input.propertyTaxes + input.insurance + input.utilities + input.otherOperatingExpenses; results["totalOperatingExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["totalOperatingExpenses"] = 0; }
  try { const v = (results["effectiveGrossIncome"] ?? 0) - (results["totalOperatingExpenses"] ?? 0); results["netOperatingIncome"] = Number.isFinite(v) ? v : 0; } catch { results["netOperatingIncome"] = 0; }
  return results;
}


export function calculateNoi_calculator(input: Noi_calculatorInput): Noi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netOperatingIncome"] ?? 0;
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


export interface Noi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
