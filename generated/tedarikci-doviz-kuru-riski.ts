// Auto-generated from tedarikci-doviz-kuru-riski-schema.json
import * as z from 'zod';

export interface Tedarikci_doviz_kuru_riskiInput {
  ContractValue_FC: number;
  UnhedgedPct: number;
  ForwardRate: number;
  ExpectedSpotRate: number;
  Volatility: number;
  Z_Score: number;
  TimeHorizon: number;
  SpotRate: number;
  ContractHasAdjustment: number;
  AdjustmentFactor: number;
  dataConfidence?: number;
}

export const Tedarikci_doviz_kuru_riskiInputSchema = z.object({
  ContractValue_FC: z.number().min(0).default(0),
  UnhedgedPct: z.number().min(0).default(0),
  ForwardRate: z.number().min(0).default(0),
  ExpectedSpotRate: z.number().min(0).default(0),
  Volatility: z.number().min(0).default(0),
  Z_Score: z.number().min(0).default(0),
  TimeHorizon: z.number().min(0).default(0),
  SpotRate: z.number().min(0).default(0),
  ContractHasAdjustment: z.number().min(0).default(0),
  AdjustmentFactor: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tedarikci_doviz_kuru_riskiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ContractValue_FC * input.UnhedgedPct; results["Exposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Exposure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Exposure"])) * (input.ForwardRate - input.ExpectedSpotRate); results["ExpectedLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ExpectedLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Exposure"])) * input.Volatility * input.Z_Score * Math.sqrt(input.TimeHorizon); results["VaR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VaR"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Exposure"])) * (input.ForwardRate - input.SpotRate); results["HedgingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["HedgingCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ExpectedLoss"])) + (toNumericFormulaValue(results["HedgingCost"])); results["NetRiskCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetRiskCost"] = Number.NaN; }
  try { const v = ((input.ContractHasAdjustment) ? ((toNumericFormulaValue(results["Exposure"])) * input.AdjustmentFactor) : (0)); results["CurrencyClauseSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CurrencyClauseSavings"] = Number.NaN; }
  return results;
}


export function calculateTedarikci_doviz_kuru_riski(input: Tedarikci_doviz_kuru_riskiInput): Tedarikci_doviz_kuru_riskiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CurrencyClauseSavings"]);
  const breakdown = {
    Exposure: toNumericFormulaValue(values["Exposure"]),
    ExpectedLoss: toNumericFormulaValue(values["ExpectedLoss"]),
    VaR: toNumericFormulaValue(values["VaR"]),
    HedgingCost: toNumericFormulaValue(values["HedgingCost"]),
    NetRiskCost: toNumericFormulaValue(values["NetRiskCost"]),
    CurrencyClauseSavings: toNumericFormulaValue(values["CurrencyClauseSavings"])
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


export interface Tedarikci_doviz_kuru_riskiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Exposure: number; ExpectedLoss: number; VaR: number; HedgingCost: number; NetRiskCost: number; CurrencyClauseSavings: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tedarikci_doviz_kuru_riskiOutputMeta = {
  primaryKey: "CurrencyClauseSavings",
  unit: "USD",
  breakdownKeys: ["Exposure","ExpectedLoss","VaR","HedgingCost","NetRiskCost","CurrencyClauseSavings"],
} as const;

