// Auto-generated from isi-exchanger-fouling-schema.json
import * as z from 'zod';

export interface Isi_exchanger_foulingInput {
  U_dirty: number;
  U_clean: number;
  Area: number;
  LMTD: number;
  Hours: number;
  BoilEff: number;
  FuelCost: number;
  DeltaP_dirty: number;
  DeltaP_clean: number;
  Flow: number;
  PumpEff: number;
  CleanCost: number;
  dataConfidence?: number;
}

export const Isi_exchanger_foulingInputSchema = z.object({
  U_dirty: z.number().min(0).default(0),
  U_clean: z.number().min(0).default(0),
  Area: z.number().min(0).default(0),
  LMTD: z.number().min(0).default(0),
  Hours: z.number().min(0).default(0),
  BoilEff: z.number().min(0).default(0),
  FuelCost: z.number().min(0).default(0),
  DeltaP_dirty: z.number().min(0).default(0),
  DeltaP_clean: z.number().min(0).default(0),
  Flow: z.number().min(0).default(0),
  PumpEff: z.number().min(0).default(0),
  CleanCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Isi_exchanger_foulingInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 / input.U_dirty) - (1 / input.U_clean); results["R_foul"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["R_foul"] = Number.NaN; }
  try { const v = input.Area * input.U_clean * input.LMTD - input.Area * input.U_dirty * input.LMTD; results["Loss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Loss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Loss"])) * input.Hours / input.BoilEff; results["EnergyPen"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnergyPen"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["EnergyPen"])) * input.FuelCost; results["Cost_Energy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Energy"] = Number.NaN; }
  try { const v = input.DeltaP_dirty - input.DeltaP_clean; results["DP_Inc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DP_Inc"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["DP_Inc"])) * input.Flow * input.Hours / input.PumpEff; results["PumpInc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PumpInc"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Cost_Energy"])) + (toNumericFormulaValue(results["PumpInc"])); results["Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Total"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Total"])) / input.CleanCost; results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  return results;
}


export function calculateIsi_exchanger_fouling(input: Isi_exchanger_foulingInput): Isi_exchanger_foulingOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ROI"]);
  const breakdown = {
    R_foul: toNumericFormulaValue(values["R_foul"]),
    Loss: toNumericFormulaValue(values["Loss"]),
    EnergyPen: toNumericFormulaValue(values["EnergyPen"]),
    Cost_Energy: toNumericFormulaValue(values["Cost_Energy"]),
    DP_Inc: toNumericFormulaValue(values["DP_Inc"]),
    PumpInc: toNumericFormulaValue(values["PumpInc"]),
    Total: toNumericFormulaValue(values["Total"]),
    ROI: toNumericFormulaValue(values["ROI"])
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


export interface Isi_exchanger_foulingOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { R_foul: number; Loss: number; EnergyPen: number; Cost_Energy: number; DP_Inc: number; PumpInc: number; Total: number; ROI: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Isi_exchanger_foulingOutputMeta = {
  primaryKey: "ROI",
  unit: "USD",
  breakdownKeys: ["R_foul","Loss","EnergyPen","Cost_Energy","DP_Inc","PumpInc","Total","ROI"],
} as const;

