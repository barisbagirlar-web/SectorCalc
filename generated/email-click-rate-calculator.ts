// Auto-generated from email-click-rate-calculator-schema.json
import * as z from 'zod';

export interface Email_click_rate_calculatorInput {
  totalClicks: number;
  totalDelivered: number;
  totalOpens: number;
  totalSent: number;
  bouncedEmails: number;
}

export const Email_click_rate_calculatorInputSchema = z.object({
  totalClicks: z.number().default(0),
  totalDelivered: z.number().default(0),
  totalOpens: z.number().default(0),
  totalSent: z.number().default(0),
  bouncedEmails: z.number().default(0),
});

function evaluateAllFormulas(input: Email_click_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalClicks / input.totalDelivered) * 100; results["clickRate"] = Number.isFinite(v) ? v : 0; } catch { results["clickRate"] = 0; }
  try { const v = (input.totalClicks / input.totalOpens) * 100; results["clickToOpenRate"] = Number.isFinite(v) ? v : 0; } catch { results["clickToOpenRate"] = 0; }
  try { const v = ((input.totalSent - input.bouncedEmails) / input.totalSent) * 100; results["deliveryRate"] = Number.isFinite(v) ? v : 0; } catch { results["deliveryRate"] = 0; }
  return results;
}


export function calculateEmail_click_rate_calculator(input: Email_click_rate_calculatorInput): Email_click_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["clickRate"] ?? 0;
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


export interface Email_click_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
