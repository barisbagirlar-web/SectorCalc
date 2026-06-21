// Auto-generated from flexible-manufacturing-roi-schema.json
import * as z from 'zod';

export interface Flexible_manufacturing_roiInput {
  Mach_Ded: number;
  Setup_Ded: number;
  Changeovers: number;
  Inv_High: number;
  Mach_FMS: number;
  Tool_FMS: number;
  Prog: number;
  Maint: number;
  TTM_Red: number;
  RevGain: number;
  CustPrem: number;
  Vol: number;
  WIP_Ded: number;
  WIP_Flex: number;
  CarryCost: number;
  Scrap_Ded: number;
  Scrap_Flex: number;
  UnitCost: number;
  Capex: number;
  dataConfidence?: number;
}

export const Flexible_manufacturing_roiInputSchema = z.object({
  Mach_Ded: z.number().min(0).default(0),
  Setup_Ded: z.number().min(0).default(0),
  Changeovers: z.number().min(0).default(0),
  Inv_High: z.number().min(0).default(0),
  Mach_FMS: z.number().min(0).default(0),
  Tool_FMS: z.number().min(0).default(0),
  Prog: z.number().min(0).default(0),
  Maint: z.number().min(0).default(0),
  TTM_Red: z.number().min(0).default(0),
  RevGain: z.number().min(0).default(0),
  CustPrem: z.number().min(0).default(0),
  Vol: z.number().min(0).default(0),
  WIP_Ded: z.number().min(0).default(0),
  WIP_Flex: z.number().min(0).default(0),
  CarryCost: z.number().min(0).default(0),
  Scrap_Ded: z.number().min(0).default(0),
  Scrap_Flex: z.number().min(0).default(0),
  UnitCost: z.number().min(0).default(0),
  Capex: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Flexible_manufacturing_roiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Mach_Ded + input.Setup_Ded * input.Changeovers + input.Inv_High; results["Cost_Ded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Ded"] = Number.NaN; }
  try { const v = input.Mach_FMS + input.Tool_FMS + input.Prog + input.Maint; results["Cost_Flex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Cost_Flex"] = Number.NaN; }
  try { const v = (input.TTM_Red * input.RevGain) + (input.CustPrem * input.Vol); results["FlexVal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FlexVal"] = Number.NaN; }
  try { const v = (input.WIP_Ded - input.WIP_Flex) * input.CarryCost; results["InvSav"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["InvSav"] = Number.NaN; }
  try { const v = (input.Scrap_Ded - input.Scrap_Flex) * input.Vol * input.UnitCost; results["ScrapRed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ScrapRed"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["Cost_Ded"])) - (toNumericFormulaValue(results["Cost_Flex"])) + (toNumericFormulaValue(results["FlexVal"])) + (toNumericFormulaValue(results["InvSav"])) + (toNumericFormulaValue(results["ScrapRed"]))) / input.Capex; results["ROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ROI"] = Number.NaN; }
  return results;
}


export function calculateFlexible_manufacturing_roi(input: Flexible_manufacturing_roiInput): Flexible_manufacturing_roiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ROI"]);
  const breakdown = {
    Cost_Ded: toNumericFormulaValue(values["Cost_Ded"]),
    Cost_Flex: toNumericFormulaValue(values["Cost_Flex"]),
    FlexVal: toNumericFormulaValue(values["FlexVal"]),
    InvSav: toNumericFormulaValue(values["InvSav"]),
    ScrapRed: toNumericFormulaValue(values["ScrapRed"]),
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


export interface Flexible_manufacturing_roiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Cost_Ded: number; Cost_Flex: number; FlexVal: number; InvSav: number; ScrapRed: number; ROI: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Flexible_manufacturing_roiOutputMeta = {
  primaryKey: "ROI",
  unit: "USD",
  breakdownKeys: ["Cost_Ded","Cost_Flex","FlexVal","InvSav","ScrapRed","ROI"],
} as const;

