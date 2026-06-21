// Auto-generated from vakum-kacagi-enerji-kaybi-schema.json
import * as z from 'zod';

export interface Vakum_kacagi_enerji_kaybiInput {
  Volume: number;
  DeltaP: number;
  DeltaT: number;
  P_Atmospheric: number;
  PumpEff: number;
  OperatingHours: number;
  ElecRate: number;
  TotalPumpCapacity: number;
  GridEmissionFactor: number;
  dataConfidence?: number;
}

export const Vakum_kacagi_enerji_kaybiInputSchema = z.object({
  Volume: z.number().min(0).default(0),
  DeltaP: z.number().min(0).default(0),
  DeltaT: z.number().min(0).default(0),
  P_Atmospheric: z.number().min(0).default(0),
  PumpEff: z.number().min(0).default(0),
  OperatingHours: z.number().min(0).default(0),
  ElecRate: z.number().min(0).default(0),
  TotalPumpCapacity: z.number().min(0).default(0),
  GridEmissionFactor: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vakum_kacagi_enerji_kaybiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Volume * input.DeltaP / input.DeltaT; results["LeakRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LeakRate"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["LeakRate"])) * input.P_Atmospheric) / (input.PumpEff * 1000); results["PowerLoss_kW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PowerLoss_kW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PowerLoss_kW"])) * input.OperatingHours; results["AnnualEnergyLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualEnergyLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AnnualEnergyLoss"])) * input.ElecRate; results["CostOfLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostOfLeak"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["LeakRate"])) / input.TotalPumpCapacity; results["PumpCapacityWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PumpCapacityWaste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["AnnualEnergyLoss"])) * input.GridEmissionFactor; results["CarbonEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarbonEmissions"] = Number.NaN; }
  return results;
}


export function calculateVakum_kacagi_enerji_kaybi(input: Vakum_kacagi_enerji_kaybiInput): Vakum_kacagi_enerji_kaybiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CarbonEmissions"]);
  const breakdown = {
    LeakRate: toNumericFormulaValue(values["LeakRate"]),
    PowerLoss_kW: toNumericFormulaValue(values["PowerLoss_kW"]),
    AnnualEnergyLoss: toNumericFormulaValue(values["AnnualEnergyLoss"]),
    CostOfLeak: toNumericFormulaValue(values["CostOfLeak"]),
    PumpCapacityWaste: toNumericFormulaValue(values["PumpCapacityWaste"]),
    CarbonEmissions: toNumericFormulaValue(values["CarbonEmissions"])
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


export interface Vakum_kacagi_enerji_kaybiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { LeakRate: number; PowerLoss_kW: number; AnnualEnergyLoss: number; CostOfLeak: number; PumpCapacityWaste: number; CarbonEmissions: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vakum_kacagi_enerji_kaybiOutputMeta = {
  primaryKey: "CarbonEmissions",
  unit: "USD",
  breakdownKeys: ["LeakRate","PowerLoss_kW","AnnualEnergyLoss","CostOfLeak","PumpCapacityWaste","CarbonEmissions"],
} as const;

