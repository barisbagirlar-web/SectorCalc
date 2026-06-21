// Auto-generated from arac-amortismani-schema.json
import * as z from 'zod';

export interface Arac_amortismaniInput {
  Cost: number;
  SalvageValue: number;
  UsefulLife: number;
  t: number;
  AssetClass: number;
  TotalExpectedUnits: number;
  AcquisitionCost: number;
  OpCost_t: number;
  MaintCost_t: number;
  Salvage_t: number;
  DiscountRate: number;
  Depreciation: number;
  TaxRate: number;
  dataConfidence?: number;
}

export const Arac_amortismaniInputSchema = z.object({
  Cost: z.number().min(0).default(0),
  SalvageValue: z.number().min(0).default(0),
  UsefulLife: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
  AssetClass: z.number().min(0).default(0),
  TotalExpectedUnits: z.number().min(0).default(0),
  AcquisitionCost: z.number().min(0).default(0),
  OpCost_t: z.number().min(0).default(0),
  MaintCost_t: z.number().min(0).default(0),
  Salvage_t: z.number().min(0).default(0),
  DiscountRate: z.number().min(0).default(0),
  Depreciation: z.number().min(0).default(0),
  TaxRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Arac_amortismaniInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.Cost - input.SalvageValue) / input.UsefulLife; results["SL_Annual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SL_Annual"] = Number.NaN; }
  try { const v = 2 / input.UsefulLife; results["DB_Rate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DB_Rate"] = Number.NaN; }
  results["DB_Year_t"] = Number.NaN;
  results["MACRS_Year_t"] = Number.NaN;
  try { const v = (input.Cost - input.SalvageValue) / input.TotalExpectedUnits; results["UoP_PerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["UoP_PerUnit"] = Number.NaN; }
  results["TCO"] = Number.NaN;
  try { const v = input.Depreciation * input.TaxRate; results["TaxShield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TaxShield"] = Number.NaN; }
  return results;
}


export function calculateArac_amortismani(input: Arac_amortismaniInput): Arac_amortismaniOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TaxShield"]);
  const breakdown = {
    SL_Annual: toNumericFormulaValue(values["SL_Annual"]),
    DB_Rate: toNumericFormulaValue(values["DB_Rate"]),
    DB_Year_t: toNumericFormulaValue(values["DB_Year_t"]),
    MACRS_Year_t: toNumericFormulaValue(values["MACRS_Year_t"]),
    UoP_PerUnit: toNumericFormulaValue(values["UoP_PerUnit"]),
    TCO: toNumericFormulaValue(values["TCO"]),
    TaxShield: toNumericFormulaValue(values["TaxShield"])
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


export interface Arac_amortismaniOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { SL_Annual: number; DB_Rate: number; DB_Year_t: number; MACRS_Year_t: number; UoP_PerUnit: number; TCO: number; TaxShield: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Arac_amortismaniOutputMeta = {
  primaryKey: "TaxShield",
  unit: "USD",
  breakdownKeys: ["SL_Annual","DB_Rate","DB_Year_t","MACRS_Year_t","UoP_PerUnit","TCO","TaxShield"],
} as const;

