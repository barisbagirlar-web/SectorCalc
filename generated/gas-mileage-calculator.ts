// Auto-generated from gas-mileage-calculator-schema.json
import * as z from 'zod';

export interface Gas_mileage_calculatorInput {
  startOdometer: number;
  endOdometer: number;
  fuelGallons: number;
  fuelPricePerGallon: number;
  dataConfidence?: number;
}

export const Gas_mileage_calculatorInputSchema = z.object({
  startOdometer: z.number().default(0),
  endOdometer: z.number().default(0),
  fuelGallons: z.number().default(0),
  fuelPricePerGallon: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gas_mileage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.endOdometer - input.startOdometer) / input.fuelGallons; results["mpg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mpg"] = 0; }
  try { const v = (input.fuelGallons * input.fuelPricePerGallon) / (input.endOdometer - input.startOdometer); results["costPerMile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costPerMile"] = 0; }
  try { const v = input.endOdometer - input.startOdometer; results["totalDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDistance"] = 0; }
  try { const v = input.fuelGallons * input.fuelPricePerGallon; results["fuelCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelCostTotal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGas_mileage_calculator(input: Gas_mileage_calculatorInput): Gas_mileage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mpg"]);
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


export interface Gas_mileage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
