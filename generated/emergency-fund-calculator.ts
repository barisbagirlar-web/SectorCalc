// Auto-generated from emergency-fund-calculator-schema.json
import * as z from 'zod';

export interface Emergency_fund_calculatorInput {
  monthlyExpenses: number;
  coverageMonths: number;
  currentSavings: number;
  safetyMargin: number;
  dataConfidence?: number;
}

export const Emergency_fund_calculatorInputSchema = z.object({
  monthlyExpenses: z.number().default(2000),
  coverageMonths: z.number().default(6),
  currentSavings: z.number().default(0),
  safetyMargin: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Emergency_fund_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyExpenses * input.coverageMonths * (1 + input.safetyMargin / 100); results["totalEmergencyFund"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEmergencyFund"] = 0; }
  try { const v = input.monthlyExpenses * input.coverageMonths * (input.safetyMargin / 100); results["safetyMarginAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safetyMarginAmount"] = 0; }
  try { const v = input.monthlyExpenses !== 0 ? input.currentSavings / (input.monthlyExpenses * (1 + input.safetyMargin / 100)) : 0; results["monthsCoveredByCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthsCoveredByCurrent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEmergency_fund_calculator(input: Emergency_fund_calculatorInput): Emergency_fund_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthsCoveredByCurrent"]);
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


export interface Emergency_fund_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
