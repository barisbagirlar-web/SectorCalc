// Auto-generated from cpk-ppm-converter-calculator-schema.json
import * as z from 'zod';

export interface Cpk_ppm_converter_calculatorInput {
  cpk: number;
  sigmaShift: number;
  distributionType: string;
  sampleSize: number;
  confidenceLevel: string;
  useConfidenceInterval: boolean;
  dataConfidence?: number;
}

export const Cpk_ppm_converter_calculatorInputSchema = z.object({
  cpk: z.number().min(0).max(3).default(1.33),
  sigmaShift: z.number().min(0).max(2).default(1.5),
  distributionType: z.enum(['normal', 't-distribution']).default('normal'),
  sampleSize: z.number().min(2).max(100000).default(100),
  confidenceLevel: z.enum(['0.9', '0.95', '0.99']).default('0.95'),
  useConfidenceInterval: z.boolean().default(false),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cpk_ppm_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 3 * input.cpk; results["z_value"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["z_value"] = Number.NaN; }
  try { const v = 1 / (1 + 0.2316419 * Math.abs((toNumericFormulaValue(results["z_value"])))); results["t_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t_factor"] = Number.NaN; }
  try { const v = Math.exp(-(toNumericFormulaValue(results["z_value"])) * (toNumericFormulaValue(results["z_value"])) / 2) / Math.sqrt(2 * Math.PI); results["phi_z"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["phi_z"] = Number.NaN; }
  try { const v = 1 - (toNumericFormulaValue(results["phi_z"])) * (0.319381530 * (toNumericFormulaValue(results["t_factor"])) - 0.356563782 * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) + 1.781477937 * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) - 1.821255978 * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) + 1.330274429 * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"])) * (toNumericFormulaValue(results["t_factor"]))); results["cdf_z"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cdf_z"] = Number.NaN; }
  try { const v = Math.round((1 - (toNumericFormulaValue(results["cdf_z"]))) * 1000000); results["ppm_defect_rate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ppm_defect_rate"] = Number.NaN; }
  try { const v = (3 * input.cpk) + input.sigmaShift; results["sigma_level"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sigma_level"] = Number.NaN; }
  try { const v = Math.min(1000000, Math.round((toNumericFormulaValue(results["ppm_defect_rate"])) * (1 + 1 / Math.sqrt(input.sampleSize * 2)))); results["ppm_upper_bound"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ppm_upper_bound"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ppm_defect_rate"])); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCpk_ppm_converter_calculator(input: Cpk_ppm_converter_calculatorInput): Cpk_ppm_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    z_value: toNumericFormulaValue(values["z_value"]),
    cdf_z: toNumericFormulaValue(values["cdf_z"]),
    ppm_defect_rate: toNumericFormulaValue(values["ppm_defect_rate"]),
    ppm_upper_bound: toNumericFormulaValue(values["ppm_upper_bound"]),
    sigma_level: toNumericFormulaValue(values["sigma_level"])
  };
  const hiddenLossDrivers: string[] = ["Sigma shift (1.5σ) not applied — long-term drift assumed zero","Normal distribution assumption may not hold for all processes"];
  const suggestedActions: string[] = ["Validate process normality with Anderson-Darling test","Track Cpk trend monthly; investigate any drop >0.3"];
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
    unit: "PPM",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical comparison","Multi-process dashboard"],
  };
}


export interface Cpk_ppm_converter_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { z_value: number; cdf_z: number; ppm_defect_rate: number; ppm_upper_bound: number; sigma_level: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cpk_ppm_converter_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "PPM",
  breakdownKeys: ["z_value","cdf_z","ppm_defect_rate","ppm_upper_bound","sigma_level"],
} as const;

