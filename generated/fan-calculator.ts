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

function evaluateAllFormulas(input: Fan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.airflow * input.staticPressure) / (360 * input.fanEfficiency * input.motorEfficiency); results["motorInputPowerKW"] = Number.isFinite(v) ? v : 0; } catch { results["motorInputPowerKW"] = 0; }
  try { const v = (input.airflow * input.staticPressure) / (36000 * input.fanEfficiency); results["fanShaftPowerKW"] = Number.isFinite(v) ? v : 0; } catch { results["fanShaftPowerKW"] = 0; }
  try { const v = (input.airflow * input.staticPressure) / 3600000; results["airPowerKW"] = Number.isFinite(v) ? v : 0; } catch { results["airPowerKW"] = 0; }
  try { const v = input.airflow / 3600; results["airflowM3s"] = Number.isFinite(v) ? v : 0; } catch { results["airflowM3s"] = 0; }
  try { const v = (input.airflow / 3600) * input.airDensity; results["massFlowRate"] = Number.isFinite(v) ? v : 0; } catch { results["massFlowRate"] = 0; }
  results["Air_Power__kW_"] = 0;
  results["Fan_Shaft_Power__kW_"] = 0;
  results["Volumetric_Flow_Rate__m__s_"] = 0;
  results["Mass_Flow_Rate__kg_s_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateFan_calculator(input: Fan_calculatorInput): Fan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Fan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
