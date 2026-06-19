// Auto-generated from co2-emissions-calculator-schema.json
import * as z from 'zod';

export interface Co2_emissions_calculatorInput {
  electricity: number;
  naturalGas: number;
  diesel: number;
  gasoline: number;
  lpg: number;
  dataConfidence?: number;
}

export const Co2_emissions_calculatorInputSchema = z.object({
  electricity: z.number().default(0),
  naturalGas: z.number().default(0),
  diesel: z.number().default(0),
  gasoline: z.number().default(0),
  lpg: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Co2_emissions_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricity * 0.5; results["electricityEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["electricityEmissions"] = 0; }
  try { const v = input.naturalGas * 2.0; results["naturalGasEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["naturalGasEmissions"] = 0; }
  try { const v = input.diesel * 2.68; results["dieselEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dieselEmissions"] = 0; }
  try { const v = input.gasoline * 2.31; results["gasolineEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gasolineEmissions"] = 0; }
  try { const v = input.lpg * 1.6; results["lpgEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lpgEmissions"] = 0; }
  try { const v = input.electricity * 0.5 + input.naturalGas * 2.0 + input.diesel * 2.68 + input.gasoline * 2.31 + input.lpg * 1.6; results["totalEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEmissions"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCo2_emissions_calculator(input: Co2_emissions_calculatorInput): Co2_emissions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalEmissions"]));
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


export interface Co2_emissions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
