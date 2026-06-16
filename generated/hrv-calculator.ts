// Auto-generated from hrv-calculator-schema.json
import * as z from 'zod';

export interface Hrv_calculatorInput {
  outdoorTemp: number;
  indoorTemp: number;
  supplyTemp: number;
  exhaustTemp: number;
  airFlowRate: number;
  airDensity: number;
  specificHeat: number;
  operatingHours: number;
}

export const Hrv_calculatorInputSchema = z.object({
  outdoorTemp: z.number().default(5),
  indoorTemp: z.number().default(20),
  supplyTemp: z.number().default(15),
  exhaustTemp: z.number().default(10),
  airFlowRate: z.number().default(500),
  airDensity: z.number().default(1.2),
  specificHeat: z.number().default(1.005),
  operatingHours: z.number().default(4000),
});

function evaluateAllFormulas(input: Hrv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.supplyTemp - input.outdoorTemp) / (input.indoorTemp - input.outdoorTemp); results["effectiveness"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveness"] = 0; }
  try { const v = (input.airFlowRate * input.airDensity * input.specificHeat * (input.supplyTemp - input.outdoorTemp)) / 3600; results["heatRate"] = Number.isFinite(v) ? v : 0; } catch { results["heatRate"] = 0; }
  try { const v = (results["heatRate"] ?? 0) * input.operatingHours; results["annualEnergySaved"] = Number.isFinite(v) ? v : 0; } catch { results["annualEnergySaved"] = 0; }
  return results;
}


export function calculateHrv_calculator(input: Hrv_calculatorInput): Hrv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveness"] ?? 0;
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


export interface Hrv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
