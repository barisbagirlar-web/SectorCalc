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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Nootropic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.caffeine*0.5 + input.ltheanine*0.3 + input.piracetam*0.2 + input.alphagpc*0.4) / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["score"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["score"] = 0; }
  try { const v = input.caffeine*0.5 / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["caffeineContrib"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caffeineContrib"] = 0; }
  try { const v = input.ltheanine*0.3 / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["ltheanineContrib"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ltheanineContrib"] = 0; }
  try { const v = input.piracetam*0.2 / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["piracetamContrib"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["piracetamContrib"] = 0; }
  try { const v = input.alphagpc*0.4 / (input.bodyWeight * (1 + input.tolerance * 0.1)); results["alphagpcContrib"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["alphagpcContrib"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNootropic_calculator(input: Nootropic_calculatorInput): Nootropic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["score"]));
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


export interface Nootropic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
