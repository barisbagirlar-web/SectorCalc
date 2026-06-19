// Auto-generated from og-fg-calculator-schema.json
import * as z from 'zod';

export interface Og_fg_calculatorInput {
  ogReading: number;
  fgReading: number;
  ogTemp: number;
  fgTemp: number;
  calibTemp: number;
  dataConfidence?: number;
}

export const Og_fg_calculatorInputSchema = z.object({
  ogReading: z.number().default(1.05),
  fgReading: z.number().default(1.01),
  ogTemp: z.number().default(20),
  fgTemp: z.number().default(20),
  calibTemp: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Og_fg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ogReading * (1.00130346 - 0.000134722124 * input.ogTemp + 0.00000204052596 * input.ogTemp**2 - 0.00000000232820948 * input.ogTemp**3) / (1.00130346 - 0.000134722124 * input.calibTemp + 0.00000204052596 * input.calibTemp**2 - 0.00000000232820948 * input.calibTemp**3); results["correctedOg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctedOg"] = 0; }
  try { const v = input.fgReading * (1.00130346 - 0.000134722124 * input.fgTemp + 0.00000204052596 * input.fgTemp**2 - 0.00000000232820948 * input.fgTemp**3) / (1.00130346 - 0.000134722124 * input.calibTemp + 0.00000204052596 * input.calibTemp**2 - 0.00000000232820948 * input.calibTemp**3); results["correctedFg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctedFg"] = 0; }
  try { const v = ((asFormulaNumber(results["correctedOg"])) - (asFormulaNumber(results["correctedFg"]))) * 131.25; results["abv"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["abv"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOg_fg_calculator(input: Og_fg_calculatorInput): Og_fg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["correctedOg"]);
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


export interface Og_fg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
