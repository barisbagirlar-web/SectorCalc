// Auto-generated from normal-shock-calculator-schema.json
import * as z from 'zod';

export interface Normal_shock_calculatorInput {
  upstreamMach: number;
  gamma: number;
  upstreamPressure: number;
  upstreamTemperature: number;
}

export const Normal_shock_calculatorInputSchema = z.object({
  upstreamMach: z.number().default(2),
  gamma: z.number().default(1.4),
  upstreamPressure: z.number().default(101325),
  upstreamTemperature: z.number().default(300),
});

function evaluateAllFormulas(input: Normal_shock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((1 + (input.gamma - 1)/2 * input.upstreamMach**2) / (input.gamma * input.upstreamMach**2 - (input.gamma - 1)/2)); results["downstreamMach"] = Number.isFinite(v) ? v : 0; } catch { results["downstreamMach"] = 0; }
  try { const v = 1 + (2*input.gamma/(input.gamma+1))*(input.upstreamMach**2 - 1); results["pressureRatio"] = Number.isFinite(v) ? v : 0; } catch { results["pressureRatio"] = 0; }
  try { const v = (1 + (2*input.gamma/(input.gamma+1))*(input.upstreamMach**2 - 1)) * ((2 + (input.gamma-1)*input.upstreamMach**2)/((input.gamma+1)*input.upstreamMach**2)); results["temperatureRatio"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureRatio"] = 0; }
  try { const v = (input.gamma+1)*input.upstreamMach**2 / (2 + (input.gamma-1)*input.upstreamMach**2); results["densityRatio"] = Number.isFinite(v) ? v : 0; } catch { results["densityRatio"] = 0; }
  try { const v = (( (input.gamma+1)*input.upstreamMach**2 )/(2 + (input.gamma-1)*input.upstreamMach**2))**(input.gamma/(input.gamma-1)) * ((input.gamma+1)/(2*input.gamma*input.upstreamMach**2 - (input.gamma-1)))**(1/(input.gamma-1)); results["stagnationPressureRatio"] = Number.isFinite(v) ? v : 0; } catch { results["stagnationPressureRatio"] = 0; }
  try { const v = (results["pressureRatio"] ?? 0) * input.upstreamPressure; results["downstreamPressure"] = Number.isFinite(v) ? v : 0; } catch { results["downstreamPressure"] = 0; }
  try { const v = (results["temperatureRatio"] ?? 0) * input.upstreamTemperature; results["downstreamTemperature"] = Number.isFinite(v) ? v : 0; } catch { results["downstreamTemperature"] = 0; }
  return results;
}


export function calculateNormal_shock_calculator(input: Normal_shock_calculatorInput): Normal_shock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["downstreamMach"] ?? 0;
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


export interface Normal_shock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
