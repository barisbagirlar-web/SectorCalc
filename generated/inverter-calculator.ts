// Auto-generated from inverter-calculator-schema.json
import * as z from 'zod';

export interface Inverter_calculatorInput {
  outputPowerKW: number;
  inputDcVoltage: number;
  outputAcVoltage: number;
  efficiency: number;
  powerFactor: number;
}

export const Inverter_calculatorInputSchema = z.object({
  outputPowerKW: z.number().default(1),
  inputDcVoltage: z.number().default(48),
  outputAcVoltage: z.number().default(230),
  efficiency: z.number().default(90),
  powerFactor: z.number().default(0.8),
});

function evaluateAllFormulas(input: Inverter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outputPowerKW / (input.efficiency / 100); results["dcPowerKW"] = Number.isFinite(v) ? v : 0; } catch { results["dcPowerKW"] = 0; }
  try { const v = (input.outputPowerKW / (input.efficiency / 100)) * 1000 / input.inputDcVoltage; results["dcCurrentA"] = Number.isFinite(v) ? v : 0; } catch { results["dcCurrentA"] = 0; }
  try { const v = input.outputPowerKW / input.powerFactor; results["apparentPowerKVA"] = Number.isFinite(v) ? v : 0; } catch { results["apparentPowerKVA"] = 0; }
  try { const v = (input.outputPowerKW / input.powerFactor) * 1000 / input.outputAcVoltage; results["acCurrentA"] = Number.isFinite(v) ? v : 0; } catch { results["acCurrentA"] = 0; }
  return results;
}


export function calculateInverter_calculator(input: Inverter_calculatorInput): Inverter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dcPowerKW"] ?? 0;
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


export interface Inverter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
