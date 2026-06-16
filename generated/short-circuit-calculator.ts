// Auto-generated from short-circuit-calculator-schema.json
import * as z from 'zod';

export interface Short_circuit_calculatorInput {
  voltage: number;
  sourceImpedance: number;
  transformerRating: number;
  transformerImpedancePercent: number;
  cableLength: number;
  cableCrossSection: number;
  resistivity: number;
}

export const Short_circuit_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  sourceImpedance: z.number().default(0.01),
  transformerRating: z.number().default(1000),
  transformerImpedancePercent: z.number().default(5),
  cableLength: z.number().default(50),
  cableCrossSection: z.number().default(25),
  resistivity: z.number().default(0.0175),
});

function evaluateAllFormulas(input: Short_circuit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.voltage * input.voltage) / (input.transformerRating * 1000) * (input.transformerImpedancePercent / 100); results["transformerImpedance"] = Number.isFinite(v) ? v : 0; } catch { results["transformerImpedance"] = 0; }
  try { const v = (input.resistivity * input.cableLength) / input.cableCrossSection; results["cableImpedance"] = Number.isFinite(v) ? v : 0; } catch { results["cableImpedance"] = 0; }
  try { const v = input.sourceImpedance + (results["transformerImpedance"] ?? 0) + (results["cableImpedance"] ?? 0); results["totalImpedance"] = Number.isFinite(v) ? v : 0; } catch { results["totalImpedance"] = 0; }
  try { const v = input.voltage / (Math.sqrt(3) * (results["totalImpedance"] ?? 0)); results["shortCircuitCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["shortCircuitCurrent"] = 0; }
  return results;
}


export function calculateShort_circuit_calculator(input: Short_circuit_calculatorInput): Short_circuit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["shortCircuitCurrent"] ?? 0;
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


export interface Short_circuit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
