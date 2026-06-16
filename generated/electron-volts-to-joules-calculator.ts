// Auto-generated from electron-volts-to-joules-calculator-schema.json
import * as z from 'zod';

export interface Electron_volts_to_joules_calculatorInput {
  electronVolts: number;
  inputScale: number;
  conversionFactor: number;
  outputScale: number;
  decimalPlaces: number;
}

export const Electron_volts_to_joules_calculatorInputSchema = z.object({
  electronVolts: z.number().default(1),
  inputScale: z.number().default(1),
  conversionFactor: z.number().default(1.602176634e-19),
  outputScale: z.number().default(1),
  decimalPlaces: z.number().default(4),
});

function evaluateAllFormulas(input: Electron_volts_to_joules_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round((input.electronVolts * input.inputScale * input.conversionFactor * input.outputScale) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["joules"] = Number.isFinite(v) ? v : 0; } catch { results["joules"] = 0; }
  try { const v = input.electronVolts * input.inputScale * input.conversionFactor * input.outputScale; results["exactValue"] = Number.isFinite(v) ? v : 0; } catch { results["exactValue"] = 0; }
  try { const v = 'Energy (J) = ' + input.electronVolts + ' eV × ' + input.conversionFactor + ' J/eV = ' + (input.electronVolts * input.inputScale * input.conversionFactor * input.outputScale) + ' J (with input scale ' + input.inputScale + ' and output scale ' + input.outputScale + ')'; results["calculationDetails"] = Number.isFinite(v) ? v : 0; } catch { results["calculationDetails"] = 0; }
  return results;
}


export function calculateElectron_volts_to_joules_calculator(input: Electron_volts_to_joules_calculatorInput): Electron_volts_to_joules_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["joules"] ?? 0;
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


export interface Electron_volts_to_joules_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
