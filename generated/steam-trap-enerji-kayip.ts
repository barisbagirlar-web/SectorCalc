// Auto-generated from steam-trap-enerji-kayip-schema.json
import * as z from 'zod';

export interface Steam_trap_enerji_kayipInput {
  C_d: number;
  A: number;
  DeltaP: number;
  Density: number;
  Enthalpy_Steam: number;
  OperatingHours: number;
  SteamCost_per_kWh: number;
  FailedTraps: number;
  TotalTraps: number;
  AnnualCost_i: number;
  TrapCost: number;
  LaborCost: number;
  dataConfidence?: number;
}

export const Steam_trap_enerji_kayipInputSchema = z.object({
  C_d: z.number().min(0).default(0),
  A: z.number().min(0).default(0),
  DeltaP: z.number().min(0).default(0),
  Density: z.number().min(0).default(0),
  Enthalpy_Steam: z.number().min(0).default(0),
  OperatingHours: z.number().min(0).default(0),
  SteamCost_per_kWh: z.number().min(0).default(0),
  FailedTraps: z.number().min(0).default(0),
  TotalTraps: z.number().min(0).default(0),
  AnnualCost_i: z.number().min(0).default(0),
  TrapCost: z.number().min(0).default(0),
  LaborCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Steam_trap_enerji_kayipInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.C_d * input.A * Math.sqrt(2 * input.DeltaP * input.Density); results["OrificeFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OrificeFlow"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["OrificeFlow"])) * 3600; results["SteamLoss_kg_h"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SteamLoss_kg_h"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["SteamLoss_kg_h"])) * input.Enthalpy_Steam / 3600; results["EnergyLoss_kW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnergyLoss_kW"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["EnergyLoss_kW"])) * input.OperatingHours * input.SteamCost_per_kWh; results["AnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["AnnualCost"] = Number.NaN; }
  try { const v = input.FailedTraps / input.TotalTraps; results["TrapFailureRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TrapFailureRate"] = Number.NaN; }
  results["TotalSystemLoss"] = Number.NaN;
  try { const v = (toNumericFormulaValue(results["TotalSystemLoss"])) / (input.TrapCost + input.LaborCost); results["RepairROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["RepairROI"] = Number.NaN; }
  return results;
}


export function calculateSteam_trap_enerji_kayip(input: Steam_trap_enerji_kayipInput): Steam_trap_enerji_kayipOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["RepairROI"]);
  const breakdown = {
    OrificeFlow: toNumericFormulaValue(values["OrificeFlow"]),
    SteamLoss_kg_h: toNumericFormulaValue(values["SteamLoss_kg_h"]),
    EnergyLoss_kW: toNumericFormulaValue(values["EnergyLoss_kW"]),
    AnnualCost: toNumericFormulaValue(values["AnnualCost"]),
    TrapFailureRate: toNumericFormulaValue(values["TrapFailureRate"]),
    TotalSystemLoss: toNumericFormulaValue(values["TotalSystemLoss"]),
    RepairROI: toNumericFormulaValue(values["RepairROI"])
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


export interface Steam_trap_enerji_kayipOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { OrificeFlow: number; SteamLoss_kg_h: number; EnergyLoss_kW: number; AnnualCost: number; TrapFailureRate: number; TotalSystemLoss: number; RepairROI: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Steam_trap_enerji_kayipOutputMeta = {
  primaryKey: "RepairROI",
  unit: "USD",
  breakdownKeys: ["OrificeFlow","SteamLoss_kg_h","EnergyLoss_kW","AnnualCost","TrapFailureRate","TotalSystemLoss","RepairROI"],
} as const;

