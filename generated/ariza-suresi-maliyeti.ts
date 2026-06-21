// Auto-generated from ariza-suresi-maliyeti-schema.json
import * as z from 'zod';

export interface Ariza_suresi_maliyetiInput {
  DowntimeHours: number;
  AffectedWorkers: number;
  AvgHourlyRate: number;
  BurdenRate: number;
  LineCapacity: number;
  ContributionMargin: number;
  IdlePowerKW: number;
  ElectricityRate: number;
  OvertimeHours: number;
  OvertimeRate: number;
  CrewSize: number;
  QualityLoss: number;
  Penalty: number;
  dataConfidence?: number;
}

export const Ariza_suresi_maliyetiInputSchema = z.object({
  DowntimeHours: z.number().min(0).default(0),
  AffectedWorkers: z.number().min(0).default(0),
  AvgHourlyRate: z.number().min(0).default(0),
  BurdenRate: z.number().min(0).default(0),
  LineCapacity: z.number().min(0).default(0),
  ContributionMargin: z.number().min(0).default(0),
  IdlePowerKW: z.number().min(0).default(0),
  ElectricityRate: z.number().min(0).default(0),
  OvertimeHours: z.number().min(0).default(0),
  OvertimeRate: z.number().min(0).default(0),
  CrewSize: z.number().min(0).default(0),
  QualityLoss: z.number().min(0).default(0),
  Penalty: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ariza_suresi_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.DowntimeHours * input.AffectedWorkers * input.AvgHourlyRate * (1 + input.BurdenRate); results["DirectLaborLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DirectLaborLoss"] = Number.NaN; }
  try { const v = input.DowntimeHours * input.LineCapacity * input.ContributionMargin; results["ProductionLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ProductionLoss"] = Number.NaN; }
  try { const v = input.IdlePowerKW * input.DowntimeHours * input.ElectricityRate; results["EnergyWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnergyWaste"] = Number.NaN; }
  try { const v = input.OvertimeHours * input.OvertimeRate * input.CrewSize; results["RecoveryCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RecoveryCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DirectLaborLoss"])) + (toNumericFormulaValue(results["ProductionLoss"])) + (toNumericFormulaValue(results["EnergyWaste"])) + (toNumericFormulaValue(results["RecoveryCost"])) + input.QualityLoss + input.Penalty; results["TotalDowntimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalDowntimeCost"] = Number.NaN; }
  return results;
}


export function calculateAriza_suresi_maliyeti(input: Ariza_suresi_maliyetiInput): Ariza_suresi_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalDowntimeCost"]);
  const breakdown = {
    DirectLaborLoss: toNumericFormulaValue(values["DirectLaborLoss"]),
    ProductionLoss: toNumericFormulaValue(values["ProductionLoss"]),
    EnergyWaste: toNumericFormulaValue(values["EnergyWaste"]),
    RecoveryCost: toNumericFormulaValue(values["RecoveryCost"]),
    TotalDowntimeCost: toNumericFormulaValue(values["TotalDowntimeCost"])
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


export interface Ariza_suresi_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { DirectLaborLoss: number; ProductionLoss: number; EnergyWaste: number; RecoveryCost: number; TotalDowntimeCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ariza_suresi_maliyetiOutputMeta = {
  primaryKey: "TotalDowntimeCost",
  unit: "USD",
  breakdownKeys: ["DirectLaborLoss","ProductionLoss","EnergyWaste","RecoveryCost","TotalDowntimeCost"],
} as const;

