// Auto-generated from cpk-ppm-converter-schema.json
import * as z from 'zod';

export interface Cpk_ppm_converterInput {
  cpk: number;
  sigmaShift: number;
  distributionType: string;
  sampleSize: number;
  confidenceLevel: string;
  useConfidenceInterval: boolean;
}

export const Cpk_ppm_converterInputSchema = z.object({
  cpk: z.number().min(0).max(3).default(1.33),
  sigmaShift: z.number().min(0).max(2).default(1.5),
  distributionType: z.enum(['normal', 't-distribution']).default('normal'),
  sampleSize: z.number().min(2).max(100000).default(100),
  confidenceLevel: z.enum(['0.9', '0.95', '0.99']).default('0.95'),
  useConfidenceInterval: z.boolean().default(false),
});

function evaluateAllFormulas(input: Cpk_ppm_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 3 * input.cpk; results["z_short"] = Number.isFinite(v) ? v : 0; } catch { results["z_short"] = 0; }
  try { const v = (results["z_short"] ?? 0) - input.sigmaShift; results["z_long"] = Number.isFinite(v) ? v : 0; } catch { results["z_long"] = 0; }
  try { const v = (1 - normCdf((results["z_long"] ?? 0))) * 1e6; results["ppm_estimate"] = Number.isFinite(v) ? v : 0; } catch { results["ppm_estimate"] = 0; }
  try { const v = ((input.distributionType == 't-distribution') ? (ppm_adjusted = (1 - tcdf((results["z_long"] ?? 0), input.sampleSize - 1)) * 1e6) : (ppm_adjusted = (results["ppm_estimate"] ?? 0))); results["ppm_t_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["ppm_t_adjustment"] = 0; }
  results["confidence_interval"] = 0;
  try { const v = ppm_adjusted * (1 + (1 - input.confidenceLevel) * (1 / Math.sqrt(input.sampleSize))); results["data_confidence_adjusted"] = Number.isFinite(v) ? v : 0; } catch { results["data_confidence_adjusted"] = 0; }
  try { const v = ((input.useConfidenceInterval) ? (upperPPM) : (ppm_adjusted)); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateCpk_ppm_converter(input: Cpk_ppm_converterInput): Cpk_ppm_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ppm"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    type: values["type"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Low Cpk","High Sigma Shift","Small Sample Size","Non-Normal Distribution"];
  const suggestedActions: string[] = ["Implement process improvement (e.g., DOE, SMED, Poka-Yoke) to increase Cpk to at least 1.67.","Stabilize process to reduce long-term drift. Use SPC control charts and preventive maintenance.","Increase sample size to at least 30 for more accurate PPM estimates.","Perform normality test (e.g., Anderson-Darling) on actual data. If non-normal, use appropriate transformation or non-parametric methods."];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical comparison","Multi-process dashboard"],
  };
}


export interface Cpk_ppm_converterOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; type: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
