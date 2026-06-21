// Auto-generated from oee-ve-durma-suresi-schema.json
import * as z from 'zod';

export interface Oee_ve_durma_suresiInput {
  OperatingTime: number;
  PlannedProductionTime: number;
  IdealCycleTime: number;
  TotalCount: number;
  GoodCount: number;
  AllTime: number;
  CostPerMinute: number;
  UnitCost: number;
  dataConfidence?: number;
}

export const Oee_ve_durma_suresiInputSchema = z.object({
  OperatingTime: z.number().min(0).default(0),
  PlannedProductionTime: z.number().min(0).default(0),
  IdealCycleTime: z.number().min(0).default(0),
  TotalCount: z.number().min(0).default(0),
  GoodCount: z.number().min(0).default(0),
  AllTime: z.number().min(0).default(0),
  CostPerMinute: z.number().min(0).default(0),
  UnitCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Oee_ve_durma_suresiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.OperatingTime / input.PlannedProductionTime; results["Availability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Availability"] = Number.NaN; }
  try { const v = (input.IdealCycleTime * input.TotalCount) / input.OperatingTime; results["Performance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Performance"] = Number.NaN; }
  try { const v = input.GoodCount / input.TotalCount; results["Quality"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Quality"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Availability"])) * (toNumericFormulaValue(results["Performance"])) * (toNumericFormulaValue(results["Quality"])); results["OEE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["OEE"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["OEE"])) * (input.PlannedProductionTime / input.AllTime); results["TEEP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TEEP"] = Number.NaN; }
  try { const v = (input.PlannedProductionTime - input.OperatingTime) * input.CostPerMinute; results["DowntimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DowntimeCost"] = Number.NaN; }
  try { const v = (input.OperatingTime - (input.IdealCycleTime * input.TotalCount)) * input.CostPerMinute; results["SpeedLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SpeedLoss"] = Number.NaN; }
  try { const v = (input.TotalCount - input.GoodCount) * input.UnitCost; results["QualityLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["QualityLoss"] = Number.NaN; }
  return results;
}


export function calculateOee_ve_durma_suresi(input: Oee_ve_durma_suresiInput): Oee_ve_durma_suresiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["QualityLoss"]);
  const breakdown = {
    Availability: toNumericFormulaValue(values["Availability"]),
    Performance: toNumericFormulaValue(values["Performance"]),
    Quality: toNumericFormulaValue(values["Quality"]),
    OEE: toNumericFormulaValue(values["OEE"]),
    TEEP: toNumericFormulaValue(values["TEEP"]),
    DowntimeCost: toNumericFormulaValue(values["DowntimeCost"]),
    SpeedLoss: toNumericFormulaValue(values["SpeedLoss"]),
    QualityLoss: toNumericFormulaValue(values["QualityLoss"])
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


export interface Oee_ve_durma_suresiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Availability: number; Performance: number; Quality: number; OEE: number; TEEP: number; DowntimeCost: number; SpeedLoss: number; QualityLoss: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Oee_ve_durma_suresiOutputMeta = {
  primaryKey: "QualityLoss",
  unit: "USD",
  breakdownKeys: ["Availability","Performance","Quality","OEE","TEEP","DowntimeCost","SpeedLoss","QualityLoss"],
} as const;

