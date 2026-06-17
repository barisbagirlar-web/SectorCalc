// Auto-generated from wilks-calculator-schema.json
import * as z from 'zod';

export interface Wilks_calculatorInput {
  bodyWeight: number;
  liftedWeight: number;
  auto_input_3: number;
}

export const Wilks_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(83),
  liftedWeight: z.number().default(100),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Wilks_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 500 / (-216.0475144 + 16.2606339 * input.bodyWeight - 0.002388645 * input.bodyWeight**2 - 0.00113732 * input.bodyWeight**3 + 7.01863e-6 * input.bodyWeight**4 - 1.291e-8 * input.bodyWeight**5); results["coefficient"] = Number.isFinite(v) ? v : 0; } catch { results["coefficient"] = 0; }
  try { const v = (results["coefficient"] ?? 0) * input.liftedWeight; results["wilksScore"] = Number.isFinite(v) ? v : 0; } catch { results["wilksScore"] = 0; }
  try { const v = input.bodyWeight; results["bodyWeight"] = Number.isFinite(v) ? v : 0; } catch { results["bodyWeight"] = 0; }
  try { const v = input.liftedWeight; results["liftedWeight"] = Number.isFinite(v) ? v : 0; } catch { results["liftedWeight"] = 0; }
  return results;
}


export function calculateWilks_calculator(input: Wilks_calculatorInput): Wilks_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["wilksScore"] ?? 0;
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


export interface Wilks_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
