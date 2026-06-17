// @ts-nocheck
// Auto-generated from battery-calculator-schema.json
import * as z from 'zod';

export interface Battery_calculatorInput {
  capacity: number;
  voltage: number;
  loadPower: number;
  dod: number;
  efficiency: number;
  numberOfBatteries: number;
}

export const Battery_calculatorInputSchema = z.object({
  capacity: z.number().default(100),
  voltage: z.number().default(12),
  loadPower: z.number().default(50),
  dod: z.number().default(50),
  efficiency: z.number().default(90),
  numberOfBatteries: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Battery_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.capacity * input.voltage * input.numberOfBatteries; results["totalWh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWh"] = 0; }
  try { const v = input.capacity * input.voltage * input.numberOfBatteries * (input.dod / 100) * (input.efficiency / 100); results["usableWh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["usableWh"] = 0; }
  try { const v = input.capacity * input.numberOfBatteries; results["totalAh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalAh"] = 0; }
  try { const v = (asFormulaNumber(results["usableWh"])) / input.loadPower; results["runtimeHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["runtimeHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBattery_calculator(input: Battery_calculatorInput): Battery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["runtimeHours"]);
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


export interface Battery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
