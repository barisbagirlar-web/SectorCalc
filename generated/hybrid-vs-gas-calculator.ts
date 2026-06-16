// Auto-generated from hybrid-vs-gas-calculator-schema.json
import * as z from 'zod';

export interface Hybrid_vs_gas_calculatorInput {
  gasVehiclePrice: number;
  hybridVehiclePrice: number;
  gasMpg: number;
  hybridMpg: number;
  annualMiles: number;
  fuelPricePerGallon: number;
}

export const Hybrid_vs_gas_calculatorInputSchema = z.object({
  gasVehiclePrice: z.number().default(25000),
  hybridVehiclePrice: z.number().default(28000),
  gasMpg: z.number().default(30),
  hybridMpg: z.number().default(50),
  annualMiles: z.number().default(12000),
  fuelPricePerGallon: z.number().default(3.5),
});

function evaluateAllFormulas(input: Hybrid_vs_gas_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualMiles / input.gasMpg) * input.fuelPricePerGallon; results["annualFuelCostGas"] = Number.isFinite(v) ? v : 0; } catch { results["annualFuelCostGas"] = 0; }
  try { const v = (input.annualMiles / input.hybridMpg) * input.fuelPricePerGallon; results["annualFuelCostHybrid"] = Number.isFinite(v) ? v : 0; } catch { results["annualFuelCostHybrid"] = 0; }
  try { const v = ((input.annualMiles / input.gasMpg) - (input.annualMiles / input.hybridMpg)) * input.fuelPricePerGallon; results["annualSavings"] = Number.isFinite(v) ? v : 0; } catch { results["annualSavings"] = 0; }
  try { const v = (input.hybridVehiclePrice - input.gasVehiclePrice) / (((input.annualMiles / input.gasMpg) - (input.annualMiles / input.hybridMpg)) * input.fuelPricePerGallon); results["paybackYears"] = Number.isFinite(v) ? v : 0; } catch { results["paybackYears"] = 0; }
  return results;
}


export function calculateHybrid_vs_gas_calculator(input: Hybrid_vs_gas_calculatorInput): Hybrid_vs_gas_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["paybackYears"] ?? 0;
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


export interface Hybrid_vs_gas_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
