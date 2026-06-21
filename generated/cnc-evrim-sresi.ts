// Auto-generated from cnc-evrim-sresi-schema.json
import * as z from 'zod';

export interface Cnc_evrim_sresiInput {
  vc: number;
  fz: number;
  ap: number;
  dtool: number;
  l: number;
  vrapid: number;
  takimDegisim: number;
  yuklemeBosaltma: number;
  dataConfidence?: number;
}

export const Cnc_evrim_sresiInputSchema = z.object({
  vc: z.number().min(0).default(0),
  fz: z.number().min(0).default(0),
  ap: z.number().min(0).default(0),
  dtool: z.number().min(0).default(0),
  l: z.number().min(0).default(0),
  vrapid: z.number().min(0).default(0),
  takimDegisim: z.number().min(0).default(0),
  yuklemeBosaltma: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cnc_evrim_sresiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vc * input.fz * input.ap * input.dtool; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.vc * input.fz * input.ap * input.dtool * (input.l * input.vrapid * input.takimDegisim * input.yuklemeBosaltma); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.l * input.vrapid * input.takimDegisim * input.yuklemeBosaltma; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateCnc_evrim_sresi(input: Cnc_evrim_sresiInput): Cnc_evrim_sresiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Cnc_evrim_sresiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cnc_evrim_sresiOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

