// Auto-generated from hasi-calculator-schema.json
import * as z from 'zod';

export interface Hasi_calculatorInput {
  operatingPressure: number;
  operatingTemperature: number;
  flowRate: number;
  vibrationLevel: number;
  wallThickness: number;
  corrosionRate: number;
  dataConfidence?: number;
}

export const Hasi_calculatorInputSchema = z.object({
  operatingPressure: z.number().default(100),
  operatingTemperature: z.number().default(80),
  flowRate: z.number().default(200),
  vibrationLevel: z.number().default(5),
  wallThickness: z.number().default(10),
  corrosionRate: z.number().default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hasi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100 - ((input.operatingPressure/250*100 + (input.operatingTemperature-20) + input.flowRate/500*100 + input.vibrationLevel/25*100 + (1-input.wallThickness/20)*100 + input.corrosionRate/0.5*100) / 6); results["hasiScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hasiScore"] = Number.NaN; }
  try { const v = input.operatingPressure/250*100; results["pressureRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pressureRisk"] = Number.NaN; }
  try { const v = input.operatingTemperature-20; results["temperatureRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["temperatureRisk"] = Number.NaN; }
  try { const v = input.flowRate/500*100; results["flowErosionRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flowErosionRisk"] = Number.NaN; }
  try { const v = input.vibrationLevel/25*100; results["vibrationRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vibrationRisk"] = Number.NaN; }
  try { const v = (1-input.wallThickness/20)*100; results["wallThinningRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallThinningRisk"] = Number.NaN; }
  try { const v = input.corrosionRate/0.5*100; results["corrosionRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["corrosionRisk"] = Number.NaN; }
  return results;
}


export function calculateHasi_calculator(input: Hasi_calculatorInput): Hasi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hasiScore"]);
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


export interface Hasi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
