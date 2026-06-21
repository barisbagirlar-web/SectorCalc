// Auto-generated from yenilenebilir-enerji-yg-schema.json
import * as z from 'zod';

export interface Yenilenebilir_enerji_ygInput {
  SystemCapacity: number;
  CapacityFactor: number;
  GridElectricityRate: number;
  Maintenance: number;
  Insurance: number;
  InverterReplacementFund: number;
  Incentives: number;
  TotalCapex: number;
  OPEX_t: number;
  r: number;
  t: number;
  Generation_t: number;
  NetCashFlow_t: number;
  WACC: number;
  dataConfidence?: number;
}

export const Yenilenebilir_enerji_ygInputSchema = z.object({
  SystemCapacity: z.number().min(0).default(0),
  CapacityFactor: z.number().min(0).default(0),
  GridElectricityRate: z.number().min(0).default(0),
  Maintenance: z.number().min(0).default(0),
  Insurance: z.number().min(0).default(0),
  InverterReplacementFund: z.number().min(0).default(0),
  Incentives: z.number().min(0).default(0),
  TotalCapex: z.number().min(0).default(0),
  OPEX_t: z.number().min(0).default(0),
  r: z.number().min(0).default(0),
  t: z.number().min(0).default(0),
  Generation_t: z.number().min(0).default(0),
  NetCashFlow_t: z.number().min(0).default(0),
  WACC: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yenilenebilir_enerji_ygInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.SystemCapacity * input.CapacityFactor * 8760; results["AnnualGeneration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualGeneration"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AnnualGeneration"])) * input.GridElectricityRate; results["AnnualSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualSavings"] = Number.NaN; }
  try { const v = input.Maintenance + input.Insurance + input.InverterReplacementFund; results["AnnualOPEX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualOPEX"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AnnualSavings"])) - (toNumericFormulaValue(results["AnnualOPEX"])) + input.Incentives; results["NetCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetCashFlow"] = Number.NaN; }
  try { const v = input.TotalCapex / (toNumericFormulaValue(results["NetCashFlow"])); results["PaybackPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PaybackPeriod"] = Number.NaN; }
  results["LCOE"] = Number.NaN;
  results["NPV"] = Number.NaN;
  return results;
}


export function calculateYenilenebilir_enerji_yg(input: Yenilenebilir_enerji_ygInput): Yenilenebilir_enerji_ygOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["NPV"]);
  const breakdown = {
    AnnualGeneration: toNumericFormulaValue(values["AnnualGeneration"]),
    AnnualSavings: toNumericFormulaValue(values["AnnualSavings"]),
    AnnualOPEX: toNumericFormulaValue(values["AnnualOPEX"]),
    NetCashFlow: toNumericFormulaValue(values["NetCashFlow"]),
    PaybackPeriod: toNumericFormulaValue(values["PaybackPeriod"]),
    LCOE: toNumericFormulaValue(values["LCOE"]),
    NPV: toNumericFormulaValue(values["NPV"])
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


export interface Yenilenebilir_enerji_ygOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { AnnualGeneration: number; AnnualSavings: number; AnnualOPEX: number; NetCashFlow: number; PaybackPeriod: number; LCOE: number; NPV: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yenilenebilir_enerji_ygOutputMeta = {
  primaryKey: "NPV",
  unit: "USD",
  breakdownKeys: ["AnnualGeneration","AnnualSavings","AnnualOPEX","NetCashFlow","PaybackPeriod","LCOE","NPV"],
} as const;

