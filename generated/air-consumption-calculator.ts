// Auto-generated from air-consumption-calculator-schema.json
import * as z from 'zod';

export interface Air_consumption_calculatorInput {
  bore: number;
  stroke: number;
  pressure: number;
  cyclesPerMinute: number;
  atmospheric: number;
  actingFactor: number;
  dataConfidence?: number;
}

export const Air_consumption_calculatorInputSchema = z.object({
  bore: z.number().default(50),
  stroke: z.number().default(100),
  pressure: z.number().default(6),
  cyclesPerMinute: z.number().default(10),
  atmospheric: z.number().default(1.013),
  actingFactor: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Air_consumption_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bore * input.stroke * input.pressure * input.cyclesPerMinute; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.bore * input.stroke * input.pressure * input.cyclesPerMinute * (input.atmospheric * input.actingFactor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.atmospheric * input.actingFactor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAir_consumption_calculator(input: Air_consumption_calculatorInput): Air_consumption_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Air_consumption_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
