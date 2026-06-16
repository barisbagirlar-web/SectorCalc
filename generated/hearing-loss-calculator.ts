// Auto-generated from hearing-loss-calculator-schema.json
import * as z from 'zod';

export interface Hearing_loss_calculatorInput {
  noise_level: number;
  exposure_hours: number;
  years_exposed: number;
  age: number;
}

export const Hearing_loss_calculatorInputSchema = z.object({
  noise_level: z.number().default(85),
  exposure_hours: z.number().default(8),
  years_exposed: z.number().default(10),
  age: z.number().default(30),
});

function evaluateAllFormulas(input: Hearing_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.noise_level + 10 * (Math.log(input.exposure_hours / 8) / Math.LN10)); results["twa"] = Number.isFinite(v) ? v : 0; } catch { results["twa"] = 0; }
  try { const v = Math.max(0, ((results["twa"] ?? 0) - 80) * input.years_exposed * 0.05); results["nihl"] = Number.isFinite(v) ? v : 0; } catch { results["nihl"] = 0; }
  try { const v = 0.5 * Math.max(0, input.age - 18); results["age_loss"] = Number.isFinite(v) ? v : 0; } catch { results["age_loss"] = 0; }
  try { const v = (results["nihl"] ?? 0) + (results["age_loss"] ?? 0); results["total_hearing_loss"] = Number.isFinite(v) ? v : 0; } catch { results["total_hearing_loss"] = 0; }
  return results;
}


export function calculateHearing_loss_calculator(input: Hearing_loss_calculatorInput): Hearing_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_hearing_loss"] ?? 0;
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


export interface Hearing_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
