// Auto-generated from heat-exchanger-area-calculator-schema.json
import * as z from 'zod';

export interface Heat_exchanger_area_calculatorInput {
  heatDuty: number;
  overallCoefficient: number;
  hotInletTemp: number;
  hotOutletTemp: number;
  coldInletTemp: number;
  coldOutletTemp: number;
  dataConfidence?: number;
}

export const Heat_exchanger_area_calculatorInputSchema = z.object({
  heatDuty: z.number().default(100),
  overallCoefficient: z.number().default(500),
  hotInletTemp: z.number().default(150),
  hotOutletTemp: z.number().default(100),
  coldInletTemp: z.number().default(30),
  coldOutletTemp: z.number().default(80),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heat_exchanger_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heatDuty * 1000; results["heatDutyW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heatDutyW"] = 0; }
  try { const v = input.hotInletTemp - input.coldOutletTemp; results["deltaT1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deltaT1"] = 0; }
  try { const v = input.hotOutletTemp - input.coldInletTemp; results["deltaT2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deltaT2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeat_exchanger_area_calculator(input: Heat_exchanger_area_calculatorInput): Heat_exchanger_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["deltaT2"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
