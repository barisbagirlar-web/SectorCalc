// @ts-nocheck
// Auto-generated from fan-calculator-schema.json
import * as z from 'zod';

export interface Fan_calculatorInput {
  airflow: number;
  staticPressure: number;
  fanEfficiency: number;
  motorEfficiency: number;
  airDensity: number;
}

export const Fan_calculatorInputSchema = z.object({
  airflow: z.number().default(10000),
  staticPressure: z.number().default(500),
  fanEfficiency: z.number().default(70),
  motorEfficiency: z.number().default(90),
  airDensity: z.number().default(1.2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fan_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.airflow * input.staticPressure) / (360 * input.fanEfficiency * input.motorEfficiency); results["motorInputPowerKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["motorInputPowerKW"] = 0; }
  try { const v = (input.airflow * input.staticPressure) / (36000 * input.fanEfficiency); results["fanShaftPowerKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fanShaftPowerKW"] = 0; }
  try { const v = (input.airflow * input.staticPressure) / 3600000; results["airPowerKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["airPowerKW"] = 0; }
  try { const v = input.airflow / 3600; results["airflowM3s"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["airflowM3s"] = 0; }
  try { const v = (input.airflow / 3600) * input.airDensity; results["massFlowRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["massFlowRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFan_calculator(input: Fan_calculatorInput): Fan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["massFlowRate"]);
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


export interface Fan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
