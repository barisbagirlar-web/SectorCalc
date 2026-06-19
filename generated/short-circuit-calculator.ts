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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Short_circuit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.voltage * input.voltage) / (input.transformerRating * 1000) * (input.transformerImpedancePercent / 100); results["transformerImpedance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["transformerImpedance"] = 0; }
  try { const v = (input.resistivity * input.cableLength) / input.cableCrossSection; results["cableImpedance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cableImpedance"] = 0; }
  try { const v = input.sourceImpedance + (asFormulaNumber(results["transformerImpedance"])) + (asFormulaNumber(results["cableImpedance"])); results["totalImpedance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalImpedance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateShort_circuit_calculator(input: Short_circuit_calculatorInput): Short_circuit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalImpedance"]));
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


export interface Short_circuit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
