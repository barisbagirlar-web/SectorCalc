// Auto-generated from cpk-to-ppm-schema.json
import * as z from 'zod';

export interface Cpk_to_ppmInput {
  USL: number;
  Mean: number;
  StdDev: number;
  LSL: number;
  dataConfidence?: number;
}

export const Cpk_to_ppmInputSchema = z.object({
  USL: z.number().min(0).default(0),
  Mean: z.number().min(0).default(0),
  StdDev: z.number().min(0).default(0),
  LSL: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cpk_to_ppmInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.USL - input.Mean) / input.StdDev; results["Z_USL"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Z_USL"] = Number.NaN; }
  try { const v = (input.Mean - input.LSL) / input.StdDev; results["Z_LSL"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Z_LSL"] = Number.NaN; }
  try { const v = Math.min((toNumericFormulaValue(results["Z_USL"])), (toNumericFormulaValue(results["Z_LSL"]))) / 3; results["Cpk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cpk"] = Number.NaN; }
  results["P_USL"] = Number.NaN;
  results["P_LSL"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["P_USL"])) + (toNumericFormulaValue(results["P_LSL"])); results["P_Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["P_Total"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["P_Total"])) * 1000000; results["PPM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PPM"] = Number.NaN; }
  try { const v = 1 - (toNumericFormulaValue(results["P_Total"])); results["Yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Yield"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["Cpk"])) * 3) + 1.5; results["Sigma_ShortTerm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Sigma_ShortTerm"] = Number.NaN; }
  return results;
}


export function calculateCpk_to_ppm(input: Cpk_to_ppmInput): Cpk_to_ppmOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Sigma_ShortTerm"]);
  const breakdown = {
    Z_USL: toNumericFormulaValue(values["Z_USL"]),
    Z_LSL: toNumericFormulaValue(values["Z_LSL"]),
    Cpk: toNumericFormulaValue(values["Cpk"]),
    P_USL: toNumericFormulaValue(values["P_USL"]),
    P_LSL: toNumericFormulaValue(values["P_LSL"]),
    P_Total: toNumericFormulaValue(values["P_Total"]),
    PPM: toNumericFormulaValue(values["PPM"]),
    Yield: toNumericFormulaValue(values["Yield"]),
    Sigma_ShortTerm: toNumericFormulaValue(values["Sigma_ShortTerm"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Cpk_to_ppmOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Z_USL: number; Z_LSL: number; Cpk: number; P_USL: number; P_LSL: number; P_Total: number; PPM: number; Yield: number; Sigma_ShortTerm: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cpk_to_ppmOutputMeta = {
  primaryKey: "Sigma_ShortTerm",
  unit: "USD",
  breakdownKeys: ["Z_USL","Z_LSL","Cpk","P_USL","P_LSL","P_Total","PPM","Yield","Sigma_ShortTerm"],
} as const;

