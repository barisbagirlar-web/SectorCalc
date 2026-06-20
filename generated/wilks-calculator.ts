// Auto-generated from wilks-calculator-schema.json
import * as z from 'zod';

export interface Wilks_calculatorInput {
  bodyWeight: number;
  liftedWeight: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Wilks_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(83),
  liftedWeight: z.number().default(100),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wilks_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 500 / (-216.0475144 + 16.2606339 * input.bodyWeight - 0.002388645 * input.bodyWeight**2 - 0.00113732 * input.bodyWeight**3 + 7.01863e-6 * input.bodyWeight**4 - 1.291e-8 * input.bodyWeight**5); results["coefficient"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coefficient"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["coefficient"])) * input.liftedWeight; results["wilksScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wilksScore"] = Number.NaN; }
  try { const v = input.bodyWeight; results["bodyWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bodyWeight"] = Number.NaN; }
  try { const v = input.liftedWeight; results["liftedWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["liftedWeight"] = Number.NaN; }
  return results;
}


export function calculateWilks_calculator(input: Wilks_calculatorInput): Wilks_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["wilksScore"]);
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


export interface Wilks_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
