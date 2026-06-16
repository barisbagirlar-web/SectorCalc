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

function evaluateAllFormulas(input: Email_open_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sentCount - input.bounceCount; results["deliveredFormula"] = Number.isFinite(v) ? v : 0; } catch { results["deliveredFormula"] = 0; }
  try { const v = (input.openCount / (input.sentCount - input.bounceCount)) * 100; results["openRateFormula"] = Number.isFinite(v) ? v : 0; } catch { results["openRateFormula"] = 0; }
  try { const v = (input.clickCount / (input.sentCount - input.bounceCount)) * 100; results["clickRateFormula"] = Number.isFinite(v) ? v : 0; } catch { results["clickRateFormula"] = 0; }
  try { const v = (input.clickCount / input.openCount) * 100; results["clickToOpenRateFormula"] = Number.isFinite(v) ? v : 0; } catch { results["clickToOpenRateFormula"] = 0; }
  return results;
}


export function calculateEmail_open_rate_calculator(input: Email_open_rate_calculatorInput): Email_open_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["openRate"] ?? 0;
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


export interface Email_open_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
