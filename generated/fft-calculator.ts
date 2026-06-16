// Auto-generated from fft-calculator-schema.json
import * as z from 'zod';

export interface Fft_calculatorInput {
  shaftSpeed: number;
  numBalls: number;
  ballDiameter: number;
  pitchDiameter: number;
  contactAngle: number;
}

export const Fft_calculatorInputSchema = z.object({
  shaftSpeed: z.number().default(1500),
  numBalls: z.number().default(9),
  ballDiameter: z.number().default(12),
  pitchDiameter: z.number().default(60),
  contactAngle: z.number().default(15),
});

function evaluateAllFormulas(input: Fft_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ( input.numBalls / 2 ) * ( 1 - ( input.ballDiameter / input.pitchDiameter ) * Math.cos( input.contactAngle * Math.PI / 180 ) ) * input.shaftSpeed / 60; results["bpfo"] = Number.isFinite(v) ? v : 0; } catch { results["bpfo"] = 0; }
  try { const v = ( input.numBalls / 2 ) * ( 1 + ( input.ballDiameter / input.pitchDiameter ) * Math.cos( input.contactAngle * Math.PI / 180 ) ) * input.shaftSpeed / 60; results["bpfi"] = Number.isFinite(v) ? v : 0; } catch { results["bpfi"] = 0; }
  try { const v = ( 1 / 2 ) * ( 1 - ( input.ballDiameter / input.pitchDiameter ) * Math.cos( input.contactAngle * Math.PI / 180 ) ) * input.shaftSpeed / 60; results["ftf"] = Number.isFinite(v) ? v : 0; } catch { results["ftf"] = 0; }
  try { const v = ( input.pitchDiameter / ( 2 * input.ballDiameter ) ) * ( 1 - Math.pow( input.ballDiameter / input.pitchDiameter, 2 ) * Math.pow( Math.cos( input.contactAngle * Math.PI / 180 ), 2 ) ) * input.shaftSpeed / 60; results["bsf"] = Number.isFinite(v) ? v : 0; } catch { results["bsf"] = 0; }
  return results;
}


export function calculateFft_calculator(input: Fft_calculatorInput): Fft_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bpfo"] ?? 0;
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


export interface Fft_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
