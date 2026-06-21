// Auto-generated from lojistik-rota-kaybi-schema.json
import * as z from 'zod';

export interface Lojistik_rota_kaybiInput {
  PointToPoint_Distance: number;
  RouteDistance: number;
  FuelConsumptionRate: number;
  FuelPrice: number;
  AvgSpeed: number;
  DriverHourlyRate: number;
  VehicleWearCost: number;
  dataConfidence?: number;
}

export const Lojistik_rota_kaybiInputSchema = z.object({
  PointToPoint_Distance: z.number().min(0).default(0),
  RouteDistance: z.number().min(0).default(0),
  FuelConsumptionRate: z.number().min(0).default(0),
  FuelPrice: z.number().min(0).default(0),
  AvgSpeed: z.number().min(0).default(0),
  DriverHourlyRate: z.number().min(0).default(0),
  VehicleWearCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lojistik_rota_kaybiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.PointToPoint_Distance; results["IdealDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IdealDistance"] = Number.NaN; }
  try { const v = input.RouteDistance; results["ActualDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ActualDistance"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["ActualDistance"])) - (toNumericFormulaValue(results["IdealDistance"]))) / (toNumericFormulaValue(results["IdealDistance"])); results["DriftPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DriftPct"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["ActualDistance"])) - (toNumericFormulaValue(results["IdealDistance"]))) * input.FuelConsumptionRate * input.FuelPrice; results["FuelWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FuelWaste"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["ActualDistance"])) - (toNumericFormulaValue(results["IdealDistance"]))) / input.AvgSpeed * input.DriverHourlyRate; results["TimeWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TimeWaste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["FuelWaste"])) + (toNumericFormulaValue(results["TimeWaste"])) + input.VehicleWearCost; results["TotalRouteLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalRouteLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["IdealDistance"])) / (toNumericFormulaValue(results["ActualDistance"])); results["Efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Efficiency"] = Number.NaN; }
  return results;
}


export function calculateLojistik_rota_kaybi(input: Lojistik_rota_kaybiInput): Lojistik_rota_kaybiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Efficiency"]);
  const breakdown = {
    IdealDistance: toNumericFormulaValue(values["IdealDistance"]),
    ActualDistance: toNumericFormulaValue(values["ActualDistance"]),
    DriftPct: toNumericFormulaValue(values["DriftPct"]),
    FuelWaste: toNumericFormulaValue(values["FuelWaste"]),
    TimeWaste: toNumericFormulaValue(values["TimeWaste"]),
    TotalRouteLoss: toNumericFormulaValue(values["TotalRouteLoss"]),
    Efficiency: toNumericFormulaValue(values["Efficiency"])
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


export interface Lojistik_rota_kaybiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { IdealDistance: number; ActualDistance: number; DriftPct: number; FuelWaste: number; TimeWaste: number; TotalRouteLoss: number; Efficiency: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lojistik_rota_kaybiOutputMeta = {
  primaryKey: "Efficiency",
  unit: "USD",
  breakdownKeys: ["IdealDistance","ActualDistance","DriftPct","FuelWaste","TimeWaste","TotalRouteLoss","Efficiency"],
} as const;

