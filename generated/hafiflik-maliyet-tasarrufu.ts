// Auto-generated from hafiflik-maliyet-tasarrufu-schema.json
import * as z from 'zod';

export interface Hafiflik_maliyet_tasarrufuInput {
  Mass_Orig: number;
  Mass_LW: number;
  FuelFactor: number;
  Dist: number;
  FuelPrice: number;
  BurnFactor: number;
  Hours: number;
  JetPrice: number;
  RevPerKg: number;
  Cost_LW: number;
  Cost_Orig: number;
  Vol: number;
  Tool_LW: number;
  Tool_Orig: number;
  FuelSav: number;
  Payload: number;
  Life: number;
  dataConfidence?: number;
}

export const Hafiflik_maliyet_tasarrufuInputSchema = z.object({
  Mass_Orig: z.number().min(0).default(0),
  Mass_LW: z.number().min(0).default(0),
  FuelFactor: z.number().min(0).default(0),
  Dist: z.number().min(0).default(0),
  FuelPrice: z.number().min(0).default(0),
  BurnFactor: z.number().min(0).default(0),
  Hours: z.number().min(0).default(0),
  JetPrice: z.number().min(0).default(0),
  RevPerKg: z.number().min(0).default(0),
  Cost_LW: z.number().min(0).default(0),
  Cost_Orig: z.number().min(0).default(0),
  Vol: z.number().min(0).default(0),
  Tool_LW: z.number().min(0).default(0),
  Tool_Orig: z.number().min(0).default(0),
  FuelSav: z.number().min(0).default(0),
  Payload: z.number().min(0).default(0),
  Life: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hafiflik_maliyet_tasarrufuInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Mass_Orig - input.Mass_LW; results["WeightRed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WeightRed"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["WeightRed"])) * input.FuelFactor * input.Dist * input.FuelPrice; results["FuelSav_Auto"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FuelSav_Auto"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["WeightRed"])) * input.BurnFactor * input.Hours * input.JetPrice; results["FuelSav_Aero"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FuelSav_Aero"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["WeightRed"])) * input.RevPerKg; results["PayloadGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PayloadGain"] = Number.NaN; }
  try { const v = (input.Cost_LW - input.Cost_Orig) * input.Vol; results["MatPrem"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MatPrem"] = Number.NaN; }
  try { const v = input.Tool_LW - input.Tool_Orig; results["ToolDelta"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ToolDelta"] = Number.NaN; }
  try { const v = (input.FuelSav + input.Payload) * input.Life - (toNumericFormulaValue(results["MatPrem"])) - (toNumericFormulaValue(results["ToolDelta"])); results["NetSav"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetSav"] = Number.NaN; }
  return results;
}


export function calculateHafiflik_maliyet_tasarrufu(input: Hafiflik_maliyet_tasarrufuInput): Hafiflik_maliyet_tasarrufuOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["NetSav"]);
  const breakdown = {
    WeightRed: toNumericFormulaValue(values["WeightRed"]),
    FuelSav_Auto: toNumericFormulaValue(values["FuelSav_Auto"]),
    FuelSav_Aero: toNumericFormulaValue(values["FuelSav_Aero"]),
    PayloadGain: toNumericFormulaValue(values["PayloadGain"]),
    MatPrem: toNumericFormulaValue(values["MatPrem"]),
    ToolDelta: toNumericFormulaValue(values["ToolDelta"]),
    NetSav: toNumericFormulaValue(values["NetSav"])
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


export interface Hafiflik_maliyet_tasarrufuOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { WeightRed: number; FuelSav_Auto: number; FuelSav_Aero: number; PayloadGain: number; MatPrem: number; ToolDelta: number; NetSav: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hafiflik_maliyet_tasarrufuOutputMeta = {
  primaryKey: "NetSav",
  unit: "USD",
  breakdownKeys: ["WeightRed","FuelSav_Auto","FuelSav_Aero","PayloadGain","MatPrem","ToolDelta","NetSav"],
} as const;

