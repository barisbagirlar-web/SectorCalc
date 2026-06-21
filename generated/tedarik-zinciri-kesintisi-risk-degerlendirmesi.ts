// Auto-generated from tedarik-zinciri-kesintisi-risk-degerlendirmesi-schema.json
import * as z from 'zod';

export interface Tedarik_zinciri_kesintisi_risk_degerlendirmesiInput {
  ProbabilityOfDisruption: number;
  FinancialImpact: number;
  DaysToRestoreFullCapacity: number;
  DailyRevenue: number;
  BufferCapacityPct: number;
  DualSourcingPremium: number;
  SafetyStockCarryingCost: number;
  InsurancePremium: number;
  ExpectedAnnualLoss: number;
  VulnerabilityScore: number;
  dataConfidence?: number;
}

export const Tedarik_zinciri_kesintisi_risk_degerlendirmesiInputSchema = z.object({
  ProbabilityOfDisruption: z.number().min(0).default(0),
  FinancialImpact: z.number().min(0).default(0),
  DaysToRestoreFullCapacity: z.number().min(0).default(0),
  DailyRevenue: z.number().min(0).default(0),
  BufferCapacityPct: z.number().min(0).default(0),
  DualSourcingPremium: z.number().min(0).default(0),
  SafetyStockCarryingCost: z.number().min(0).default(0),
  InsurancePremium: z.number().min(0).default(0),
  ExpectedAnnualLoss: z.number().min(0).default(0),
  VulnerabilityScore: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tedarik_zinciri_kesintisi_risk_degerlendirmesiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ProbabilityOfDisruption * input.FinancialImpact; results["RiskExposure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RiskExposure"] = Number.NaN; }
  try { const v = input.DaysToRestoreFullCapacity; results["TimeToRecover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TimeToRecover"] = Number.NaN; }
  try { const v = input.DailyRevenue * (toNumericFormulaValue(results["TimeToRecover"])) * (1 - input.BufferCapacityPct); results["RevenueLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RevenueLoss"] = Number.NaN; }
  try { const v = input.DualSourcingPremium + input.SafetyStockCarryingCost + input.InsurancePremium; results["MitigationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MitigationCost"] = Number.NaN; }
  try { const v = input.ExpectedAnnualLoss + (toNumericFormulaValue(results["MitigationCost"])); results["RiskAdjustedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RiskAdjustedCost"] = Number.NaN; }
  try { const v = 1 / ((toNumericFormulaValue(results["TimeToRecover"])) * input.VulnerabilityScore); results["ResilienceIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ResilienceIndex"] = Number.NaN; }
  return results;
}


export function calculateTedarik_zinciri_kesintisi_risk_degerlendirmesi(input: Tedarik_zinciri_kesintisi_risk_degerlendirmesiInput): Tedarik_zinciri_kesintisi_risk_degerlendirmesiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ResilienceIndex"]);
  const breakdown = {
    RiskExposure: toNumericFormulaValue(values["RiskExposure"]),
    TimeToRecover: toNumericFormulaValue(values["TimeToRecover"]),
    RevenueLoss: toNumericFormulaValue(values["RevenueLoss"]),
    MitigationCost: toNumericFormulaValue(values["MitigationCost"]),
    RiskAdjustedCost: toNumericFormulaValue(values["RiskAdjustedCost"]),
    ResilienceIndex: toNumericFormulaValue(values["ResilienceIndex"])
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


export interface Tedarik_zinciri_kesintisi_risk_degerlendirmesiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { RiskExposure: number; TimeToRecover: number; RevenueLoss: number; MitigationCost: number; RiskAdjustedCost: number; ResilienceIndex: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tedarik_zinciri_kesintisi_risk_degerlendirmesiOutputMeta = {
  primaryKey: "ResilienceIndex",
  unit: "USD",
  breakdownKeys: ["RiskExposure","TimeToRecover","RevenueLoss","MitigationCost","RiskAdjustedCost","ResilienceIndex"],
} as const;

