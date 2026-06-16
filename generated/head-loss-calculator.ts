// Auto-generated from head-loss-calculator-schema.json
import * as z from 'zod';

export interface Head_loss_calculatorInput {
  length: number;
  diameter: number;
  flowRate: number;
  roughness: number;
  kinematicViscosity: number;
  gravity: number;
}

export const Head_loss_calculatorInputSchema = z.object({
  length: z.number().default(100),
  diameter: z.number().default(0.1),
  flowRate: z.number().default(0.01),
  roughness: z.number().default(0.00015),
  kinematicViscosity: z.number().default(0.000001),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Head_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.diameter/2) ** 2; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = input.flowRate / (results["area"] ?? 0); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = (results["velocity"] ?? 0) * input.diameter / input.kinematicViscosity; results["reynolds"] = Number.isFinite(v) ? v : 0; } catch { results["reynolds"] = 0; }
  try { const v = (results["reynolds"] ?? 0) < 2300 ? 64/(results["reynolds"] ?? 0) : 0.25 / (Math.log10( (input.roughness/input.diameter)/3.7 + 5.74/(results["reynolds"] ?? 0)**0.9 )) ** 2; results["frictionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["frictionFactor"] = 0; }
  try { const v = (results["frictionFactor"] ?? 0) * (input.length/input.diameter) * ((results["velocity"] ?? 0)**2 / (2*input.gravity)); results["headLoss"] = Number.isFinite(v) ? v : 0; } catch { results["headLoss"] = 0; }
  return results;
}


export function calculateHead_loss_calculator(input: Head_loss_calculatorInput): Head_loss_calculatorOutput {
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


export interface Head_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
