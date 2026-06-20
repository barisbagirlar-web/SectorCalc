// Auto-generated from nootropic-calculator-schema.json
import * as z from 'zod';

export interface Nootropic_calculatorInput {
  caffeine: number;
  ltheanine: number;
  piracetam: number;
  alphagpc: number;
  bodyWeight: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Nootropic_calculatorInputSchema = z.object({
  caffeine: z.number().default(100),
  ltheanine: z.number().default(200),
  piracetam: z.number().default(1200),
  alphagpc: z.number().default(300),
  bodyWeight: z.number().default(70),
  tolerance: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nootropic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.caffeine*0.5 + input.ltheanine*0.3 + input.piracetam*0.2 + input.alphagpc*0.4) / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["score"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["score"] = Number.NaN; }
  try { const v = input.caffeine*0.5 / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["caffeineContrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caffeineContrib"] = Number.NaN; }
  try { const v = input.ltheanine*0.3 / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["ltheanineContrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ltheanineContrib"] = Number.NaN; }
  try { const v = input.piracetam*0.2 / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["piracetamContrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["piracetamContrib"] = Number.NaN; }
  try { const v = input.alphagpc*0.4 / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["alphagpcContrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alphagpcContrib"] = Number.NaN; }
  return results;
}


export function calculateNootropic_calculator(input: Nootropic_calculatorInput): Nootropic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["score"]);
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


export interface Nootropic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
