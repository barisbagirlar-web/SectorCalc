// Auto-generated from circuit-training-calculator-schema.json
import * as z from 'zod';

export interface Circuit_training_calculatorInput {
  sourceVoltage: number;
  resistor1: number;
  resistor2: number;
  connectionType: number;
}

export const Circuit_training_calculatorInputSchema = z.object({
  sourceVoltage: z.number().default(12),
  resistor1: z.number().default(100),
  resistor2: z.number().default(200),
  connectionType: z.number().default(1),
});

function evaluateAllFormulas(input: Circuit_training_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.connectionType === 1 ? input.resistor1 + input.resistor2 : 1 / (1 / input.resistor1 + 1 / input.resistor2); results["totalResistance"] = Number.isFinite(v) ? v : 0; } catch { results["totalResistance"] = 0; }
  try { const v = input.sourceVoltage / (results["totalResistance"] ?? 0); results["totalCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["totalCurrent"] = 0; }
  try { const v = input.sourceVoltage * (results["totalCurrent"] ?? 0); results["totalPower"] = Number.isFinite(v) ? v : 0; } catch { results["totalPower"] = 0; }
  return results;
}


export function calculateCircuit_training_calculator(input: Circuit_training_calculatorInput): Circuit_training_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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
