// Auto-generated from customs-calculator-schema.json
import * as z from 'zod';

export interface Customs_calculatorInput {
  cifValue: number;
  dutyRate: number;
  vatRate: number;
  exciseRate: number;
  fixedFee: number;
  dataConfidence?: number;
}

export const Customs_calculatorInputSchema = z.object({
  cifValue: z.number().default(1000),
  dutyRate: z.number().default(10),
  vatRate: z.number().default(18),
  exciseRate: z.number().default(0),
  fixedFee: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Customs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cifValue * input.dutyRate / 100; results["totalDuty"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDuty"] = 0; }
  try { const v = (input.cifValue + (input.cifValue * input.dutyRate / 100)) * input.vatRate / 100; results["totalVAT"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVAT"] = 0; }
  try { const v = input.cifValue * input.exciseRate / 100; results["totalExcise"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalExcise"] = 0; }
  try { const v = input.fixedFee; results["totalFixedFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFixedFee"] = 0; }
  try { const v = input.cifValue * input.dutyRate / 100 + (input.cifValue + (input.cifValue * input.dutyRate / 100)) * input.vatRate / 100 + input.cifValue * input.exciseRate / 100 + input.fixedFee; results["totalCustomsCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCustomsCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCustoms_calculator(input: Customs_calculatorInput): Customs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCustomsCost"]));
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


export interface Customs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
