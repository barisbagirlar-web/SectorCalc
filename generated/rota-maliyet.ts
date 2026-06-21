// Auto-generated from rota-maliyet-schema.json
import * as z from 'zod';

export interface Rota_maliyetInput {
  TotalDistance: number;
  FuelConsumption: number;
  FuelPrice: number;
  TotalTime: number;
  DriverWage: number;
  VehicleDepreciation: number;
  Tolls_i: number;
  MaintRatePerKm: number;
  OverheadPct: number;
  NumberOfDrops: number;
  dataConfidence?: number;
}

export const Rota_maliyetInputSchema = z.object({
  TotalDistance: z.number().min(0).default(0),
  FuelConsumption: z.number().min(0).default(0),
  FuelPrice: z.number().min(0).default(0),
  TotalTime: z.number().min(0).default(0),
  DriverWage: z.number().min(0).default(0),
  VehicleDepreciation: z.number().min(0).default(0),
  Tolls_i: z.number().min(0).default(0),
  MaintRatePerKm: z.number().min(0).default(0),
  OverheadPct: z.number().min(0).default(0),
  NumberOfDrops: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rota_maliyetInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.TotalDistance * input.FuelConsumption * input.FuelPrice; results["DistanceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DistanceCost"] = Number.NaN; }
  try { const v = input.TotalTime * (input.DriverWage + input.VehicleDepreciation); results["TimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TimeCost"] = Number.NaN; }
  results["TollCost"] = Number.NaN;
  try { const v = input.TotalDistance * input.MaintRatePerKm; results["MaintenanceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MaintenanceCost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["DistanceCost"])) + (toNumericFormulaValue(results["TimeCost"]))) * input.OverheadPct; results["Overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Overhead"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DistanceCost"])) + (toNumericFormulaValue(results["TimeCost"])) + (toNumericFormulaValue(results["TollCost"])) + (toNumericFormulaValue(results["MaintenanceCost"])) + (toNumericFormulaValue(results["Overhead"])); results["TotalRouteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalRouteCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalRouteCost"])) / input.TotalDistance; results["CostPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerKm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalRouteCost"])) / input.NumberOfDrops; results["CostPerDrop"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerDrop"] = Number.NaN; }
  return results;
}


export function calculateRota_maliyet(input: Rota_maliyetInput): Rota_maliyetOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostPerDrop"]);
  const breakdown = {
    DistanceCost: toNumericFormulaValue(values["DistanceCost"]),
    TimeCost: toNumericFormulaValue(values["TimeCost"]),
    TollCost: toNumericFormulaValue(values["TollCost"]),
    MaintenanceCost: toNumericFormulaValue(values["MaintenanceCost"]),
    Overhead: toNumericFormulaValue(values["Overhead"]),
    TotalRouteCost: toNumericFormulaValue(values["TotalRouteCost"]),
    CostPerKm: toNumericFormulaValue(values["CostPerKm"]),
    CostPerDrop: toNumericFormulaValue(values["CostPerDrop"])
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


export interface Rota_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DistanceCost: number; TimeCost: number; TollCost: number; MaintenanceCost: number; Overhead: number; TotalRouteCost: number; CostPerKm: number; CostPerDrop: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rota_maliyetOutputMeta = {
  primaryKey: "CostPerDrop",
  unit: "USD",
  breakdownKeys: ["DistanceCost","TimeCost","TollCost","MaintenanceCost","Overhead","TotalRouteCost","CostPerKm","CostPerDrop"],
} as const;

