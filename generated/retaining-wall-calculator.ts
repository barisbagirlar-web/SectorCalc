// Auto-generated from retaining-wall-calculator-schema.json
import * as z from 'zod';

export interface Retaining_wall_calculatorInput {
  wallHeight: number;
  wallThickness: number;
  baseWidth: number;
  baseThickness: number;
  soilDensity: number;
  concreteDensity: number;
  frictionAngle: number;
}

export const Retaining_wall_calculatorInputSchema = z.object({
  wallHeight: z.number().default(3),
  wallThickness: z.number().default(0.3),
  baseWidth: z.number().default(2),
  baseThickness: z.number().default(0.4),
  soilDensity: z.number().default(18),
  concreteDensity: z.number().default(24),
  frictionAngle: z.number().default(30),
});

function evaluateAllFormulas(input: Retaining_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - Math.sin(input.frictionAngle * Math.PI / 180)) / (1 + Math.sin(input.frictionAngle * Math.PI / 180)); results["Ka"] = Number.isFinite(v) ? v : 0; } catch { results["Ka"] = 0; }
  try { const v = 0.5 * input.soilDensity * Math.pow(input.wallHeight, 2) * (results["Ka"] ?? 0); results["Pa"] = Number.isFinite(v) ? v : 0; } catch { results["Pa"] = 0; }
  try { const v = input.wallHeight * input.wallThickness * input.concreteDensity; results["W1"] = Number.isFinite(v) ? v : 0; } catch { results["W1"] = 0; }
  try { const v = input.baseWidth * input.baseThickness * input.concreteDensity; results["W2"] = Number.isFinite(v) ? v : 0; } catch { results["W2"] = 0; }
  try { const v = input.baseWidth - input.wallThickness; results["heel_length"] = Number.isFinite(v) ? v : 0; } catch { results["heel_length"] = 0; }
  try { const v = input.soilDensity * input.wallHeight * (results["heel_length"] ?? 0); results["W3"] = Number.isFinite(v) ? v : 0; } catch { results["W3"] = 0; }
  try { const v = (results["W1"] ?? 0) + (results["W2"] ?? 0) + (results["W3"] ?? 0); results["R"] = Number.isFinite(v) ? v : 0; } catch { results["R"] = 0; }
  try { const v = (results["Pa"] ?? 0) * (input.wallHeight / 3); results["Mo"] = Number.isFinite(v) ? v : 0; } catch { results["Mo"] = 0; }
  try { const v = (results["W1"] ?? 0) * (input.wallThickness / 2) + (results["W2"] ?? 0) * (input.baseWidth / 2) + (results["W3"] ?? 0) * ((input.baseWidth + input.wallThickness) / 2); results["Mr"] = Number.isFinite(v) ? v : 0; } catch { results["Mr"] = 0; }
  try { const v = (results["Mr"] ?? 0) / (results["Mo"] ?? 0); results["FS_overturning"] = Number.isFinite(v) ? v : 0; } catch { results["FS_overturning"] = 0; }
  try { const v = (results["R"] ?? 0) * Math.tan(input.frictionAngle * Math.PI / 180) / (results["Pa"] ?? 0); results["FS_sliding"] = Number.isFinite(v) ? v : 0; } catch { results["FS_sliding"] = 0; }
  try { const v = ((results["Mr"] ?? 0) - (results["Mo"] ?? 0)) / (results["R"] ?? 0); results["x_bar"] = Number.isFinite(v) ? v : 0; } catch { results["x_bar"] = 0; }
  try { const v = (input.baseWidth / 2) - (results["x_bar"] ?? 0); results["e"] = Number.isFinite(v) ? v : 0; } catch { results["e"] = 0; }
  try { const v = (results["e"] ?? 0) <= input.baseWidth / 6 ? ((results["R"] ?? 0) / input.baseWidth) * (1 + 6 * (results["e"] ?? 0) / input.baseWidth) : (2 * (results["R"] ?? 0)) / (3 * (input.baseWidth / 2 - (results["e"] ?? 0))); results["q_max"] = Number.isFinite(v) ? v : 0; } catch { results["q_max"] = 0; }
  try { const v = (results["e"] ?? 0) <= input.baseWidth / 6 ? ((results["R"] ?? 0) / input.baseWidth) * (1 - 6 * (results["e"] ?? 0) / input.baseWidth) : 0; results["q_min"] = Number.isFinite(v) ? v : 0; } catch { results["q_min"] = 0; }
  return results;
}


export function calculateRetaining_wall_calculator(input: Retaining_wall_calculatorInput): Retaining_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["FS_sliding"] ?? 0;
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


export interface Retaining_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
