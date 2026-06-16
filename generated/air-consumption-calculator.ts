// Auto-generated from air-consumption-calculator-schema.json
import * as z from 'zod';

export interface Air_consumption_calculatorInput {
  bore: number;
  stroke: number;
  pressure: number;
  cyclesPerMinute: number;
  atmospheric: number;
  actingFactor: number;
}

export const Air_consumption_calculatorInputSchema = z.object({
  bore: z.number().default(50),
  stroke: z.number().default(100),
  pressure: z.number().default(6),
  cyclesPerMinute: z.number().default(10),
  atmospheric: z.number().default(1.013),
  actingFactor: z.number().default(2),
});

function evaluateAllFormulas(input: Air_consumption_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * Math.pow(input.bore / 2, 2); results["pistonArea"] = Number.isFinite(v) ? v : 0; } catch { results["pistonArea"] = 0; }
  try { const v = Math.PI * Math.pow(input.bore / 2, 2) * input.stroke * (input.pressure + input.atmospheric) / input.atmospheric; results["volumePerCycle"] = Number.isFinite(v) ? v : 0; } catch { results["volumePerCycle"] = 0; }
  try { const v = Math.PI * Math.pow(input.bore / 2, 2) * input.stroke * (input.pressure + input.atmospheric) * input.cyclesPerMinute * input.actingFactor / input.atmospheric; results["totalConsumptionMM3"] = Number.isFinite(v) ? v : 0; } catch { results["totalConsumptionMM3"] = 0; }
  try { const v = Math.PI * Math.pow(input.bore / 2, 2) * input.stroke * (input.pressure + input.atmospheric) * input.cyclesPerMinute * input.actingFactor / (input.atmospheric * 1e6); results["consumptionLMin"] = Number.isFinite(v) ? v : 0; } catch { results["consumptionLMin"] = 0; }
  return results;
}


export function calculateAir_consumption_calculator(input: Air_consumption_calculatorInput): Air_consumption_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["consumptionLMin"] ?? 0;
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


export interface Air_consumption_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
