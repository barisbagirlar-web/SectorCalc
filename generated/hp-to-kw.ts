// @ts-nocheck
// Auto-generated from hp-to-kw-schema.json
import * as z from 'zod';

export interface Hp_to_kwInput {
  horsepower: number;
  efficiency: number;
  powerFactor: number;
  voltage: number;
  current: number;
  phases: number;
}

export const Hp_to_kwInputSchema = z.object({
  horsepower: z.number().default(1),
  efficiency: z.number().default(90),
  powerFactor: z.number().default(0.85),
  voltage: z.number().default(400),
  current: z.number().default(10),
  phases: z.number().default(3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hp_to_kwInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.horsepower * 0.7457; results["mechanicalPowerKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mechanicalPowerKW"] = 0; }
  try { const v = (asFormulaNumber(results["mechanicalPowerKW"])) * (input.efficiency / 100); results["outputPowerKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["outputPowerKW"] = 0; }
  try { const v = input.voltage * input.current * input.powerFactor * (input.phases == 1 ? 1 : 1.732) / 1000; results["electricalPowerKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["electricalPowerKW"] = 0; }
  try { const v = (asFormulaNumber(results["mechanicalPowerKW"])) - (asFormulaNumber(results["outputPowerKW"])); results["lossesKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lossesKW"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHp_to_kw(input: Hp_to_kwInput): Hp_to_kwOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["outputPowerKW"]);
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


export interface Hp_to_kwOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
