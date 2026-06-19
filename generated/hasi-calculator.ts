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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hasi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100 - ((input.operatingPressure/250*100 + (input.operatingTemperature-20) + input.flowRate/500*100 + input.vibrationLevel/25*100 + (1-input.wallThickness/20)*100 + input.corrosionRate/0.5*100) / 6); results["hasiScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hasiScore"] = 0; }
  try { const v = input.operatingPressure/250*100; results["pressureRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressureRisk"] = 0; }
  try { const v = input.operatingTemperature-20; results["temperatureRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["temperatureRisk"] = 0; }
  try { const v = input.flowRate/500*100; results["flowErosionRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["flowErosionRisk"] = 0; }
  try { const v = input.vibrationLevel/25*100; results["vibrationRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vibrationRisk"] = 0; }
  try { const v = (1-input.wallThickness/20)*100; results["wallThinningRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallThinningRisk"] = 0; }
  try { const v = input.corrosionRate/0.5*100; results["corrosionRisk"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["corrosionRisk"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHasi_calculator(input: Hasi_calculatorInput): Hasi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["hasiScore"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
