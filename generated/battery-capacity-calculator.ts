// @ts-nocheck
// Auto-generated from battery-capacity-calculator-schema.json
import * as z from 'zod';

export interface Battery_capacity_calculatorInput {
  loadPower: number;
  backupTime: number;
  voltage: number;
  efficiency: number;
  depthOfDischarge: number;
}

export const Battery_capacity_calculatorInputSchema = z.object({
  loadPower: z.number().default(100),
  backupTime: z.number().default(1),
  voltage: z.number().default(12),
  efficiency: z.number().default(0.9),
  depthOfDischarge: z.number().default(0.8),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Battery_capacity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.loadPower * input.backupTime) / (input.voltage * input.efficiency * input.depthOfDischarge); results["capacityAh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["capacityAh"] = 0; }
  try { const v = (input.loadPower * input.backupTime) / (input.efficiency * input.depthOfDischarge); results["energyWh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["energyWh"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBattery_capacity_calculator(input: Battery_capacity_calculatorInput): Battery_capacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["energyWh"]);
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


export interface Battery_capacity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
