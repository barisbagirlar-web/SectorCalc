// Auto-generated from fiscal-year-calculator-schema.json
import * as z from 'zod';

export interface Fiscal_year_calculatorInput {
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  fiscalStartMonth: number;
  fiscalStartDay: number;
}

export const Fiscal_year_calculatorInputSchema = z.object({
  currentYear: z.number().default(2025),
  currentMonth: z.number().default(1),
  currentDay: z.number().default(1),
  fiscalStartMonth: z.number().default(7),
  fiscalStartDay: z.number().default(1),
});

function evaluateAllFormulas(input: Fiscal_year_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentMonth < input.fiscalStartMonth || (input.currentMonth === input.fiscalStartMonth && input.currentDay < input.fiscalStartDay)) ? input.currentYear - 1 : input.currentYear; results["fiscalYear"] = Number.isFinite(v) ? v : 0; } catch { results["fiscalYear"] = 0; }
  try { const v = ((input.currentMonth - input.fiscalStartMonth + 12) % 12) + 1; results["fiscalMonth"] = Number.isFinite(v) ? v : 0; } catch { results["fiscalMonth"] = 0; }
  try { const v = Math.ceil((((input.currentMonth - input.fiscalStartMonth + 12) % 12) + 1) / 3); results["fiscalQuarter"] = Number.isFinite(v) ? v : 0; } catch { results["fiscalQuarter"] = 0; }
  return results;
}


export function calculateFiscal_year_calculator(input: Fiscal_year_calculatorInput): Fiscal_year_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fiscalYear"] ?? 0;
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


export interface Fiscal_year_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
