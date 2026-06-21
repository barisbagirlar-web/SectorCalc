// Auto-generated from fabrika-yerlesim-mesafe-schema.json
import * as z from 'zod';

export interface Fabrika_yerlesim_mesafeInput {
  X_i: number;
  X_j: number;
  Y_i: number;
  Y_j: number;
  Flow_ij: number;
  CostPerDist: number;
  AdjFactor_ij: number;
  EquipArea: number;
  FacArea: number;
  HandRate: number;
  CrossTraffic: number;
  AisleCap: number;
  MatHand: number;
  Space: number;
  dataConfidence?: number;
}

export const Fabrika_yerlesim_mesafeInputSchema = z.object({
  X_i: z.number().min(0).default(0),
  X_j: z.number().min(0).default(0),
  Y_i: z.number().min(0).default(0),
  Y_j: z.number().min(0).default(0),
  Flow_ij: z.number().min(0).default(0),
  CostPerDist: z.number().min(0).default(0),
  AdjFactor_ij: z.number().min(0).default(0),
  EquipArea: z.number().min(0).default(0),
  FacArea: z.number().min(0).default(0),
  HandRate: z.number().min(0).default(0),
  CrossTraffic: z.number().min(0).default(0),
  AisleCap: z.number().min(0).default(0),
  MatHand: z.number().min(0).default(0),
  Space: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fabrika_yerlesim_mesafeInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.abs(input.X_i - input.X_j) + Math.abs(input.Y_i - input.Y_j); results["Dist_ij"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Dist_ij"] = Number.NaN; }
  results["FlowCost"] = Number.NaN;
  results["AdjScore"] = Number.NaN;
  try { const v = input.EquipArea / input.FacArea; results["SpaceUtil"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SpaceUtil"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FlowCost"])) * input.HandRate; results["MatHandCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MatHandCost"] = Number.NaN; }
  try { const v = 1 + (input.CrossTraffic / input.AisleCap); results["Congestion"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Congestion"] = Number.NaN; }
  try { const v = input.MatHand + input.Space + (toNumericFormulaValue(results["Congestion"])); results["TotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalCost"] = Number.NaN; }
  return results;
}


export function calculateFabrika_yerlesim_mesafe(input: Fabrika_yerlesim_mesafeInput): Fabrika_yerlesim_mesafeOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalCost"]);
  const breakdown = {
    Dist_ij: toNumericFormulaValue(values["Dist_ij"]),
    FlowCost: toNumericFormulaValue(values["FlowCost"]),
    AdjScore: toNumericFormulaValue(values["AdjScore"]),
    SpaceUtil: toNumericFormulaValue(values["SpaceUtil"]),
    MatHandCost: toNumericFormulaValue(values["MatHandCost"]),
    Congestion: toNumericFormulaValue(values["Congestion"]),
    TotalCost: toNumericFormulaValue(values["TotalCost"])
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


export interface Fabrika_yerlesim_mesafeOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Dist_ij: number; FlowCost: number; AdjScore: number; SpaceUtil: number; MatHandCost: number; Congestion: number; TotalCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fabrika_yerlesim_mesafeOutputMeta = {
  primaryKey: "TotalCost",
  unit: "USD",
  breakdownKeys: ["Dist_ij","FlowCost","AdjScore","SpaceUtil","MatHandCost","Congestion","TotalCost"],
} as const;

