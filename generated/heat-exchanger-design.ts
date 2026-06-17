// @ts-nocheck
// Auto-generated from heat-exchanger-design-schema.json
import * as z from 'zod';

export interface Heat_exchanger_designInput {
  massFlowHot: number;
  cpHot: number;
  tempHotIn: number;
  tempHotOut: number;
  massFlowCold: number;
  cpCold: number;
  tempColdIn: number;
  overallHeatTransferCoeff: number;
}

export const Heat_exchanger_designInputSchema = z.object({
  massFlowHot: z.number().default(10),
  cpHot: z.number().default(4.2),
  tempHotIn: z.number().default(90),
  tempHotOut: z.number().default(60),
  massFlowCold: z.number().default(15),
  cpCold: z.number().default(4.18),
  tempColdIn: z.number().default(20),
  overallHeatTransferCoeff: z.number().default(500),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heat_exchanger_designInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.massFlowHot * input.cpHot * (input.tempHotIn - input.tempHotOut) * 1000; results["heatDuty"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heatDuty"] = 0; }
  try { const v = input.tempColdIn + ((asFormulaNumber(results["heatDuty"])) / (input.massFlowCold * input.cpCold * 1000)); results["tempColdOut"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tempColdOut"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHeat_exchanger_design(input: Heat_exchanger_designInput): Heat_exchanger_designOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["heatDuty"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Heat_exchanger_designOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
