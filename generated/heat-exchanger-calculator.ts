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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heat_exchanger_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massFlowHot * input.cpHot * (input.tempHotIn - input.tempHotOut) * 1000; results["heatTransferRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heatTransferRate"] = 0; }
  try { const v = input.tempColdIn + ((asFormulaNumber(results["heatTransferRate"])) / (input.massFlowCold * input.cpCold * 1000)); results["tempColdOut"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tempColdOut"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeat_exchanger_calculator(input: Heat_exchanger_calculatorInput): Heat_exchanger_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["heatTransferRate"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
