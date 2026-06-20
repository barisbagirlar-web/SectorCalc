// Auto-generated from email-click-rate-calculator-schema.json
import * as z from 'zod';

export interface Email_click_rate_calculatorInput {
  totalClicks: number;
  totalDelivered: number;
  totalOpens: number;
  totalSent: number;
  bouncedEmails: number;
  dataConfidence?: number;
}

export const Email_click_rate_calculatorInputSchema = z.object({
  totalClicks: z.number().default(0),
  totalDelivered: z.number().default(0),
  totalOpens: z.number().default(0),
  totalSent: z.number().default(0),
  bouncedEmails: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Email_click_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalClicks / input.totalDelivered) * 100; results["clickRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["clickRate"] = Number.NaN; }
  try { const v = (input.totalClicks / input.totalOpens) * 100; results["clickToOpenRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["clickToOpenRate"] = Number.NaN; }
  try { const v = ((input.totalSent - input.bouncedEmails) / input.totalSent) * 100; results["deliveryRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deliveryRate"] = Number.NaN; }
  return results;
}


export function calculateEmail_click_rate_calculator(input: Email_click_rate_calculatorInput): Email_click_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["clickRate"]);
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


export interface Email_click_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
