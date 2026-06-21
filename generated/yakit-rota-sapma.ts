// Auto-generated from yakit-rota-sapma-schema.json
import * as z from 'zod';

export interface Yakit_rota_sapmaInput {
  PlannedDistance: number;
  FuelEfficiency: number;
  ActualDistance: number;
  ActualFuelEfficiency: number;
  FuelPrice: number;
  IdleTime: number;
  IdleConsumptionRate: number;
  dataConfidence?: number;
}

export const Yakit_rota_sapmaInputSchema = z.object({
  PlannedDistance: z.number().min(0).default(0),
  FuelEfficiency: z.number().min(0).default(0),
  ActualDistance: z.number().min(0).default(0),
  ActualFuelEfficiency: z.number().min(0).default(0),
  FuelPrice: z.number().min(0).default(0),
  IdleTime: z.number().min(0).default(0),
  IdleConsumptionRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yakit_rota_sapmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.PlannedDistance * input.FuelEfficiency; results["PlannedFuel"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PlannedFuel"] = Number.NaN; }
  try { const v = input.ActualDistance * input.ActualFuelEfficiency; results["ActualFuel"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualFuel"] = Number.NaN; }
  try { const v = input.ActualDistance - input.PlannedDistance; results["RouteDrift"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RouteDrift"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["RouteDrift"])) * input.FuelEfficiency * input.FuelPrice; results["FuelWaste_Distance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FuelWaste_Distance"] = Number.NaN; }
  try { const v = input.PlannedDistance * (input.ActualFuelEfficiency - input.FuelEfficiency) * input.FuelPrice; results["FuelWaste_Efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FuelWaste_Efficiency"] = Number.NaN; }
  try { const v = input.IdleTime * input.IdleConsumptionRate * input.FuelPrice; results["IdleFuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IdleFuelCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FuelWaste_Distance"])) + (toNumericFormulaValue(results["FuelWaste_Efficiency"])) + (toNumericFormulaValue(results["IdleFuelCost"])); results["TotalDriftCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalDriftCost"] = Number.NaN; }
  return results;
}


export function calculateYakit_rota_sapma(input: Yakit_rota_sapmaInput): Yakit_rota_sapmaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalDriftCost"]);
  const breakdown = {
    PlannedFuel: toNumericFormulaValue(values["PlannedFuel"]),
    ActualFuel: toNumericFormulaValue(values["ActualFuel"]),
    RouteDrift: toNumericFormulaValue(values["RouteDrift"]),
    FuelWaste_Distance: toNumericFormulaValue(values["FuelWaste_Distance"]),
    FuelWaste_Efficiency: toNumericFormulaValue(values["FuelWaste_Efficiency"]),
    IdleFuelCost: toNumericFormulaValue(values["IdleFuelCost"]),
    TotalDriftCost: toNumericFormulaValue(values["TotalDriftCost"])
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


export interface Yakit_rota_sapmaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { PlannedFuel: number; ActualFuel: number; RouteDrift: number; FuelWaste_Distance: number; FuelWaste_Efficiency: number; IdleFuelCost: number; TotalDriftCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yakit_rota_sapmaOutputMeta = {
  primaryKey: "TotalDriftCost",
  unit: "USD",
  breakdownKeys: ["PlannedFuel","ActualFuel","RouteDrift","FuelWaste_Distance","FuelWaste_Efficiency","IdleFuelCost","TotalDriftCost"],
} as const;

