// Auto-generated from filament-recycling-schema.json
import * as z from 'zod';

export interface Filament_recyclingInput {
  Price_V: number;
  Scrap_V: number;
  Transp_V: number;
  Collect: number;
  Pellet: number;
  Yield: number;
  Tensile_V: number;
  Tensile_R: number;
  AppFactor: number;
  Energy_V: number;
  Energy_R: number;
  EnergyCost: number;
  CO2_V: number;
  CO2_R: number;
  CarbonPrice: number;
  Cost_V: number;
  Vol: number;
  Capex: number;
  dataConfidence?: number;
}

export const Filament_recyclingInputSchema = z.object({
  Price_V: z.number().min(0).default(0),
  Scrap_V: z.number().min(0).default(0),
  Transp_V: z.number().min(0).default(0),
  Collect: z.number().min(0).default(0),
  Pellet: z.number().min(0).default(0),
  Yield: z.number().min(0).default(0),
  Tensile_V: z.number().min(0).default(0),
  Tensile_R: z.number().min(0).default(0),
  AppFactor: z.number().min(0).default(0),
  Energy_V: z.number().min(0).default(0),
  Energy_R: z.number().min(0).default(0),
  EnergyCost: z.number().min(0).default(0),
  CO2_V: z.number().min(0).default(0),
  CO2_R: z.number().min(0).default(0),
  CarbonPrice: z.number().min(0).default(0),
  Cost_V: z.number().min(0).default(0),
  Vol: z.number().min(0).default(0),
  Capex: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Filament_recyclingInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Price_V * (1 + input.Scrap_V) + input.Transp_V; results["Cost_Virgin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Virgin"] = Number.NaN; }
  results["Cost_Recyc"] = Number.NaN;
  try { const v = (input.Tensile_V - input.Tensile_R) * input.AppFactor; results["QualPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["QualPenalty"] = Number.NaN; }
  try { const v = (input.Energy_V - input.Energy_R) * input.EnergyCost; results["EnergySav"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["EnergySav"] = Number.NaN; }
  try { const v = (input.CO2_V - input.CO2_R) * input.CarbonPrice; results["CarbonCred"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CarbonCred"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["Cost_Recyc"])) + (toNumericFormulaValue(results["QualPenalty"])) - (toNumericFormulaValue(results["EnergySav"])) - (toNumericFormulaValue(results["CarbonCred"])); results["Total_R"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Total_R"] = Number.NaN; }
  try { const v = (input.Cost_V - (toNumericFormulaValue(results["Total_R"]))) * input.Vol / input.Capex; results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  return results;
}


export function calculateFilament_recycling(input: Filament_recyclingInput): Filament_recyclingOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ROI"]);
  const breakdown = {
    Cost_Virgin: toNumericFormulaValue(values["Cost_Virgin"]),
    Cost_Recyc: toNumericFormulaValue(values["Cost_Recyc"]),
    QualPenalty: toNumericFormulaValue(values["QualPenalty"]),
    EnergySav: toNumericFormulaValue(values["EnergySav"]),
    CarbonCred: toNumericFormulaValue(values["CarbonCred"]),
    Total_R: toNumericFormulaValue(values["Total_R"]),
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


export interface Filament_recyclingOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Virgin: number; Cost_Recyc: number; QualPenalty: number; EnergySav: number; CarbonCred: number; Total_R: number; ROI: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Filament_recyclingOutputMeta = {
  primaryKey: "ROI",
  unit: "USD",
  breakdownKeys: ["Cost_Virgin","Cost_Recyc","QualPenalty","EnergySav","CarbonCred","Total_R","ROI"],
} as const;

