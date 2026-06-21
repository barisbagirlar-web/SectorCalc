// Auto-generated from nakit-akisi-acigi-schema.json
import * as z from 'zod';

export interface Nakit_akisi_acigiInput {
  Receipts_t: number;
  Payments_t: number;
  CashInflow_t: number;
  CashOutflow_t: number;
  AccountsReceivable: number;
  TotalCreditSales: number;
  Days: number;
  AccountsPayable: number;
  TotalCreditPurchases: number;
  Inventory: number;
  COGS: number;
  DailyInterestRate: number;
  dataConfidence?: number;
}

export const Nakit_akisi_acigiInputSchema = z.object({
  Receipts_t: z.number().min(0).default(0),
  Payments_t: z.number().min(0).default(0),
  CashInflow_t: z.number().min(0).default(0),
  CashOutflow_t: z.number().min(0).default(0),
  AccountsReceivable: z.number().min(0).default(0),
  TotalCreditSales: z.number().min(0).default(0),
  Days: z.number().min(0).default(0),
  AccountsPayable: z.number().min(0).default(0),
  TotalCreditPurchases: z.number().min(0).default(0),
  Inventory: z.number().min(0).default(0),
  COGS: z.number().min(0).default(0),
  DailyInterestRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nakit_akisi_acigiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["CashInflow"] = Number.NaN;
  results["CashOutflow"] = Number.NaN;
  try { const v = input.CashInflow_t - input.CashOutflow_t; results["NetCashFlow_t"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetCashFlow_t"] = Number.NaN; }
  results["CumulativeCashFlow"] = Number.NaN;
  try { const v = Math.max(0, -Math.min((toNumericFormulaValue(results["CumulativeCashFlow"])))); results["CashGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CashGap"] = Number.NaN; }
  try { const v = (input.AccountsReceivable / input.TotalCreditSales) * input.Days; results["DSO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DSO"] = Number.NaN; }
  try { const v = (input.AccountsPayable / input.TotalCreditPurchases) * input.Days; results["DPO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DPO"] = Number.NaN; }
  try { const v = (input.Inventory / input.COGS) * input.Days; results["DIO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DIO"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DSO"])) + (toNumericFormulaValue(results["DIO"])) - (toNumericFormulaValue(results["DPO"])); results["CashConversionCycle"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CashConversionCycle"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["CashGap"])) * input.DailyInterestRate; results["FinancingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinancingCost"] = Number.NaN; }
  return results;
}


export function calculateNakit_akisi_acigi(input: Nakit_akisi_acigiInput): Nakit_akisi_acigiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["FinancingCost"]);
  const breakdown = {
    CashInflow: toNumericFormulaValue(values["CashInflow"]),
    CashOutflow: toNumericFormulaValue(values["CashOutflow"]),
    NetCashFlow_t: toNumericFormulaValue(values["NetCashFlow_t"]),
    CumulativeCashFlow: toNumericFormulaValue(values["CumulativeCashFlow"]),
    CashGap: toNumericFormulaValue(values["CashGap"]),
    DSO: toNumericFormulaValue(values["DSO"]),
    DPO: toNumericFormulaValue(values["DPO"]),
    DIO: toNumericFormulaValue(values["DIO"]),
    CashConversionCycle: toNumericFormulaValue(values["CashConversionCycle"]),
    FinancingCost: toNumericFormulaValue(values["FinancingCost"])
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


export interface Nakit_akisi_acigiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CashInflow: number; CashOutflow: number; NetCashFlow_t: number; CumulativeCashFlow: number; CashGap: number; DSO: number; DPO: number; DIO: number; CashConversionCycle: number; FinancingCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Nakit_akisi_acigiOutputMeta = {
  primaryKey: "FinancingCost",
  unit: "USD",
  breakdownKeys: ["CashInflow","CashOutflow","NetCashFlow_t","CumulativeCashFlow","CashGap","DSO","DPO","DIO","CashConversionCycle","FinancingCost"],
} as const;

