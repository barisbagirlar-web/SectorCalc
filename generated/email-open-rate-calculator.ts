// @ts-nocheck
// Auto-generated from email-open-rate-calculator-schema.json
import * as z from 'zod';

export interface Email_open_rate_calculatorInput {
  sentCount: number;
  bounceCount: number;
  openCount: number;
  clickCount: number;
}

export const Email_open_rate_calculatorInputSchema = z.object({
  sentCount: z.number().default(1000),
  bounceCount: z.number().default(50),
  openCount: z.number().default(200),
  clickCount: z.number().default(80),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Email_open_rate_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.sentCount - input.bounceCount; results["deliveredFormula"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deliveredFormula"] = 0; }
  try { const v = (input.openCount / (input.sentCount - input.bounceCount)) * 100; results["openRateFormula"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["openRateFormula"] = 0; }
  try { const v = (input.clickCount / (input.sentCount - input.bounceCount)) * 100; results["clickRateFormula"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["clickRateFormula"] = 0; }
  try { const v = (input.clickCount / input.openCount) * 100; results["clickToOpenRateFormula"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["clickToOpenRateFormula"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEmail_open_rate_calculator(input: Email_open_rate_calculatorInput): Email_open_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deliveredFormula"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Email_open_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
