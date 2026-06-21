// Auto-generated from rota-optimizasyonu-analizoru-schema.json
import * as z from 'zod';

export interface Rota_optimizasyonu_analizoruInput {
  MinDistance_i: number;
  Distance_Depot_i: number;
  Distance_Depot_j: number;
  Distance_i_j: number;
  TheoreticalMinDistance: number;
  ActualRouteDistance: number;
  NumberOfDrops: number;
  RouteArea: number;
  ArrivalTime: number;
  LateWindow: number;
  PenaltyRate: number;
  TotalLoad: number;
  VehicleCapacity: number;
  BaselineCost: number;
  OptimizedCost: number;
  dataConfidence?: number;
}

export const Rota_optimizasyonu_analizoruInputSchema = z.object({
  MinDistance_i: z.number().min(0).default(0),
  Distance_Depot_i: z.number().min(0).default(0),
  Distance_Depot_j: z.number().min(0).default(0),
  Distance_i_j: z.number().min(0).default(0),
  TheoreticalMinDistance: z.number().min(0).default(0),
  ActualRouteDistance: z.number().min(0).default(0),
  NumberOfDrops: z.number().min(0).default(0),
  RouteArea: z.number().min(0).default(0),
  ArrivalTime: z.number().min(0).default(0),
  LateWindow: z.number().min(0).default(0),
  PenaltyRate: z.number().min(0).default(0),
  TotalLoad: z.number().min(0).default(0),
  VehicleCapacity: z.number().min(0).default(0),
  BaselineCost: z.number().min(0).default(0),
  OptimizedCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rota_optimizasyonu_analizoruInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["NearestNeighbor_Dist"] = Number.NaN;
  try { const v = input.Distance_Depot_i + input.Distance_Depot_j - input.Distance_i_j; results["Savings_ClarkeWright"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Savings_ClarkeWright"] = Number.NaN; }
  try { const v = input.TheoreticalMinDistance / input.ActualRouteDistance; results["RouteEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RouteEfficiency"] = Number.NaN; }
  try { const v = input.NumberOfDrops / input.RouteArea; results["DropDensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DropDensity"] = Number.NaN; }
  try { const v = Math.max(0 + input.ArrivalTime - input.LateWindow) * input.PenaltyRate; results["TimeWindowPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TimeWindowPenalty"] = Number.NaN; }
  try { const v = input.TotalLoad / input.VehicleCapacity; results["VehicleUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VehicleUtilization"] = Number.NaN; }
  try { const v = input.BaselineCost - input.OptimizedCost; results["TotalSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalSavings"] = Number.NaN; }
  return results;
}


export function calculateRota_optimizasyonu_analizoru(input: Rota_optimizasyonu_analizoruInput): Rota_optimizasyonu_analizoruOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalSavings"]);
  const breakdown = {
    NearestNeighbor_Dist: toNumericFormulaValue(values["NearestNeighbor_Dist"]),
    Savings_ClarkeWright: toNumericFormulaValue(values["Savings_ClarkeWright"]),
    RouteEfficiency: toNumericFormulaValue(values["RouteEfficiency"]),
    DropDensity: toNumericFormulaValue(values["DropDensity"]),
    TimeWindowPenalty: toNumericFormulaValue(values["TimeWindowPenalty"]),
    VehicleUtilization: toNumericFormulaValue(values["VehicleUtilization"]),
    TotalSavings: toNumericFormulaValue(values["TotalSavings"])
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


export interface Rota_optimizasyonu_analizoruOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { NearestNeighbor_Dist: number; Savings_ClarkeWright: number; RouteEfficiency: number; DropDensity: number; TimeWindowPenalty: number; VehicleUtilization: number; TotalSavings: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rota_optimizasyonu_analizoruOutputMeta = {
  primaryKey: "TotalSavings",
  unit: "USD",
  breakdownKeys: ["NearestNeighbor_Dist","Savings_ClarkeWright","RouteEfficiency","DropDensity","TimeWindowPenalty","VehicleUtilization","TotalSavings"],
} as const;

