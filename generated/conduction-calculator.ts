// @ts-nocheck
// Auto-generated from conduction-calculator-schema.json
import * as z from 'zod';

export interface Conduction_calculatorInput {
  thermalConductivity: number;
  area: number;
  hotTemp: number;
  coldTemp: number;
  thickness: number;
}

export const Conduction_calculatorInputSchema = z.object({
  thermalConductivity: z.number().default(0.04),
  area: z.number().default(1),
  hotTemp: z.number().default(100),
  coldTemp: z.number().default(20),
  thickness: z.number().default(0.1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Conduction_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.thermalConductivity * input.area * (input.hotTemp - input.coldTemp)) / input.thickness; results["heatTransferRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heatTransferRate"] = 0; }
  try { const v = input.thickness / (input.thermalConductivity * input.area); results["thermalResistance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["thermalResistance"] = 0; }
  try { const v = (input.thermalConductivity * (input.hotTemp - input.coldTemp)) / input.thickness; results["heatFlux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heatFlux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConduction_calculator(input: Conduction_calculatorInput): Conduction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["heatTransferRate"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Conduction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
