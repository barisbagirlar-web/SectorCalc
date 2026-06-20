// Auto-generated from battery-calculator-schema.json
import * as z from 'zod';

export interface Battery_calculatorInput {
  capacity: number;
  voltage: number;
  loadPower: number;
  dod: number;
  efficiency: number;
  numberOfBatteries: number;
  dataConfidence?: number;
}

export const Battery_calculatorInputSchema = z.object({
  capacity: z.number().default(100),
  voltage: z.number().default(12),
  loadPower: z.number().default(50),
  dod: z.number().default(50),
  efficiency: z.number().default(90),
  numberOfBatteries: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Battery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.capacity * input.voltage * input.numberOfBatteries; results["totalWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWh"] = Number.NaN; }
  try { const v = input.capacity * input.voltage * input.numberOfBatteries * (input.dod / 100) * (input.efficiency / 100); results["usableWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["usableWh"] = Number.NaN; }
  try { const v = input.capacity * input.numberOfBatteries; results["totalAh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["usableWh"])) / input.loadPower; results["runtimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["runtimeHours"] = Number.NaN; }
  return results;
}


export function calculateBattery_calculator(input: Battery_calculatorInput): Battery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["runtimeHours"]);
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


export interface Battery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
