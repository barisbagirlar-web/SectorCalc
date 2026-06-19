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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hsl_to_rgb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hue / 360; results["h"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["h"] = 0; }
  try { const v = input.saturation / 100; results["s"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["s"] = 0; }
  try { const v = input.lightness / 100; results["l"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["l"] = 0; }
  try { const v = (asFormulaNumber(results["l"])) < 0.5 ? (asFormulaNumber(results["l"])) * (1 + (asFormulaNumber(results["s"]))) : (asFormulaNumber(results["l"])) + (asFormulaNumber(results["s"])) - (asFormulaNumber(results["l"])) * (asFormulaNumber(results["s"])); results["q"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["q"] = 0; }
  try { const v = 2 * (asFormulaNumber(results["l"])) - (asFormulaNumber(results["q"])); results["p"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["p"] = 0; }
  try { const v = ((asFormulaNumber(results["h"])) + 1/3 < 0 ? (asFormulaNumber(results["h"])) + 1/3 + 1 : (asFormulaNumber(results["h"])) + 1/3 > 1 ? (asFormulaNumber(results["h"])) + 1/3 - 1 : (asFormulaNumber(results["h"])) + 1/3); results["adjustR"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustR"] = 0; }
  try { const v = ((asFormulaNumber(results["h"])) < 0 ? (asFormulaNumber(results["h"])) + 1 : (asFormulaNumber(results["h"])) > 1 ? (asFormulaNumber(results["h"])) - 1 : (asFormulaNumber(results["h"]))); results["adjustG"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustG"] = 0; }
  try { const v = ((asFormulaNumber(results["h"])) - 1/3 < 0 ? (asFormulaNumber(results["h"])) - 1/3 + 1 : (asFormulaNumber(results["h"])) - 1/3 > 1 ? (asFormulaNumber(results["h"])) - 1/3 - 1 : (asFormulaNumber(results["h"])) - 1/3); results["adjustB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustB"] = 0; }
  try { const v = (asFormulaNumber(results["s"])) === 0 ? (asFormulaNumber(results["l"])) : ((asFormulaNumber(results["adjustR"])) < 1/6 ? (asFormulaNumber(results["p"])) + ((asFormulaNumber(results["q"])) - (asFormulaNumber(results["p"]))) * 6 * (asFormulaNumber(results["adjustR"])) : (asFormulaNumber(results["adjustR"])) < 1/2 ? (asFormulaNumber(results["q"])) : (asFormulaNumber(results["adjustR"])) < 2/3 ? (asFormulaNumber(results["p"])) + ((asFormulaNumber(results["q"])) - (asFormulaNumber(results["p"]))) * (2/3 - (asFormulaNumber(results["adjustR"]))) * 6 : (asFormulaNumber(results["p"]))); results["r1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["r1"] = 0; }
  try { const v = (asFormulaNumber(results["s"])) === 0 ? (asFormulaNumber(results["l"])) : ((asFormulaNumber(results["adjustG"])) < 1/6 ? (asFormulaNumber(results["p"])) + ((asFormulaNumber(results["q"])) - (asFormulaNumber(results["p"]))) * 6 * (asFormulaNumber(results["adjustG"])) : (asFormulaNumber(results["adjustG"])) < 1/2 ? (asFormulaNumber(results["q"])) : (asFormulaNumber(results["adjustG"])) < 2/3 ? (asFormulaNumber(results["p"])) + ((asFormulaNumber(results["q"])) - (asFormulaNumber(results["p"]))) * (2/3 - (asFormulaNumber(results["adjustG"]))) * 6 : (asFormulaNumber(results["p"]))); results["g1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["g1"] = 0; }
  try { const v = (asFormulaNumber(results["s"])) === 0 ? (asFormulaNumber(results["l"])) : ((asFormulaNumber(results["adjustB"])) < 1/6 ? (asFormulaNumber(results["p"])) + ((asFormulaNumber(results["q"])) - (asFormulaNumber(results["p"]))) * 6 * (asFormulaNumber(results["adjustB"])) : (asFormulaNumber(results["adjustB"])) < 1/2 ? (asFormulaNumber(results["q"])) : (asFormulaNumber(results["adjustB"])) < 2/3 ? (asFormulaNumber(results["p"])) + ((asFormulaNumber(results["q"])) - (asFormulaNumber(results["p"]))) * (2/3 - (asFormulaNumber(results["adjustB"]))) * 6 : (asFormulaNumber(results["p"]))); results["b1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["b1"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
