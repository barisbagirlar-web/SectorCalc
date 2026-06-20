// Auto-generated from creatine-calculator-schema.json
import * as z from 'zod';

export interface Creatine_calculatorInput {
  totalUnits: number;
  dosagePerUnit: number;
  lossRate: number;
  purity: number;
  costPerKg: number;
  dataConfidence?: number;
}

export const Creatine_calculatorInputSchema = z.object({
  totalUnits: z.number().default(1000),
  dosagePerUnit: z.number().default(5),
  lossRate: z.number().default(2),
  purity: z.number().default(99),
  costPerKg: z.number().default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Creatine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dosagePerUnit / (input.purity / 100); results["netDosagePerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netDosagePerUnit"] = Number.NaN; }
  try { const v = (input.totalUnits * (toNumericFormulaValue(results["netDosagePerUnit"]))) / 1000; results["totalTheoreticalKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTheoreticalKg"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTheoreticalKg"])) / (1 - input.lossRate / 100); results["totalNeededKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalNeededKg"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalNeededKg"])) * input.costPerKg; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateCreatine_calculator(input: Creatine_calculatorInput): Creatine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netDosagePerUnit"]);
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


export interface Creatine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
