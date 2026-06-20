// Auto-generated from fan-calculator-schema.json
import * as z from 'zod';

export interface Fan_calculatorInput {
  airflow: number;
  staticPressure: number;
  fanEfficiency: number;
  motorEfficiency: number;
  airDensity: number;
  dataConfidence?: number;
}

export const Fan_calculatorInputSchema = z.object({
  airflow: z.number().default(10000),
  staticPressure: z.number().default(500),
  fanEfficiency: z.number().default(70),
  motorEfficiency: z.number().default(90),
  airDensity: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.airflow * input.staticPressure) / (360 * input.fanEfficiency * input.motorEfficiency); results["motorInputPowerKW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["motorInputPowerKW"] = Number.NaN; }
  try { const v = (input.airflow * input.staticPressure) / (36000 * input.fanEfficiency); results["fanShaftPowerKW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fanShaftPowerKW"] = Number.NaN; }
  try { const v = (input.airflow * input.staticPressure) / 3600000; results["airPowerKW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["airPowerKW"] = Number.NaN; }
  try { const v = input.airflow / 3600; results["airflowM3s"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["airflowM3s"] = Number.NaN; }
  try { const v = (input.airflow / 3600) * input.airDensity; results["massFlowRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["massFlowRate"] = Number.NaN; }
  return results;
}


export function calculateFan_calculator(input: Fan_calculatorInput): Fan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["massFlowRate"]);
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


export interface Fan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
