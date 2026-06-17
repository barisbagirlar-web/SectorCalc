// Auto-generated from circuit-training-calculator-schema.json
import * as z from 'zod';

export interface Circuit_training_calculatorInput {
  voltage: number;
  resistance1: number;
  resistance2: number;
}

export const Circuit_training_calculatorInputSchema = z.object({
  voltage: z.number().default(12),
  resistance1: z.number().default(1000),
  resistance2: z.number().default(2200),
});

function evaluateAllFormulas(input: Circuit_training_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.resistance1 + input.resistance2; results["totalResistance"] = Number.isFinite(v) ? v : 0; } catch { results["totalResistance"] = 0; }
  try { const v = input.voltage / (results["totalResistance"] ?? 0); results["current"] = Number.isFinite(v) ? v : 0; } catch { results["current"] = 0; }
  try { const v = input.voltage * (results["current"] ?? 0); results["powerTotal"] = Number.isFinite(v) ? v : 0; } catch { results["powerTotal"] = 0; }
  try { const v = (results["current"] ?? 0) * (results["current"] ?? 0) * input.resistance1; results["powerR1"] = Number.isFinite(v) ? v : 0; } catch { results["powerR1"] = 0; }
  try { const v = (results["current"] ?? 0) * (results["current"] ?? 0) * input.resistance2; results["powerR2"] = Number.isFinite(v) ? v : 0; } catch { results["powerR2"] = 0; }
  return results;
}


export function calculateCircuit_training_calculator(input: Circuit_training_calculatorInput): Circuit_training_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["current"] ?? 0;
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


export interface Circuit_training_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
