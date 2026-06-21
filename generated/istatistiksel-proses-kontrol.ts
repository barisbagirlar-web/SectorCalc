// Auto-generated from istatistiksel-proses-kontrol-schema.json
import * as z from 'zod';

export interface Istatistiksel_proses_kontrolInput {
  Means: number;
  Ranges: number;
  StdDevs: number;
  A2: number;
  D4: number;
  D3: number;
  d2: number;
  USL: number;
  LSL: number;
  dataConfidence?: number;
}

export const Istatistiksel_proses_kontrolInputSchema = z.object({
  Means: z.number().min(0).default(0),
  Ranges: z.number().min(0).default(0),
  StdDevs: z.number().min(0).default(0),
  A2: z.number().min(0).default(0),
  D4: z.number().min(0).default(0),
  D3: z.number().min(0).default(0),
  d2: z.number().min(0).default(0),
  USL: z.number().min(0).default(0),
  LSL: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Istatistiksel_proses_kontrolInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["X_Bar_Bar"] = Number.NaN;
  results["R_Bar"] = Number.NaN;
  results["S_Bar"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["X_Bar_Bar"])) + (input.A2 * (toNumericFormulaValue(results["R_Bar"]))); results["UCL_X"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["UCL_X"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["X_Bar_Bar"])) - (input.A2 * (toNumericFormulaValue(results["R_Bar"]))); results["LCL_X"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LCL_X"] = Number.NaN; }
  try { const v = input.D4 * (toNumericFormulaValue(results["R_Bar"])); results["UCL_R"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["UCL_R"] = Number.NaN; }
  try { const v = input.D3 * (toNumericFormulaValue(results["R_Bar"])); results["LCL_R"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LCL_R"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["R_Bar"])) / input.d2; results["Sigma"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Sigma"] = Number.NaN; }
  try { const v = (input.USL - input.LSL) / (6 * (toNumericFormulaValue(results["Sigma"]))); results["Cp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cp"] = Number.NaN; }
  return results;
}


export function calculateIstatistiksel_proses_kontrol(input: Istatistiksel_proses_kontrolInput): Istatistiksel_proses_kontrolOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Cp"]);
  const breakdown = {
    X_Bar_Bar: toNumericFormulaValue(values["X_Bar_Bar"]),
    R_Bar: toNumericFormulaValue(values["R_Bar"]),
    S_Bar: toNumericFormulaValue(values["S_Bar"]),
    UCL_X: toNumericFormulaValue(values["UCL_X"]),
    LCL_X: toNumericFormulaValue(values["LCL_X"]),
    UCL_R: toNumericFormulaValue(values["UCL_R"]),
    LCL_R: toNumericFormulaValue(values["LCL_R"]),
    Sigma: toNumericFormulaValue(values["Sigma"]),
    Cp: toNumericFormulaValue(values["Cp"])
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


export interface Istatistiksel_proses_kontrolOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { X_Bar_Bar: number; R_Bar: number; S_Bar: number; UCL_X: number; LCL_X: number; UCL_R: number; LCL_R: number; Sigma: number; Cp: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Istatistiksel_proses_kontrolOutputMeta = {
  primaryKey: "Cp",
  unit: "USD",
  breakdownKeys: ["X_Bar_Bar","R_Bar","S_Bar","UCL_X","LCL_X","UCL_R","LCL_R","Sigma","Cp"],
} as const;

