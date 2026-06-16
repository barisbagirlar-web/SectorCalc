// Auto-generated from otto-cycle-calculator-schema.json
import * as z from 'zod';

export interface Otto_cycle_calculatorInput {
  compressionRatio: number;
  specificHeatRatio: number;
  initialTemperature: number;
  initialPressure: number;
  maxTemperature: number;
  specificHeatCv: number;
}

export const Otto_cycle_calculatorInputSchema = z.object({
  compressionRatio: z.number().default(8),
  specificHeatRatio: z.number().default(1.4),
  initialTemperature: z.number().default(300),
  initialPressure: z.number().default(100),
  maxTemperature: z.number().default(2000),
  specificHeatCv: z.number().default(0.718),
});

function evaluateAllFormulas(input: Otto_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - 1 / Math.pow(input.compressionRatio, input.specificHeatRatio - 1)) * 100; results["thermalefficiency"] = Number.isFinite(v) ? v : 0; } catch { results["thermalefficiency"] = 0; }
  try { const v = input.initialTemperature * Math.pow(input.compressionRatio, input.specificHeatRatio - 1); results["temperatureAfterCompression"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureAfterCompression"] = 0; }
  try { const v = input.maxTemperature / Math.pow(input.compressionRatio, input.specificHeatRatio - 1); results["temperatureAfterExpansion"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureAfterExpansion"] = 0; }
  try { const v = input.initialPressure * Math.pow(input.compressionRatio, input.specificHeatRatio); results["pressureAfterCompression"] = Number.isFinite(v) ? v : 0; } catch { results["pressureAfterCompression"] = 0; }
  try { const v = input.specificHeatCv * (input.maxTemperature - input.initialTemperature * Math.pow(input.compressionRatio, input.specificHeatRatio - 1) - input.maxTemperature / Math.pow(input.compressionRatio, input.specificHeatRatio - 1) + input.initialTemperature); results["netWorkPerMass"] = Number.isFinite(v) ? v : 0; } catch { results["netWorkPerMass"] = 0; }
  try { const v = input.specificHeatCv * (input.maxTemperature - input.initialTemperature * Math.pow(input.compressionRatio, input.specificHeatRatio - 1)); results["heatAdditionPerMass"] = Number.isFinite(v) ? v : 0; } catch { results["heatAdditionPerMass"] = 0; }
  return results;
}


export function calculateOtto_cycle_calculator(input: Otto_cycle_calculatorInput): Otto_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["thermalefficiency"] ?? 0;
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


export interface Otto_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
