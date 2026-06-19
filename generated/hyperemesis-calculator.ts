// Auto-generated from hyperemesis-calculator-schema.json
import * as z from 'zod';

export interface Hyperemesis_calculatorInput {
  fuelOil: number;
  naturalGas: number;
  electricity: number;
  coal: number;
  gasoline: number;
  diesel: number;
  waste: number;
  dataConfidence?: number;
}

export const Hyperemesis_calculatorInputSchema = z.object({
  fuelOil: z.number().default(0),
  naturalGas: z.number().default(0),
  electricity: z.number().default(0),
  coal: z.number().default(0),
  gasoline: z.number().default(0),
  diesel: z.number().default(0),
  waste: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hyperemesis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricity * 0.5; results["electricEmission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["electricEmission"] = 0; }
  try { const v = input.fuelOil * 2.7; results["fuelOilEmission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelOilEmission"] = 0; }
  try { const v = input.naturalGas * 1.9; results["naturalGasEmission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["naturalGasEmission"] = 0; }
  try { const v = input.gasoline * 2.3; results["gasolineEmission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gasolineEmission"] = 0; }
  try { const v = input.diesel * 2.7; results["dieselEmission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dieselEmission"] = 0; }
  try { const v = input.coal * 2.5; results["coalEmission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coalEmission"] = 0; }
  try { const v = input.waste * 1.0; results["wasteEmission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteEmission"] = 0; }
  try { const v = (asFormulaNumber(results["electricEmission"])) + (asFormulaNumber(results["fuelOilEmission"])) + (asFormulaNumber(results["naturalGasEmission"])) + (asFormulaNumber(results["gasolineEmission"])) + (asFormulaNumber(results["dieselEmission"])) + (asFormulaNumber(results["coalEmission"])) + (asFormulaNumber(results["wasteEmission"])); results["totalEmission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEmission"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHyperemesis_calculator(input: Hyperemesis_calculatorInput): Hyperemesis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEmission"]);
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


export interface Hyperemesis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
