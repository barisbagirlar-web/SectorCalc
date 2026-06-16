// Auto-generated from principal-stress-calculator-schema.json
import * as z from 'zod';

export interface Principal_stress_calculatorInput {
  sigmaX: number;
  sigmaY: number;
  tauXY: number;
  theta: number;
}

export const Principal_stress_calculatorInputSchema = z.object({
  sigmaX: z.number().default(0),
  sigmaY: z.number().default(0),
  tauXY: z.number().default(0),
  theta: z.number().default(0),
});

function evaluateAllFormulas(input: Principal_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sigmaX + input.sigmaY) / 2; results["sigmaAvg"] = Number.isFinite(v) ? v : 0; } catch { results["sigmaAvg"] = 0; }
  try { const v = Math.sqrt((((input.sigmaX - input.sigmaY) / 2) ** 2) + (input.tauXY ** 2)); results["R"] = Number.isFinite(v) ? v : 0; } catch { results["R"] = 0; }
  try { const v = (results["sigmaAvg"] ?? 0) + (results["R"] ?? 0); results["sigma1"] = Number.isFinite(v) ? v : 0; } catch { results["sigma1"] = 0; }
  try { const v = (results["sigmaAvg"] ?? 0) - (results["R"] ?? 0); results["sigma2"] = Number.isFinite(v) ? v : 0; } catch { results["sigma2"] = 0; }
  try { const v = (results["R"] ?? 0); results["tauMax"] = Number.isFinite(v) ? v : 0; } catch { results["tauMax"] = 0; }
  try { const v = input.theta * 0.017453292519943295; results["thetaRad"] = Number.isFinite(v) ? v : 0; } catch { results["thetaRad"] = 0; }
  try { const v = (results["sigmaAvg"] ?? 0) + ((input.sigmaX - input.sigmaY) / 2) * Math.cos(2 * (results["thetaRad"] ?? 0)) + input.tauXY * Math.sin(2 * (results["thetaRad"] ?? 0)); results["sigmaTheta"] = Number.isFinite(v) ? v : 0; } catch { results["sigmaTheta"] = 0; }
  return results;
}


export function calculatePrincipal_stress_calculator(input: Principal_stress_calculatorInput): Principal_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sigma1"] ?? 0;
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


export interface Principal_stress_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
