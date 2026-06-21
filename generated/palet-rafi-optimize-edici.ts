// Auto-generated from palet-rafi-optimize-edici-schema.json
import * as z from 'zod';

export interface Palet_rafi_optimize_ediciInput {
  Bays: number;
  Levels: number;
  PalletsPerBay: number;
  RackFootprint: number;
  TotalFloorArea: number;
  Aisles: number;
  ForkliftSpeed: number;
  TravelDistance: number;
  Load: number;
  BeamLength: number;
  E: number;
  I: number;
  MaxLoadCapacity: number;
  ActualLoad: number;
  TotalRackCost: number;
  TravelTime_Horizontal: number;
  TravelTime_Vertical: number;
  PickTime: number;
  dataConfidence?: number;
}

export const Palet_rafi_optimize_ediciInputSchema = z.object({
  Bays: z.number().min(0).default(0),
  Levels: z.number().min(0).default(0),
  PalletsPerBay: z.number().min(0).default(0),
  RackFootprint: z.number().min(0).default(0),
  TotalFloorArea: z.number().min(0).default(0),
  Aisles: z.number().min(0).default(0),
  ForkliftSpeed: z.number().min(0).default(0),
  TravelDistance: z.number().min(0).default(0),
  Load: z.number().min(0).default(0),
  BeamLength: z.number().min(0).default(0),
  E: z.number().min(0).default(0),
  I: z.number().min(0).default(0),
  MaxLoadCapacity: z.number().min(0).default(0),
  ActualLoad: z.number().min(0).default(0),
  TotalRackCost: z.number().min(0).default(0),
  TravelTime_Horizontal: z.number().min(0).default(0),
  TravelTime_Vertical: z.number().min(0).default(0),
  PickTime: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Palet_rafi_optimize_ediciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Bays * input.Levels * input.PalletsPerBay; results["RackCapacity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RackCapacity"] = Number.NaN; }
  try { const v = input.RackFootprint / input.TotalFloorArea; results["FloorUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FloorUtilization"] = Number.NaN; }
  try { const v = input.Aisles * input.ForkliftSpeed * input.TravelDistance^-1; results["Throughput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Throughput"] = Number.NaN; }
  try { const v = (5 * input.Load * input.BeamLength**3) / (384 * input.E * input.I); results["Deflection"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Deflection"] = Number.NaN; }
  try { const v = input.MaxLoadCapacity / input.ActualLoad; results["SafetyFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SafetyFactor"] = Number.NaN; }
  try { const v = input.TotalRackCost / (toNumericFormulaValue(results["RackCapacity"])); results["CostPerPosition"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerPosition"] = Number.NaN; }
  try { const v = input.TravelTime_Horizontal + input.TravelTime_Vertical + input.PickTime; results["RetrievalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RetrievalTime"] = Number.NaN; }
  return results;
}


export function calculatePalet_rafi_optimize_edici(input: Palet_rafi_optimize_ediciInput): Palet_rafi_optimize_ediciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["RetrievalTime"]);
  const breakdown = {
    RackCapacity: toNumericFormulaValue(values["RackCapacity"]),
    FloorUtilization: toNumericFormulaValue(values["FloorUtilization"]),
    Throughput: toNumericFormulaValue(values["Throughput"]),
    Deflection: toNumericFormulaValue(values["Deflection"]),
    SafetyFactor: toNumericFormulaValue(values["SafetyFactor"]),
    CostPerPosition: toNumericFormulaValue(values["CostPerPosition"]),
    RetrievalTime: toNumericFormulaValue(values["RetrievalTime"])
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


export interface Palet_rafi_optimize_ediciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { RackCapacity: number; FloorUtilization: number; Throughput: number; Deflection: number; SafetyFactor: number; CostPerPosition: number; RetrievalTime: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Palet_rafi_optimize_ediciOutputMeta = {
  primaryKey: "RetrievalTime",
  unit: "USD",
  breakdownKeys: ["RackCapacity","FloorUtilization","Throughput","Deflection","SafetyFactor","CostPerPosition","RetrievalTime"],
} as const;

