// Auto-generated from a-b-test-significance-calculator-schema.json
import * as z from 'zod';

export interface A_b_test_significance_calculatorInput {
  controlVisitors: number;
  controlConversions: number;
  variantVisitors: number;
  variantConversions: number;
  confidenceLevel: number;
}

export const A_b_test_significance_calculatorInputSchema = z.object({
  controlVisitors: z.number().default(1000),
  controlConversions: z.number().default(100),
  variantVisitors: z.number().default(1000),
  variantConversions: z.number().default(120),
  confidenceLevel: z.number().default(95),
});

function evaluateAllFormulas(input: A_b_test_significance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.controlConversions / input.controlVisitors; results["p1"] = Number.isFinite(v) ? v : 0; } catch { results["p1"] = 0; }
  try { const v = input.variantConversions / input.variantVisitors; results["p2"] = Number.isFinite(v) ? v : 0; } catch { results["p2"] = 0; }
  try { const v = (input.controlConversions + input.variantConversions) / (input.controlVisitors + input.variantVisitors); results["pPool"] = Number.isFinite(v) ? v : 0; } catch { results["pPool"] = 0; }
  try { const v = Math.sqrt((results["pPool"] ?? 0) * (1 - (results["pPool"] ?? 0)) * (1/input.controlVisitors + 1/input.variantVisitors)); results["se"] = Number.isFinite(v) ? v : 0; } catch { results["se"] = 0; }
  try { const v = ((results["p1"] ?? 0) - (results["p2"] ?? 0)) / (results["se"] ?? 0); results["z"] = Number.isFinite(v) ? v : 0; } catch { results["z"] = 0; }
  try { const v = Math.abs((results["z"] ?? 0)); results["absZ"] = Number.isFinite(v) ? v : 0; } catch { results["absZ"] = 0; }
  try { const v = 1 / (1 + 0.3275911 * (results["absZ"] ?? 0)); results["t"] = Number.isFinite(v) ? v : 0; } catch { results["t"] = 0; }
  try { const v = 1 - (((((1.061405429 * (results["t"] ?? 0) - 1.453152027) * (results["t"] ?? 0) + 1.421413741) * (results["t"] ?? 0) - 0.284496736) * (results["t"] ?? 0) + 0.254829592) * (results["t"] ?? 0) * Math.exp(-(results["absZ"] ?? 0) * (results["absZ"] ?? 0))); results["erfApprox"] = Number.isFinite(v) ? v : 0; } catch { results["erfApprox"] = 0; }
  try { const v = 0.5 * (1 + (results["erfApprox"] ?? 0)); results["cdf"] = Number.isFinite(v) ? v : 0; } catch { results["cdf"] = 0; }
  try { const v = 2 * (1 - (results["cdf"] ?? 0)); results["pValue"] = Number.isFinite(v) ? v : 0; } catch { results["pValue"] = 0; }
  try { const v = 1 - input.confidenceLevel / 100; results["alpha"] = Number.isFinite(v) ? v : 0; } catch { results["alpha"] = 0; }
  try { const v = (results["pValue"] ?? 0) < (results["alpha"] ?? 0) ? 'Significant' : 'Not Significant'; results["significance"] = Number.isFinite(v) ? v : 0; } catch { results["significance"] = 0; }
  try { const v = 'Z-Score: ' + (results["z"] ?? 0).toFixed(3); results["zScoreDisplay"] = Number.isFinite(v) ? v : 0; } catch { results["zScoreDisplay"] = 0; }
  try { const v = 'P-Value: ' + (results["pValue"] ?? 0).toFixed(4); results["pValueDisplay"] = Number.isFinite(v) ? v : 0; } catch { results["pValueDisplay"] = 0; }
  try { const v = 'Control Conversion Rate: ' + ((results["p1"] ?? 0) * 100).toFixed(2) + '%'; results["controlRateDisplay"] = Number.isFinite(v) ? v : 0; } catch { results["controlRateDisplay"] = 0; }
  try { const v = 'Variant Conversion Rate: ' + ((results["p2"] ?? 0) * 100).toFixed(2) + '%'; results["variantRateDisplay"] = Number.isFinite(v) ? v : 0; } catch { results["variantRateDisplay"] = 0; }
  return results;
}


export function calculateA_b_test_significance_calculator(input: A_b_test_significance_calculatorInput): A_b_test_significance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["significance"] ?? 0;
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


export interface A_b_test_significance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
