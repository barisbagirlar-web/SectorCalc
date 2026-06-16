// Auto-generated from thick-wall-vessel-calculator-schema.json
import * as z from 'zod';

export interface Thick_wall_vessel_calculatorInput {
  insideDiameter: number;
  outsideDiameter: number;
  internalPressure: number;
  externalPressure: number;
  yieldStrength: number;
}

export const Thick_wall_vessel_calculatorInputSchema = z.object({
  insideDiameter: z.number().default(100),
  outsideDiameter: z.number().default(200),
  internalPressure: z.number().default(10),
  externalPressure: z.number().default(0),
  yieldStrength: z.number().default(250),
});

function evaluateAllFormulas(input: Thick_wall_vessel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.insideDiameter / 2; results["ri"] = Number.isFinite(v) ? v : 0; } catch { results["ri"] = 0; }
  try { const v = input.outsideDiameter / 2; results["ro"] = Number.isFinite(v) ? v : 0; } catch { results["ro"] = 0; }
  try { const v = ((input.internalPressure * (results["ri"] ?? 0) ** 2 - input.externalPressure * (results["ro"] ?? 0) ** 2) / ((results["ro"] ?? 0) ** 2 - (results["ri"] ?? 0) ** 2)) + ((input.internalPressure - input.externalPressure) * (results["ro"] ?? 0) ** 2 / ((results["ro"] ?? 0) ** 2 - (results["ri"] ?? 0) ** 2)); results["hoopStressInner"] = Number.isFinite(v) ? v : 0; } catch { results["hoopStressInner"] = 0; }
  try { const v = -input.internalPressure; results["radialStressInner"] = Number.isFinite(v) ? v : 0; } catch { results["radialStressInner"] = 0; }
  try { const v = (input.internalPressure * (results["ri"] ?? 0) ** 2 - input.externalPressure * (results["ro"] ?? 0) ** 2) / ((results["ro"] ?? 0) ** 2 - (results["ri"] ?? 0) ** 2); results["longitudinalStress"] = Number.isFinite(v) ? v : 0; } catch { results["longitudinalStress"] = 0; }
  try { const v = Math.sqrt(0.5 * (((results["hoopStressInner"] ?? 0) - (results["radialStressInner"] ?? 0)) ** 2 + ((results["radialStressInner"] ?? 0) - (results["longitudinalStress"] ?? 0)) ** 2 + ((results["longitudinalStress"] ?? 0) - (results["hoopStressInner"] ?? 0)) ** 2)); results["vonMises"] = Number.isFinite(v) ? v : 0; } catch { results["vonMises"] = 0; }
  try { const v = input.yieldStrength > 0 ? input.yieldStrength / (results["vonMises"] ?? 0) : null; results["safetyFactor"] = Number.isFinite(v) ? v : 0; } catch { results["safetyFactor"] = 0; }
  return results;
}


export function calculateThick_wall_vessel_calculator(input: Thick_wall_vessel_calculatorInput): Thick_wall_vessel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hoopStressInner"] ?? 0;
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


export interface Thick_wall_vessel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
