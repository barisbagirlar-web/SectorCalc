// Auto-generated from hazen-williams-calculator-schema.json
import * as z from 'zod';

export interface Hazen_williams_calculatorInput {
  flowRate: number;
  pipeDiameter: number;
  pipeLength: number;
  cFactor: number;
}

export const Hazen_williams_calculatorInputSchema = z.object({
  flowRate: z.number().default(0.01),
  pipeDiameter: z.number().default(0.1),
  pipeLength: z.number().default(100),
  cFactor: z.number().default(130),
});

function evaluateAllFormulas(input: Hazen_williams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate / (Math.PI * (input.pipeDiameter / 2) ** 2); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = (10.67 * input.pipeLength * input.flowRate ** 1.852) / (input.cFactor ** 1.852 * input.pipeDiameter ** 4.87); results["headLoss"] = Number.isFinite(v) ? v : 0; } catch { results["headLoss"] = 0; }
  try { const v = (10.67 * input.flowRate ** 1.852) / (input.cFactor ** 1.852 * input.pipeDiameter ** 4.87); results["headLossPerUnitLength"] = Number.isFinite(v) ? v : 0; } catch { results["headLossPerUnitLength"] = 0; }
  return results;
}


export function calculateHazen_williams_calculator(input: Hazen_williams_calculatorInput): Hazen_williams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["headLoss"] ?? 0;
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


export interface Hazen_williams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
