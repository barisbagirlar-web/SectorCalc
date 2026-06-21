// Auto-generated from tekstil-atigi-risk-degerlendirmesi-schema.json
import * as z from 'zod';

export interface Tekstil_atigi_risk_degerlendirmesiInput {
  InputFabric: number;
  OutputGarments: number;
  CuttingScrap: number;
  SewingDefects: number;
  DyeingRework: number;
  FabricCostPerKg: number;
  ProcessingCost: number;
  WasteWeight: number;
  LandfillFee: number;
  RecycledWasteWeight: number;
  ScrapValue: number;
  TotalRevenue: number;
  dataConfidence?: number;
}

export const Tekstil_atigi_risk_degerlendirmesiInputSchema = z.object({
  InputFabric: z.number().min(0).default(0),
  OutputGarments: z.number().min(0).default(0),
  CuttingScrap: z.number().min(0).default(0),
  SewingDefects: z.number().min(0).default(0),
  DyeingRework: z.number().min(0).default(0),
  FabricCostPerKg: z.number().min(0).default(0),
  ProcessingCost: z.number().min(0).default(0),
  WasteWeight: z.number().min(0).default(0),
  LandfillFee: z.number().min(0).default(0),
  RecycledWasteWeight: z.number().min(0).default(0),
  ScrapValue: z.number().min(0).default(0),
  TotalRevenue: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tekstil_atigi_risk_degerlendirmesiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.InputFabric - input.OutputGarments) / input.InputFabric; results["WasteRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WasteRate"] = Number.NaN; }
  try { const v = input.CuttingScrap + input.SewingDefects + input.DyeingRework; results["PreConsumerWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PreConsumerWaste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PreConsumerWaste"])) * input.FabricCostPerKg + input.ProcessingCost; results["FinancialLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FinancialLoss"] = Number.NaN; }
  try { const v = input.WasteWeight * input.LandfillFee; results["DisposalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DisposalCost"] = Number.NaN; }
  try { const v = input.RecycledWasteWeight * input.ScrapValue; results["CircularRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CircularRevenue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FinancialLoss"])) + (toNumericFormulaValue(results["DisposalCost"])) - (toNumericFormulaValue(results["CircularRevenue"])); results["NetWasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetWasteCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["NetWasteCost"])) / input.TotalRevenue; results["RiskScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RiskScore"] = Number.NaN; }
  return results;
}


export function calculateTekstil_atigi_risk_degerlendirmesi(input: Tekstil_atigi_risk_degerlendirmesiInput): Tekstil_atigi_risk_degerlendirmesiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["RiskScore"]);
  const breakdown = {
    WasteRate: toNumericFormulaValue(values["WasteRate"]),
    PreConsumerWaste: toNumericFormulaValue(values["PreConsumerWaste"]),
    FinancialLoss: toNumericFormulaValue(values["FinancialLoss"]),
    DisposalCost: toNumericFormulaValue(values["DisposalCost"]),
    CircularRevenue: toNumericFormulaValue(values["CircularRevenue"]),
    NetWasteCost: toNumericFormulaValue(values["NetWasteCost"]),
    RiskScore: toNumericFormulaValue(values["RiskScore"])
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


export interface Tekstil_atigi_risk_degerlendirmesiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { WasteRate: number; PreConsumerWaste: number; FinancialLoss: number; DisposalCost: number; CircularRevenue: number; NetWasteCost: number; RiskScore: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tekstil_atigi_risk_degerlendirmesiOutputMeta = {
  primaryKey: "RiskScore",
  unit: "USD",
  breakdownKeys: ["WasteRate","PreConsumerWaste","FinancialLoss","DisposalCost","CircularRevenue","NetWasteCost","RiskScore"],
} as const;

