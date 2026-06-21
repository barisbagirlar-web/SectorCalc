// Auto-generated from ruzgar-turbini-yatirim-getirisi-schema.json
import * as z from 'zod';

export interface Ruzgar_turbini_yatirim_getirisiInput {
  PowerCurve_v: number;
  Frequency_v: number;
  RatedPower: number;
  FeedInTariff: number;
  LandLease: number;
  Maintenance: number;
  Insurance: number;
  GridFees: number;
  Capex: number;
  Opex_t: number;
  r: number;
  t: number;
  AEP_t: number;
  EBITDA_t: number;
  WACC: number;
  dataConfidence?: number;
}

export const Ruzgar_turbini_yatirim_getirisiInputSchema = z.object({
  PowerCurve_v: z.number().min(0).default(0),
  Frequency_v: z.number().min(0).default(0),
  RatedPower: z.number().min(0).default(0),
  FeedInTariff: z.number().min(0).default(0),
  LandLease: z.number().min(0).default(0),
  Maintenance: z.number().min(0).default(0),
  Insurance: z.number().min(0).default(0),
  GridFees: z.number().min(0).default(0),
  Capex: z.number().min(0).default(0),
  Opex_t: z.number().min(0).default(0),
  r: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
  AEP_t: z.number().min(0).default(0),
  EBITDA_t: z.number().min(0).default(0),
  WACC: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ruzgar_turbini_yatirim_getirisiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["AEP"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["AEP"])) / (input.RatedPower * 8760); results["CapacityFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CapacityFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AEP"])) * input.FeedInTariff; results["AnnualRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualRevenue"] = Number.NaN; }
  try { const v = input.LandLease + input.Maintenance + input.Insurance + input.GridFees; results["OPEX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OPEX"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AnnualRevenue"])) - (toNumericFormulaValue(results["OPEX"])); results["EBITDA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EBITDA"] = Number.NaN; }
  results["LCOE"] = Number.NaN;
  results["NPV"] = Number.NaN;
  try { const v = 0.0; results["IRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IRR"] = Number.NaN; }
  return results;
}


export function calculateRuzgar_turbini_yatirim_getirisi(input: Ruzgar_turbini_yatirim_getirisiInput): Ruzgar_turbini_yatirim_getirisiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["IRR"]);
  const breakdown = {
    AEP: toNumericFormulaValue(values["AEP"]),
    CapacityFactor: toNumericFormulaValue(values["CapacityFactor"]),
    AnnualRevenue: toNumericFormulaValue(values["AnnualRevenue"]),
    OPEX: toNumericFormulaValue(values["OPEX"]),
    EBITDA: toNumericFormulaValue(values["EBITDA"]),
    LCOE: toNumericFormulaValue(values["LCOE"]),
    NPV: toNumericFormulaValue(values["NPV"]),
    IRR: toNumericFormulaValue(values["IRR"])
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


export interface Ruzgar_turbini_yatirim_getirisiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { AEP: number; CapacityFactor: number; AnnualRevenue: number; OPEX: number; EBITDA: number; LCOE: number; NPV: number; IRR: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ruzgar_turbini_yatirim_getirisiOutputMeta = {
  primaryKey: "IRR",
  unit: "USD",
  breakdownKeys: ["AEP","CapacityFactor","AnnualRevenue","OPEX","EBITDA","LCOE","NPV","IRR"],
} as const;

