// Auto-generated from hasi-calculator-schema.json
import * as z from 'zod';

export interface Hasi_calculatorInput {
  operatingPressure: number;
  operatingTemperature: number;
  flowRate: number;
  vibrationLevel: number;
  wallThickness: number;
  corrosionRate: number;
}

export const Hasi_calculatorInputSchema = z.object({
  operatingPressure: z.number().default(100),
  operatingTemperature: z.number().default(80),
  flowRate: z.number().default(200),
  vibrationLevel: z.number().default(5),
  wallThickness: z.number().default(10),
  corrosionRate: z.number().default(0.1),
});

function evaluateAllFormulas(input: Hasi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100 - ((input.operatingPressure/250*100 + (input.operatingTemperature-20) + input.flowRate/500*100 + input.vibrationLevel/25*100 + (1-input.wallThickness/20)*100 + input.corrosionRate/0.5*100) / 6); results["hasiScore"] = Number.isFinite(v) ? v : 0; } catch { results["hasiScore"] = 0; }
  try { const v = input.operatingPressure/250*100; results["pressureRisk"] = Number.isFinite(v) ? v : 0; } catch { results["pressureRisk"] = 0; }
  try { const v = input.operatingTemperature-20; results["temperatureRisk"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureRisk"] = 0; }
  try { const v = input.flowRate/500*100; results["flowErosionRisk"] = Number.isFinite(v) ? v : 0; } catch { results["flowErosionRisk"] = 0; }
  try { const v = input.vibrationLevel/25*100; results["vibrationRisk"] = Number.isFinite(v) ? v : 0; } catch { results["vibrationRisk"] = 0; }
  try { const v = (1-input.wallThickness/20)*100; results["wallThinningRisk"] = Number.isFinite(v) ? v : 0; } catch { results["wallThinningRisk"] = 0; }
  try { const v = input.corrosionRate/0.5*100; results["corrosionRisk"] = Number.isFinite(v) ? v : 0; } catch { results["corrosionRisk"] = 0; }
  return results;
}


export function calculateHasi_calculator(input: Hasi_calculatorInput): Hasi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hasiScore"] ?? 0;
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


export interface Hasi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
