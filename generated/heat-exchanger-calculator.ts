// Auto-generated from heat-exchanger-calculator-schema.json
import * as z from 'zod';

export interface Heat_exchanger_calculatorInput {
  massFlowHot: number;
  cpHot: number;
  tempHotIn: number;
  tempHotOut: number;
  massFlowCold: number;
  cpCold: number;
  tempColdIn: number;
  overallHeatTransferCoeff: number;
}

export const Heat_exchanger_calculatorInputSchema = z.object({
  massFlowHot: z.number().default(10),
  cpHot: z.number().default(4.2),
  tempHotIn: z.number().default(90),
  tempHotOut: z.number().default(60),
  massFlowCold: z.number().default(15),
  cpCold: z.number().default(4.18),
  tempColdIn: z.number().default(20),
  overallHeatTransferCoeff: z.number().default(500),
});

function evaluateAllFormulas(input: Heat_exchanger_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massFlowHot * input.cpHot * (input.tempHotIn - input.tempHotOut) * 1000; results["heatTransferRate"] = Number.isFinite(v) ? v : 0; } catch { results["heatTransferRate"] = 0; }
  try { const v = input.tempColdIn + ((results["heatTransferRate"] ?? 0) / (input.massFlowCold * input.cpCold * 1000)); results["tempColdOut"] = Number.isFinite(v) ? v : 0; } catch { results["tempColdOut"] = 0; }
  try { const v = ((input.tempHotIn - (results["tempColdOut"] ?? 0)) - (input.tempHotOut - input.tempColdIn)) / Math.log((input.tempHotIn - (results["tempColdOut"] ?? 0)) / (input.tempHotOut - input.tempColdIn)); results["logMeanTempDiff"] = Number.isFinite(v) ? v : 0; } catch { results["logMeanTempDiff"] = 0; }
  try { const v = (results["heatTransferRate"] ?? 0) / (input.overallHeatTransferCoeff * (results["logMeanTempDiff"] ?? 0)); results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  return results;
}


export function calculateHeat_exchanger_calculator(input: Heat_exchanger_calculatorInput): Heat_exchanger_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["heatTransferRate"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Heat_exchanger_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
