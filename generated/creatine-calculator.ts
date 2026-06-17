// Auto-generated from creatine-calculator-schema.json
import * as z from 'zod';

export interface Creatine_calculatorInput {
  totalUnits: number;
  dosagePerUnit: number;
  lossRate: number;
  purity: number;
  costPerKg: number;
}

export const Creatine_calculatorInputSchema = z.object({
  totalUnits: z.number().default(1000),
  dosagePerUnit: z.number().default(5),
  lossRate: z.number().default(2),
  purity: z.number().default(99),
  costPerKg: z.number().default(500),
});

function evaluateAllFormulas(input: Creatine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dosagePerUnit / (input.purity / 100); results["netDosagePerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["netDosagePerUnit"] = 0; }
  try { const v = (input.totalUnits * (results["netDosagePerUnit"] ?? 0)) / 1000; results["totalTheoreticalKg"] = Number.isFinite(v) ? v : 0; } catch { results["totalTheoreticalKg"] = 0; }
  try { const v = (results["totalTheoreticalKg"] ?? 0) / (1 - input.lossRate / 100); results["totalNeededKg"] = Number.isFinite(v) ? v : 0; } catch { results["totalNeededKg"] = 0; }
  try { const v = (results["totalNeededKg"] ?? 0) * input.costPerKg; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  results["__totalNeededKg__kg"] = 0;
  results["__totalCost__TL"] = 0;
  return results;
}


export function calculateCreatine_calculator(input: Creatine_calculatorInput): Creatine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netDosagePerUnit"] ?? 0;
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


export interface Creatine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
