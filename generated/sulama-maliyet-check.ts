// Auto-generated from sulama-maliyet-check-schema.json
import * as z from 'zod';

export interface Sulama_maliyet_checkInput {
  ETc: number;
  Area: number;
  EffectiveRainfall: number;
  TotalHead: number;
  PumpEff: number;
  MotorEff: number;
  ElecRate: number;
  MaintRatePerHa: number;
  LaborCost: number;
  Depreciation: number;
  Losses: number;
  dataConfidence?: number;
}

export const Sulama_maliyet_checkInputSchema = z.object({
  ETc: z.number().min(0).default(0),
  Area: z.number().min(0).default(0),
  EffectiveRainfall: z.number().min(0).default(0),
  TotalHead: z.number().min(0).default(0),
  PumpEff: z.number().min(0).default(0),
  MotorEff: z.number().min(0).default(0),
  ElecRate: z.number().min(0).default(0),
  MaintRatePerHa: z.number().min(0).default(0),
  LaborCost: z.number().min(0).default(0),
  Depreciation: z.number().min(0).default(0),
  Losses: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sulama_maliyet_checkInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ETc * input.Area * (1 - input.EffectiveRainfall); results["WaterRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WaterRequirement"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["WaterRequirement"])) * input.TotalHead) / (input.PumpEff * input.MotorEff); results["PumpEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PumpEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["PumpEnergy"])) * input.ElecRate; results["EnergyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnergyCost"] = Number.NaN; }
  try { const v = input.Area * input.MaintRatePerHa; results["MaintCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MaintCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["EnergyCost"])) + (toNumericFormulaValue(results["MaintCost"])) + input.LaborCost + input.Depreciation; results["TotalIrrigationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalIrrigationCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalIrrigationCost"])) / (toNumericFormulaValue(results["WaterRequirement"])); results["CostPerM3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerM3"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["WaterRequirement"])) - input.Losses) / (toNumericFormulaValue(results["WaterRequirement"])); results["WaterUseEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WaterUseEfficiency"] = Number.NaN; }
  return results;
}


export function calculateSulama_maliyet_check(input: Sulama_maliyet_checkInput): Sulama_maliyet_checkOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["WaterUseEfficiency"]);
  const breakdown = {
    WaterRequirement: toNumericFormulaValue(values["WaterRequirement"]),
    PumpEnergy: toNumericFormulaValue(values["PumpEnergy"]),
    EnergyCost: toNumericFormulaValue(values["EnergyCost"]),
    MaintCost: toNumericFormulaValue(values["MaintCost"]),
    TotalIrrigationCost: toNumericFormulaValue(values["TotalIrrigationCost"]),
    CostPerM3: toNumericFormulaValue(values["CostPerM3"]),
    WaterUseEfficiency: toNumericFormulaValue(values["WaterUseEfficiency"])
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


export interface Sulama_maliyet_checkOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { WaterRequirement: number; PumpEnergy: number; EnergyCost: number; MaintCost: number; TotalIrrigationCost: number; CostPerM3: number; WaterUseEfficiency: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sulama_maliyet_checkOutputMeta = {
  primaryKey: "WaterUseEfficiency",
  unit: "USD",
  breakdownKeys: ["WaterRequirement","PumpEnergy","EnergyCost","MaintCost","TotalIrrigationCost","CostPerM3","WaterUseEfficiency"],
} as const;

