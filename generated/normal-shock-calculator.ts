// Auto-generated from normal-shock-calculator-schema.json
import * as z from 'zod';

export interface Normal_shock_calculatorInput {
  upstreamMach: number;
  gamma: number;
  upstreamPressure: number;
  upstreamTemperature: number;
  dataConfidence?: number;
}

export const Normal_shock_calculatorInputSchema = z.object({
  upstreamMach: z.number().default(2),
  gamma: z.number().default(1.4),
  upstreamPressure: z.number().default(101325),
  upstreamTemperature: z.number().default(300),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Normal_shock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 + (2*input.gamma/(input.gamma+1))*(input.upstreamMach**2 - 1); results["pressureRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressureRatio"] = 0; }
  try { const v = (1 + (2*input.gamma/(input.gamma+1))*(input.upstreamMach**2 - 1)) * ((2 + (input.gamma-1)*input.upstreamMach**2)/((input.gamma+1)*input.upstreamMach**2)); results["temperatureRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["temperatureRatio"] = 0; }
  try { const v = (input.gamma+1)*input.upstreamMach**2 / (2 + (input.gamma-1)*input.upstreamMach**2); results["densityRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["densityRatio"] = 0; }
  try { const v = (( (input.gamma+1)*input.upstreamMach**2 )/(2 + (input.gamma-1)*input.upstreamMach**2))**(input.gamma/(input.gamma-1)) * ((input.gamma+1)/(2*input.gamma*input.upstreamMach**2 - (input.gamma-1)))**(1/(input.gamma-1)); results["stagnationPressureRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stagnationPressureRatio"] = 0; }
  try { const v = (asFormulaNumber(results["pressureRatio"])) * input.upstreamPressure; results["downstreamPressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["downstreamPressure"] = 0; }
  try { const v = (asFormulaNumber(results["temperatureRatio"])) * input.upstreamTemperature; results["downstreamTemperature"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["downstreamTemperature"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNormal_shock_calculator(input: Normal_shock_calculatorInput): Normal_shock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["downstreamTemperature"]));
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


export interface Normal_shock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
