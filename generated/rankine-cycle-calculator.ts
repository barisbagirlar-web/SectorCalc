// Auto-generated from rankine-cycle-calculator-schema.json
import * as z from 'zod';

export interface Rankine_cycle_calculatorInput {
  turbineInletEnthalpy: number;
  turbineExitIsentropicEnthalpy: number;
  condenserOutletEnthalpy: number;
  pumpExitIsentropicEnthalpy: number;
  turbineEfficiency: number;
  pumpEfficiency: number;
  dataConfidence?: number;
}

export const Rankine_cycle_calculatorInputSchema = z.object({
  turbineInletEnthalpy: z.number().default(2800),
  turbineExitIsentropicEnthalpy: z.number().default(2000),
  condenserOutletEnthalpy: z.number().default(200),
  pumpExitIsentropicEnthalpy: z.number().default(210),
  turbineEfficiency: z.number().default(0.9),
  pumpEfficiency: z.number().default(0.85),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rankine_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.turbineInletEnthalpy - input.turbineExitIsentropicEnthalpy) * input.turbineEfficiency; results["turbineWork"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["turbineWork"] = 0; }
  try { const v = (input.pumpExitIsentropicEnthalpy - input.condenserOutletEnthalpy) / input.pumpEfficiency; results["pumpWork"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pumpWork"] = 0; }
  try { const v = (input.turbineInletEnthalpy - input.turbineExitIsentropicEnthalpy) * input.turbineEfficiency - (input.pumpExitIsentropicEnthalpy - input.condenserOutletEnthalpy) / input.pumpEfficiency; results["netWork"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netWork"] = 0; }
  try { const v = (input.turbineInletEnthalpy - input.condenserOutletEnthalpy) - (input.pumpExitIsentropicEnthalpy - input.condenserOutletEnthalpy) / input.pumpEfficiency; results["heatAdded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heatAdded"] = 0; }
  try { const v = ((input.turbineInletEnthalpy - input.turbineExitIsentropicEnthalpy) * input.turbineEfficiency - (input.pumpExitIsentropicEnthalpy - input.condenserOutletEnthalpy) / input.pumpEfficiency) / ((input.turbineInletEnthalpy - input.condenserOutletEnthalpy) - (input.pumpExitIsentropicEnthalpy - input.condenserOutletEnthalpy) / input.pumpEfficiency); results["thermalEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["thermalEfficiency"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRankine_cycle_calculator(input: Rankine_cycle_calculatorInput): Rankine_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["thermalEfficiency"]);
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


export interface Rankine_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
