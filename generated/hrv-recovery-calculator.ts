// @ts-nocheck
// Auto-generated from hrv-recovery-calculator-schema.json
import * as z from 'zod';

export interface Hrv_recovery_calculatorInput {
  outdoorTemp: number;
  exhaustTemp: number;
  supplyTemp: number;
  airflow: number;
  airDensity: number;
  specificHeat: number;
}

export const Hrv_recovery_calculatorInputSchema = z.object({
  outdoorTemp: z.number().default(5),
  exhaustTemp: z.number().default(22),
  supplyTemp: z.number().default(15),
  airflow: z.number().default(300),
  airDensity: z.number().default(1.2),
  specificHeat: z.number().default(1.005),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hrv_recovery_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.supplyTemp - input.outdoorTemp) / (input.exhaustTemp - input.outdoorTemp)) * 100; results["efficiency"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["efficiency"] = 0; }
  try { const v = input.supplyTemp - input.outdoorTemp; results["temperatureGain"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["temperatureGain"] = 0; }
  try { const v = (input.airflow / 3600) * input.airDensity * input.specificHeat * (input.supplyTemp - input.outdoorTemp); results["heatRecoveryRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heatRecoveryRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHrv_recovery_calculator(input: Hrv_recovery_calculatorInput): Hrv_recovery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["efficiency"]);
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


export interface Hrv_recovery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
