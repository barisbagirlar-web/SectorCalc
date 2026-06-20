// Auto-generated from lh-surge-calculator-schema.json
import * as z from 'zod';

export interface Lh_surge_calculatorInput {
  flowVelocity: number;
  pipeDiameter: number;
  pipeLength: number;
  valveCloseTime: number;
  waveSpeed: number;
  fluidDensity: number;
  wallThickness: number;
  dataConfidence?: number;
}

export const Lh_surge_calculatorInputSchema = z.object({
  flowVelocity: z.number().default(2),
  pipeDiameter: z.number().default(0.3),
  pipeLength: z.number().default(100),
  valveCloseTime: z.number().default(1),
  waveSpeed: z.number().default(1200),
  fluidDensity: z.number().default(1000),
  wallThickness: z.number().default(0.01),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lh_surge_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowVelocity * input.pipeDiameter * input.pipeLength * input.valveCloseTime; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.flowVelocity * input.pipeDiameter * input.pipeLength * input.valveCloseTime * (input.waveSpeed * input.fluidDensity * input.wallThickness); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.waveSpeed * input.fluidDensity * input.wallThickness; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateLh_surge_calculator(input: Lh_surge_calculatorInput): Lh_surge_calculatorOutput {
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


export interface Lh_surge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
