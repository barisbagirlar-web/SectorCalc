// Auto-generated from tasima-mode-maliyet-risk-schema.json
import * as z from 'zod';

export interface Tasima_mode_maliyet_riskInput {
  Weight: number;
  AirRate: number;
  Handling: number;
  Volume: number;
  SeaRate: number;
  PortFees: number;
  Customs: number;
  Distance: number;
  RoadRate: number;
  Tolls: number;
  TransitDays: number;
  InventoryCarryingCostPerDay: number;
  ProbabilityOfDamage: number;
  CargoValue: number;
  ProbabilityOfDelay: number;
  DelayPenalty: number;
  TransportCost: number;
  TotalModeCost_Air: number;
  TotalModeCost_Sea: number;
  TotalModeCost_Road: number;
  dataConfidence?: number;
}

export const Tasima_mode_maliyet_riskInputSchema = z.object({
  Weight: z.number().min(0).default(0),
  AirRate: z.number().min(0).default(0),
  Handling: z.number().min(0).default(0),
  Volume: z.number().min(0).default(0),
  SeaRate: z.number().min(0).default(0),
  PortFees: z.number().min(0).default(0),
  Customs: z.number().min(0).default(0),
  Distance: z.number().min(0).default(0),
  RoadRate: z.number().min(0).default(0),
  Tolls: z.number().min(0).default(0),
  TransitDays: z.number().min(0).default(0),
  InventoryCarryingCostPerDay: z.number().min(0).default(0),
  ProbabilityOfDamage: z.number().min(0).default(0),
  CargoValue: z.number().min(0).default(0),
  ProbabilityOfDelay: z.number().min(0).default(0),
  DelayPenalty: z.number().min(0).default(0),
  TransportCost: z.number().min(0).default(0),
  TotalModeCost_Air: z.number().min(0).default(0),
  TotalModeCost_Sea: z.number().min(0).default(0),
  TotalModeCost_Road: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tasima_mode_maliyet_riskInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Weight * input.AirRate + input.Handling; results["Cost_Air"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Air"] = Number.NaN; }
  try { const v = input.Volume * input.SeaRate + input.PortFees + input.Customs; results["Cost_Sea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Sea"] = Number.NaN; }
  try { const v = input.Distance * input.RoadRate + input.Tolls; results["Cost_Road"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Road"] = Number.NaN; }
  try { const v = input.TransitDays * input.InventoryCarryingCostPerDay; results["TransitTimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TransitTimeCost"] = Number.NaN; }
  try { const v = input.ProbabilityOfDamage * input.CargoValue + input.ProbabilityOfDelay * input.DelayPenalty; results["RiskCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RiskCost"] = Number.NaN; }
  try { const v = input.TransportCost + (toNumericFormulaValue(results["TransitTimeCost"])) + (toNumericFormulaValue(results["RiskCost"])); results["TotalModeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalModeCost"] = Number.NaN; }
  try { const v = Math.min(input.TotalModeCost_Air, input.TotalModeCost_Sea, input.TotalModeCost_Road); results["ModeSelection"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ModeSelection"] = Number.NaN; }
  return results;
}


export function calculateTasima_mode_maliyet_risk(input: Tasima_mode_maliyet_riskInput): Tasima_mode_maliyet_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ModeSelection"]);
  const breakdown = {
    Cost_Air: toNumericFormulaValue(values["Cost_Air"]),
    Cost_Sea: toNumericFormulaValue(values["Cost_Sea"]),
    Cost_Road: toNumericFormulaValue(values["Cost_Road"]),
    TransitTimeCost: toNumericFormulaValue(values["TransitTimeCost"]),
    RiskCost: toNumericFormulaValue(values["RiskCost"]),
    TotalModeCost: toNumericFormulaValue(values["TotalModeCost"]),
    ModeSelection: toNumericFormulaValue(values["ModeSelection"])
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


export interface Tasima_mode_maliyet_riskOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Air: number; Cost_Sea: number; Cost_Road: number; TransitTimeCost: number; RiskCost: number; TotalModeCost: number; ModeSelection: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tasima_mode_maliyet_riskOutputMeta = {
  primaryKey: "ModeSelection",
  unit: "USD",
  breakdownKeys: ["Cost_Air","Cost_Sea","Cost_Road","TransitTimeCost","RiskCost","TotalModeCost","ModeSelection"],
} as const;

