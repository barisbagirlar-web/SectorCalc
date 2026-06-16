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

function evaluateAllFormulas(input: Pearson_correlation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.x1 + input.x2 + input.x3 + input.x4) / 4; results["meanX"] = Number.isFinite(v) ? v : 0; } catch { results["meanX"] = 0; }
  try { const v = (input.y1 + input.y2 + input.y3 + input.y4) / 4; results["meanY"] = Number.isFinite(v) ? v : 0; } catch { results["meanY"] = 0; }
  try { const v = input.x1 - (results["meanX"] ?? 0); results["devX1"] = Number.isFinite(v) ? v : 0; } catch { results["devX1"] = 0; }
  try { const v = input.x2 - (results["meanX"] ?? 0); results["devX2"] = Number.isFinite(v) ? v : 0; } catch { results["devX2"] = 0; }
  try { const v = input.x3 - (results["meanX"] ?? 0); results["devX3"] = Number.isFinite(v) ? v : 0; } catch { results["devX3"] = 0; }
  try { const v = input.x4 - (results["meanX"] ?? 0); results["devX4"] = Number.isFinite(v) ? v : 0; } catch { results["devX4"] = 0; }
  try { const v = input.y1 - (results["meanY"] ?? 0); results["devY1"] = Number.isFinite(v) ? v : 0; } catch { results["devY1"] = 0; }
  try { const v = input.y2 - (results["meanY"] ?? 0); results["devY2"] = Number.isFinite(v) ? v : 0; } catch { results["devY2"] = 0; }
  try { const v = input.y3 - (results["meanY"] ?? 0); results["devY3"] = Number.isFinite(v) ? v : 0; } catch { results["devY3"] = 0; }
  try { const v = input.y4 - (results["meanY"] ?? 0); results["devY4"] = Number.isFinite(v) ? v : 0; } catch { results["devY4"] = 0; }
  try { const v = (results["devX1"] ?? 0) * (results["devY1"] ?? 0) + (results["devX2"] ?? 0) * (results["devY2"] ?? 0) + (results["devX3"] ?? 0) * (results["devY3"] ?? 0) + (results["devX4"] ?? 0) * (results["devY4"] ?? 0); results["sumProdDev"] = Number.isFinite(v) ? v : 0; } catch { results["sumProdDev"] = 0; }
  try { const v = (results["devX1"] ?? 0) ** 2 + (results["devX2"] ?? 0) ** 2 + (results["devX3"] ?? 0) ** 2 + (results["devX4"] ?? 0) ** 2; results["sumSqX"] = Number.isFinite(v) ? v : 0; } catch { results["sumSqX"] = 0; }
  try { const v = (results["devY1"] ?? 0) ** 2 + (results["devY2"] ?? 0) ** 2 + (results["devY3"] ?? 0) ** 2 + (results["devY4"] ?? 0) ** 2; results["sumSqY"] = Number.isFinite(v) ? v : 0; } catch { results["sumSqY"] = 0; }
  try { const v = (results["sumProdDev"] ?? 0) / Math.sqrt((results["sumSqX"] ?? 0) * (results["sumSqY"] ?? 0)); results["correlationCoefficient"] = Number.isFinite(v) ? v : 0; } catch { results["correlationCoefficient"] = 0; }
  return results;
}


export function calculatePearson_correlation_calculator(input: Pearson_correlation_calculatorInput): Pearson_correlation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["correlationCoefficient"] ?? 0;
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


export interface Pearson_correlation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
