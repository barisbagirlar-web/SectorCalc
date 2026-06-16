// Auto-generated from gutter-calculator-schema.json
import * as z from 'zod';

export interface Gutter_calculatorInput {
  roofArea: number;
  rainfallIntensity: number;
  gutterSlope: number;
  gutterLength: number;
  gutterWidth: number;
  gutterDepth: number;
  runoffCoefficient: number;
  additionalArea: number;
}

export const Gutter_calculatorInputSchema = z.object({
  roofArea: z.number().default(100),
  rainfallIntensity: z.number().default(50),
  gutterSlope: z.number().default(10),
  gutterLength: z.number().default(10),
  gutterWidth: z.number().default(150),
  gutterDepth: z.number().default(100),
  runoffCoefficient: z.number().default(0.9),
  additionalArea: z.number().default(0),
});

function evaluateAllFormulas(input: Gutter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rainfallIntensity / 1000 / 3600; results["rainfallIntensity_m_per_s"] = Number.isFinite(v) ? v : 0; } catch { results["rainfallIntensity_m_per_s"] = 0; }
  try { const v = (results["rainfallIntensity_m_per_s"] ?? 0) * input.roofArea * input.runoffCoefficient; results["flowRate"] = Number.isFinite(v) ? v : 0; } catch { results["flowRate"] = 0; }
  try { const v = 'Flow rate: ' + (results["flowRate"] ?? 0).toFixed(4) + ' m³/s'; results["flowRateStr"] = Number.isFinite(v) ? v : 0; } catch { results["flowRateStr"] = 0; }
  try { const v = input.gutterWidth * input.gutterDepth / 1e6; results["gutterArea_m2"] = Number.isFinite(v) ? v : 0; } catch { results["gutterArea_m2"] = 0; }
  try { const v = (input.gutterWidth + 2 * input.gutterDepth) / 1000; results["wettedPerimeter_m"] = Number.isFinite(v) ? v : 0; } catch { results["wettedPerimeter_m"] = 0; }
  try { const v = (results["gutterArea_m2"] ?? 0) / (results["wettedPerimeter_m"] ?? 0); results["hydraulicRadius"] = Number.isFinite(v) ? v : 0; } catch { results["hydraulicRadius"] = 0; }
  try { const v = input.gutterSlope / 1000; results["slope"] = Number.isFinite(v) ? v : 0; } catch { results["slope"] = 0; }
  try { const v = (1 / 0.011) * (results["gutterArea_m2"] ?? 0) * Math.pow((results["hydraulicRadius"] ?? 0), 2/3) * Math.sqrt((results["slope"] ?? 0)); results["flowCapacity"] = Number.isFinite(v) ? v : 0; } catch { results["flowCapacity"] = 0; }
  try { const v = (results["flowCapacity"] ?? 0) >= (results["flowRate"] ?? 0); results["capacityCheck"] = Number.isFinite(v) ? v : 0; } catch { results["capacityCheck"] = 0; }
  try { const v = (results["capacityCheck"] ?? 0) ? 'Sufficient' : 'Insufficient'; results["verdict"] = Number.isFinite(v) ? v : 0; } catch { results["verdict"] = 0; }
  try { const v = 'Gutter capacity: ' + (results["flowCapacity"] ?? 0).toFixed(4) + ' m³/s'; results["capacityStr"] = Number.isFinite(v) ? v : 0; } catch { results["capacityStr"] = 0; }
  return results;
}


export function calculateGutter_calculator(input: Gutter_calculatorInput): Gutter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["verdict"] ?? 0;
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


export interface Gutter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
