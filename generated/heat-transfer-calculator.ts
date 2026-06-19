// Auto-generated from heat-transfer-calculator-schema.json
import * as z from 'zod';

export interface Heat_transfer_calculatorInput {
  area: number;
  thickness: number;
  thermalConductivity: number;
  hInside: number;
  hOutside: number;
  tempInside: number;
  tempOutside: number;
  dataConfidence?: number;
}

export const Heat_transfer_calculatorInputSchema = z.object({
  area: z.number().default(1),
  thickness: z.number().default(0.1),
  thermalConductivity: z.number().default(0.5),
  hInside: z.number().default(10),
  hOutside: z.number().default(25),
  tempInside: z.number().default(100),
  tempOutside: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heat_transfer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * (input.tempInside - input.tempOutside) / (1/input.hInside + input.thickness/input.thermalConductivity + 1/input.hOutside); results["heatTransferRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heatTransferRate"] = 0; }
  try { const v = 1 / (1/input.hInside + input.thickness/input.thermalConductivity + 1/input.hOutside); results["overallHeatTransferCoeff"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overallHeatTransferCoeff"] = 0; }
  try { const v = input.tempInside - input.tempOutside; results["deltaTemp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deltaTemp"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeat_transfer_calculator(input: Heat_transfer_calculatorInput): Heat_transfer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["heatTransferRate"]));
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


export interface Heat_transfer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
