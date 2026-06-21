// Auto-generated from cloud-fire-elimination-schema.json
import * as z from 'zod';

export interface Cloud_fire_eliminationInput {
  UnattachedVolumes: number;
  IdleLBs: number;
  OrphanSnapshots: number;
  StorageRate: number;
  CurrentCost: number;
  RightSizedCost: number;
  Uptime: number;
  OnDemand: number;
  Spot: number;
  FaultTolerantHours: number;
  Reserved: number;
  CommitUtil: number;
  NonBizHours: number;
  RunningInstances: number;
  HourlyRate: number;
  Zombie: number;
  Oversizing: number;
  Idle: number;
  dataConfidence?: number;
}

export const Cloud_fire_eliminationInputSchema = z.object({
  UnattachedVolumes: z.number().min(0).default(0),
  IdleLBs: z.number().min(0).default(0),
  OrphanSnapshots: z.number().min(0).default(0),
  StorageRate: z.number().min(0).default(0),
  CurrentCost: z.number().min(0).default(0),
  RightSizedCost: z.number().min(0).default(0),
  Uptime: z.number().min(0).default(0),
  OnDemand: z.number().min(0).default(0),
  Spot: z.number().min(0).default(0),
  FaultTolerantHours: z.number().min(0).default(0),
  Reserved: z.number().min(0).default(0),
  CommitUtil: z.number().min(0).default(0),
  NonBizHours: z.number().min(0).default(0),
  RunningInstances: z.number().min(0).default(0),
  HourlyRate: z.number().min(0).default(0),
  Zombie: z.number().min(0).default(0),
  Oversizing: z.number().min(0).default(0),
  Idle: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cloud_fire_eliminationInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["ZombieCost"] = Number.NaN;
  results["OversizingSavings"] = Number.NaN;
  results["SpotSavings"] = Number.NaN;
  try { const v = (input.OnDemand - input.Reserved) * input.CommitUtil; results["ReservedSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ReservedSavings"] = Number.NaN; }
  try { const v = input.NonBizHours * input.RunningInstances * input.HourlyRate; results["IdleHoursCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["IdleHoursCost"] = Number.NaN; }
  try { const v = input.Zombie + input.Oversizing + input.Spot + input.Reserved + input.Idle; results["TotalWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalWaste"] = Number.NaN; }
  return results;
}


export function calculateCloud_fire_elimination(input: Cloud_fire_eliminationInput): Cloud_fire_eliminationOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalWaste"]);
  const breakdown = {
    ZombieCost: toNumericFormulaValue(values["ZombieCost"]),
    OversizingSavings: toNumericFormulaValue(values["OversizingSavings"]),
    SpotSavings: toNumericFormulaValue(values["SpotSavings"]),
    ReservedSavings: toNumericFormulaValue(values["ReservedSavings"]),
    IdleHoursCost: toNumericFormulaValue(values["IdleHoursCost"]),
    TotalWaste: toNumericFormulaValue(values["TotalWaste"])
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


export interface Cloud_fire_eliminationOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ZombieCost: number; OversizingSavings: number; SpotSavings: number; ReservedSavings: number; IdleHoursCost: number; TotalWaste: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cloud_fire_eliminationOutputMeta = {
  primaryKey: "TotalWaste",
  unit: "USD",
  breakdownKeys: ["ZombieCost","OversizingSavings","SpotSavings","ReservedSavings","IdleHoursCost","TotalWaste"],
} as const;

