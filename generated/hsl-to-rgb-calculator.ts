// Auto-generated from hsl-to-rgb-calculator-schema.json
import * as z from 'zod';

export interface Hsl_to_rgb_calculatorInput {
  hue: number;
  saturation: number;
  lightness: number;
  max: number;
  dataConfidence?: number;
}

export const Hsl_to_rgb_calculatorInputSchema = z.object({
  hue: z.number().default(0),
  saturation: z.number().default(100),
  lightness: z.number().default(50),
  max: z.number().default(255),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hsl_to_rgb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hue / 360; results["h"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["h"] = Number.NaN; }
  try { const v = input.saturation / 100; results["s"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["s"] = Number.NaN; }
  try { const v = input.lightness / 100; results["l"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["l"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["l"])) < 0.5 ? (toNumericFormulaValue(results["l"])) * (1 + (toNumericFormulaValue(results["s"]))) : (toNumericFormulaValue(results["l"])) + (toNumericFormulaValue(results["s"])) - (toNumericFormulaValue(results["l"])) * (toNumericFormulaValue(results["s"])); results["q"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["q"] = Number.NaN; }
  try { const v = 2 * (toNumericFormulaValue(results["l"])) - (toNumericFormulaValue(results["q"])); results["p"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["p"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["h"])) + 1/3 < 0 ? (toNumericFormulaValue(results["h"])) + 1/3 + 1 : (toNumericFormulaValue(results["h"])) + 1/3 > 1 ? (toNumericFormulaValue(results["h"])) + 1/3 - 1 : (toNumericFormulaValue(results["h"])) + 1/3); results["adjustR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustR"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["h"])) < 0 ? (toNumericFormulaValue(results["h"])) + 1 : (toNumericFormulaValue(results["h"])) > 1 ? (toNumericFormulaValue(results["h"])) - 1 : (toNumericFormulaValue(results["h"]))); results["adjustG"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustG"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["h"])) - 1/3 < 0 ? (toNumericFormulaValue(results["h"])) - 1/3 + 1 : (toNumericFormulaValue(results["h"])) - 1/3 > 1 ? (toNumericFormulaValue(results["h"])) - 1/3 - 1 : (toNumericFormulaValue(results["h"])) - 1/3); results["adjustB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustB"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["s"])) === 0 ? (toNumericFormulaValue(results["l"])) : ((toNumericFormulaValue(results["adjustR"])) < 1/6 ? (toNumericFormulaValue(results["p"])) + ((toNumericFormulaValue(results["q"])) - (toNumericFormulaValue(results["p"]))) * 6 * (toNumericFormulaValue(results["adjustR"])) : (toNumericFormulaValue(results["adjustR"])) < 1/2 ? (toNumericFormulaValue(results["q"])) : (toNumericFormulaValue(results["adjustR"])) < 2/3 ? (toNumericFormulaValue(results["p"])) + ((toNumericFormulaValue(results["q"])) - (toNumericFormulaValue(results["p"]))) * (2/3 - (toNumericFormulaValue(results["adjustR"]))) * 6 : (toNumericFormulaValue(results["p"]))); results["r1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["r1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["s"])) === 0 ? (toNumericFormulaValue(results["l"])) : ((toNumericFormulaValue(results["adjustG"])) < 1/6 ? (toNumericFormulaValue(results["p"])) + ((toNumericFormulaValue(results["q"])) - (toNumericFormulaValue(results["p"]))) * 6 * (toNumericFormulaValue(results["adjustG"])) : (toNumericFormulaValue(results["adjustG"])) < 1/2 ? (toNumericFormulaValue(results["q"])) : (toNumericFormulaValue(results["adjustG"])) < 2/3 ? (toNumericFormulaValue(results["p"])) + ((toNumericFormulaValue(results["q"])) - (toNumericFormulaValue(results["p"]))) * (2/3 - (toNumericFormulaValue(results["adjustG"]))) * 6 : (toNumericFormulaValue(results["p"]))); results["g1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["g1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["s"])) === 0 ? (toNumericFormulaValue(results["l"])) : ((toNumericFormulaValue(results["adjustB"])) < 1/6 ? (toNumericFormulaValue(results["p"])) + ((toNumericFormulaValue(results["q"])) - (toNumericFormulaValue(results["p"]))) * 6 * (toNumericFormulaValue(results["adjustB"])) : (toNumericFormulaValue(results["adjustB"])) < 1/2 ? (toNumericFormulaValue(results["q"])) : (toNumericFormulaValue(results["adjustB"])) < 2/3 ? (toNumericFormulaValue(results["p"])) + ((toNumericFormulaValue(results["q"])) - (toNumericFormulaValue(results["p"]))) * (2/3 - (toNumericFormulaValue(results["adjustB"]))) * 6 : (toNumericFormulaValue(results["p"]))); results["b1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["b1"] = Number.NaN; }
  return results;
}


export function calculateHsl_to_rgb_calculator(input: Hsl_to_rgb_calculatorInput): Hsl_to_rgb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["b1"]);
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


export interface Hsl_to_rgb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
