// Auto-generated from pearson-correlation-calculator-schema.json
import * as z from 'zod';

export interface Pearson_correlation_calculatorInput {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
  dataConfidence?: number;
}

export const Pearson_correlation_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  y1: z.number().default(0),
  x2: z.number().default(0),
  y2: z.number().default(0),
  x3: z.number().default(0),
  y3: z.number().default(0),
  x4: z.number().default(0),
  y4: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pearson_correlation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.x1 + input.x2 + input.x3 + input.x4) / 4; results["meanX"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanX"] = 0; }
  try { const v = (input.y1 + input.y2 + input.y3 + input.y4) / 4; results["meanY"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanY"] = 0; }
  try { const v = input.x1 - (asFormulaNumber(results["meanX"])); results["devX1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["devX1"] = 0; }
  try { const v = input.x2 - (asFormulaNumber(results["meanX"])); results["devX2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["devX2"] = 0; }
  try { const v = input.x3 - (asFormulaNumber(results["meanX"])); results["devX3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["devX3"] = 0; }
  try { const v = input.x4 - (asFormulaNumber(results["meanX"])); results["devX4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["devX4"] = 0; }
  try { const v = input.y1 - (asFormulaNumber(results["meanY"])); results["devY1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["devY1"] = 0; }
  try { const v = input.y2 - (asFormulaNumber(results["meanY"])); results["devY2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["devY2"] = 0; }
  try { const v = input.y3 - (asFormulaNumber(results["meanY"])); results["devY3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["devY3"] = 0; }
  try { const v = input.y4 - (asFormulaNumber(results["meanY"])); results["devY4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["devY4"] = 0; }
  try { const v = (asFormulaNumber(results["devX1"])) * (asFormulaNumber(results["devY1"])) + (asFormulaNumber(results["devX2"])) * (asFormulaNumber(results["devY2"])) + (asFormulaNumber(results["devX3"])) * (asFormulaNumber(results["devY3"])) + (asFormulaNumber(results["devX4"])) * (asFormulaNumber(results["devY4"])); results["sumProdDev"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumProdDev"] = 0; }
  try { const v = (asFormulaNumber(results["devX1"])) ** 2 + (asFormulaNumber(results["devX2"])) ** 2 + (asFormulaNumber(results["devX3"])) ** 2 + (asFormulaNumber(results["devX4"])) ** 2; results["sumSqX"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumSqX"] = 0; }
  try { const v = (asFormulaNumber(results["devY1"])) ** 2 + (asFormulaNumber(results["devY2"])) ** 2 + (asFormulaNumber(results["devY3"])) ** 2 + (asFormulaNumber(results["devY4"])) ** 2; results["sumSqY"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumSqY"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePearson_correlation_calculator(input: Pearson_correlation_calculatorInput): Pearson_correlation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sumSqY"]);
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


export interface Pearson_correlation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
