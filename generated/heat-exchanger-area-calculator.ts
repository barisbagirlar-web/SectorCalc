// Auto-generated from heat-exchanger-area-calculator-schema.json
import * as z from 'zod';

export interface Heat_exchanger_area_calculatorInput {
  heatDuty: number;
  overallCoefficient: number;
  hotInletTemp: number;
  hotOutletTemp: number;
  coldInletTemp: number;
  coldOutletTemp: number;
}

export const Heat_exchanger_area_calculatorInputSchema = z.object({
  heatDuty: z.number().default(100),
  overallCoefficient: z.number().default(500),
  hotInletTemp: z.number().default(150),
  hotOutletTemp: z.number().default(100),
  coldInletTemp: z.number().default(30),
  coldOutletTemp: z.number().default(80),
});

function evaluateAllFormulas(input: Heat_exchanger_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heatDuty * 1000; results["heatDutyW"] = Number.isFinite(v) ? v : 0; } catch { results["heatDutyW"] = 0; }
  try { const v = input.hotInletTemp - input.coldOutletTemp; results["deltaT1"] = Number.isFinite(v) ? v : 0; } catch { results["deltaT1"] = 0; }
  try { const v = input.hotOutletTemp - input.coldInletTemp; results["deltaT2"] = Number.isFinite(v) ? v : 0; } catch { results["deltaT2"] = 0; }
  try { const v = Math.abs((results["deltaT1"] ?? 0) - (results["deltaT2"] ?? 0)) < 1e-10 ? (results["deltaT1"] ?? 0) : ((results["deltaT1"] ?? 0) - (results["deltaT2"] ?? 0)) / Math.log((results["deltaT1"] ?? 0) / (results["deltaT2"] ?? 0)); results["lmtd"] = Number.isFinite(v) ? v : 0; } catch { results["lmtd"] = 0; }
  try { const v = (results["heatDutyW"] ?? 0) / (input.overallCoefficient * (results["lmtd"] ?? 0)); results["requiredArea"] = Number.isFinite(v) ? v : 0; } catch { results["requiredArea"] = 0; }
  return results;
}


export function calculateHeat_exchanger_area_calculator(input: Heat_exchanger_area_calculatorInput): Heat_exchanger_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredArea"] ?? 0;
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


export interface Heat_exchanger_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
