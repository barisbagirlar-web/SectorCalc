// Auto-generated from retaining-wall-drainage-calculator-schema.json
import * as z from 'zod';

export interface Retaining_wall_drainage_calculatorInput {
  wallHeight: number;
  wallLength: number;
  soilPermeability: number;
  pipeDiameter: number;
  pipeSlope: number;
  manningN: number;
  dataConfidence?: number;
}

export const Retaining_wall_drainage_calculatorInputSchema = z.object({
  wallHeight: z.number().default(3),
  wallLength: z.number().default(10),
  soilPermeability: z.number().default(0.00001),
  pipeDiameter: z.number().default(100),
  pipeSlope: z.number().default(1),
  manningN: z.number().default(0.013),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Retaining_wall_drainage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.soilPermeability * input.wallHeight * input.wallLength; results["inflowRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["inflowRate"] = 0; }
  try { const v = input.pipeDiameter / 1000; results["pipeDiameterM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pipeDiameterM"] = 0; }
  try { const v = input.pipeSlope / 100; results["pipeSlopeDec"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pipeSlopeDec"] = 0; }
  try { const v = (asFormulaNumber(results["pipeDiameterM"])) / 4; results["hydraulicRadius"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hydraulicRadius"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRetaining_wall_drainage_calculator(input: Retaining_wall_drainage_calculatorInput): Retaining_wall_drainage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hydraulicRadius"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Retaining_wall_drainage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
