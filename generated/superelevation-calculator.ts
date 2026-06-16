// Auto-generated from superelevation-calculator-schema.json
import * as z from 'zod';

export interface Superelevation_calculatorInput {
  designSpeed: number;
  curveRadius: number;
  frictionCoeff: number;
  maxSuperelevation: number;
  gravity: number;
}

export const Superelevation_calculatorInputSchema = z.object({
  designSpeed: z.number().default(80),
  curveRadius: z.number().default(200),
  frictionCoeff: z.number().default(0.15),
  maxSuperelevation: z.number().default(8),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Superelevation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.designSpeed / 3.6; results["V_ms"] = Number.isFinite(v) ? v : 0; } catch { results["V_ms"] = 0; }
  try { const v = (((results["V_ms"] ?? 0)**2 / (input.gravity * input.curveRadius)) - input.frictionCoeff) * 100; results["requiredE_percent"] = Number.isFinite(v) ? v : 0; } catch { results["requiredE_percent"] = 0; }
  try { const v = Math.max(0, Math.min((results["requiredE_percent"] ?? 0), input.maxSuperelevation)); results["requiredSuperelevation"] = Number.isFinite(v) ? v : 0; } catch { results["requiredSuperelevation"] = 0; }
  try { const v = (results["requiredE_percent"] ?? 0); results["calculatedSuperelevation"] = Number.isFinite(v) ? v : 0; } catch { results["calculatedSuperelevation"] = 0; }
  try { const v = (results["requiredE_percent"] ?? 0) > input.maxSuperelevation; results["isSuperelevationCapped"] = Number.isFinite(v) ? v : 0; } catch { results["isSuperelevationCapped"] = 0; }
  try { const v = ((results["V_ms"] ?? 0)**2 / (input.gravity * input.curveRadius)) - ((results["requiredSuperelevation"] ?? 0) / 100); results["requiredFrictionCoefficient"] = Number.isFinite(v) ? v : 0; } catch { results["requiredFrictionCoefficient"] = 0; }
  return results;
}


export function calculateSuperelevation_calculator(input: Superelevation_calculatorInput): Superelevation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredSuperelevation"] ?? 0;
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


export interface Superelevation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
