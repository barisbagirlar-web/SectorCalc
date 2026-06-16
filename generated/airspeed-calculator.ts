// Auto-generated from airspeed-calculator-schema.json
import * as z from 'zod';

export interface Airspeed_calculatorInput {
  ias: number;
  indicatedAltitude: number;
  altimeterSetting: number;
  oat: number;
}

export const Airspeed_calculatorInputSchema = z.object({
  ias: z.number().default(100),
  indicatedAltitude: z.number().default(5000),
  altimeterSetting: z.number().default(29.92),
  oat: z.number().default(15),
});

function evaluateAllFormulas(input: Airspeed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.indicatedAltitude + 1000 * (29.92 - input.altimeterSetting); results["pressureAltitude"] = Number.isFinite(v) ? v : 0; } catch { results["pressureAltitude"] = 0; }
  try { const v = input.oat + 273.15; results["oatK"] = Number.isFinite(v) ? v : 0; } catch { results["oatK"] = 0; }
  try { const v = Math.pow(1 - 6.8755856e-6 * (results["pressureAltitude"] ?? 0), 5.2561); results["delta"] = Number.isFinite(v) ? v : 0; } catch { results["delta"] = 0; }
  try { const v = (results["oatK"] ?? 0) / 288.15; results["theta"] = Number.isFinite(v) ? v : 0; } catch { results["theta"] = 0; }
  try { const v = (results["delta"] ?? 0) / (results["theta"] ?? 0); results["sigma"] = Number.isFinite(v) ? v : 0; } catch { results["sigma"] = 0; }
  try { const v = input.ias / Math.sqrt((results["sigma"] ?? 0)); results["tas"] = Number.isFinite(v) ? v : 0; } catch { results["tas"] = 0; }
  try { const v = (results["pressureAltitude"] ?? 0) + 118.8 * (input.oat - (15 - 1.98 * (results["pressureAltitude"] ?? 0) / 1000)); results["densityAltitude"] = Number.isFinite(v) ? v : 0; } catch { results["densityAltitude"] = 0; }
  try { const v = (results["tas"] ?? 0) / (38.9679 * Math.sqrt((results["oatK"] ?? 0))); results["mach"] = Number.isFinite(v) ? v : 0; } catch { results["mach"] = 0; }
  return results;
}


export function calculateAirspeed_calculator(input: Airspeed_calculatorInput): Airspeed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tas"] ?? 0;
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


export interface Airspeed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
