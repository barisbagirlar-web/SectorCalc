// Auto-generated from gasket-calculator-schema.json
import * as z from 'zod';

export interface Gasket_calculatorInput {
  innerDiameter: number;
  outerDiameter: number;
  designPressure: number;
  gasketFactor: number;
  seatingStress: number;
  boltCount: number;
  dataConfidence?: number;
}

export const Gasket_calculatorInputSchema = z.object({
  innerDiameter: z.number().default(50),
  outerDiameter: z.number().default(100),
  designPressure: z.number().default(16),
  gasketFactor: z.number().default(2.5),
  seatingStress: z.number().default(20),
  boltCount: z.number().default(4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gasket_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.designPressure * 0.1; results["pressureMPa"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressureMPa"] = 0; }
  try { const v = (input.innerDiameter + input.outerDiameter) / 2; results["meanDiam"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanDiam"] = 0; }
  try { const v = (input.outerDiameter - input.innerDiameter) / 2; results["effWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effWidth"] = 0; }
  try { const v = (Math.PI * (asFormulaNumber(results["meanDiam"]))**2 * (asFormulaNumber(results["pressureMPa"])) / 4) + (2 * (asFormulaNumber(results["effWidth"])) * Math.PI * (asFormulaNumber(results["meanDiam"])) * input.gasketFactor * (asFormulaNumber(results["pressureMPa"]))); results["operatingForce"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["operatingForce"] = 0; }
  try { const v = Math.PI * (asFormulaNumber(results["effWidth"])) * (asFormulaNumber(results["meanDiam"])) * input.seatingStress; results["seatingForce"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["seatingForce"] = 0; }
  try { const v = (asFormulaNumber(results["operatingForce"])) / input.boltCount; results["operatingForcePerBolt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["operatingForcePerBolt"] = 0; }
  try { const v = (asFormulaNumber(results["seatingForce"])) / input.boltCount; results["seatingForcePerBolt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["seatingForcePerBolt"] = 0; }
  try { const v = Math.PI / 4 * (input.outerDiameter**2 - input.innerDiameter**2); results["effectiveArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGasket_calculator(input: Gasket_calculatorInput): Gasket_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["effectiveArea"]);
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


export interface Gasket_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
