// Auto-generated from bilgi-orani-calculator-schema.json
import * as z from 'zod';

export interface Bilgi_orani_calculatorInput {
  portfoyGetiri: number;
  benchmarkGetiri: number;
  takipHatasi: number;
  yilliklastirmaCarpani: number;
  dataConfidence?: number;
}

export const Bilgi_orani_calculatorInputSchema = z.object({
  portfoyGetiri: z.number().default(0),
  benchmarkGetiri: z.number().default(0),
  takipHatasi: z.number().default(0),
  yilliklastirmaCarpani: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bilgi_orani_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.portfoyGetiri - input.benchmarkGetiri; results["ariziGetiri"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ariziGetiri"] = 0; }
  try { const v = (asFormulaNumber(results["ariziGetiri"])) * input.yilliklastirmaCarpani; results["yillikAriziGetiri"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yillikAriziGetiri"] = 0; }
  try { const v = input.takipHatasi * input.yilliklastirmaCarpani; results["yillikTakipHatasi"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yillikTakipHatasi"] = 0; }
  try { const v = (asFormulaNumber(results["ariziGetiri"])) / input.takipHatasi; results["bilgiOrani"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bilgiOrani"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBilgi_orani_calculator(input: Bilgi_orani_calculatorInput): Bilgi_orani_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bilgiOrani"]);
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


export interface Bilgi_orani_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
