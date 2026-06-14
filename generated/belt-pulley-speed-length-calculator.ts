// Auto-generated from belt-pulley-speed-length-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BeltPulleySpeedLengthCalculatorInput {
  pulley1Diameter: number;
  pulley2Diameter: number;
  centerDistance: number;
  pulley1Speed: number;
  beltType: 'V-belt' | 'Timing belt' | 'Flat belt' | 'Round belt';
}

export const BeltPulleySpeedLengthCalculatorInputSchema = z.object({
  pulley1Diameter: z.number().min(10).max(5000).default(100),
  pulley2Diameter: z.number().min(10).max(5000).default(200),
  centerDistance: z.number().min(50).max(10000).default(500),
  pulley1Speed: z.number().min(1).max(100000).default(1500),
  beltType: z.enum(['V-belt', 'Timing belt', 'Flat belt', 'Round belt']).default('V-belt'),
});

export interface BeltPulleySpeedLengthCalculatorOutput {
  beltSpeed: number;
  breakdown: {
    beltSpeed: number;
    speedRatio: number;
    pulley2Speed: number;
    beltLength: number;
    wrapAngle1: number;
    wrapAngle2: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BeltPulleySpeedLengthCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.beltSpeed = input.pulley1Diameter * Math.PI * input.pulley1Speed / 60000;
  results.speedRatio = input.pulley2Diameter / input.pulley1Diameter;
  results.pulley2Speed = input.pulley1Speed / results.speedRatio;
  results.beltLength = 2 * input.centerDistance + Math.PI * (input.pulley1Diameter + input.pulley2Diameter) / 2 + Math.pow(input.pulley2Diameter - input.pulley1Diameter, 2) / (4 * input.centerDistance);
  results.wrapAngle1 = 180 - 2 * Math.asin((input.pulley2Diameter - input.pulley1Diameter) / (2 * input.centerDistance)) * 180 / Math.PI;
  results.wrapAngle2 = 180 + 2 * Math.asin((input.pulley2Diameter - input.pulley1Diameter) / (2 * input.centerDistance)) * 180 / Math.PI;
  return results;
}

export function calculateBeltPulleySpeedLengthCalculator(input: BeltPulleySpeedLengthCalculatorInput): BeltPulleySpeedLengthCalculatorOutput {
  const results = evaluateFormulas(input);
  const beltSpeed = results.beltSpeed;
  const breakdown = {
    beltSpeed: results.beltSpeed,
    speedRatio: results.speedRatio,
    pulley2Speed: results.pulley2Speed,
    beltLength: results.beltLength,
    wrapAngle1: results.wrapAngle1,
    wrapAngle2: results.wrapAngle2,
  };

  // rule: pulley1Diameter > 0
  // rule: pulley2Diameter > 0
  // rule: centerDistance > (pulley1Diameter + pulley2Diameter) / 2
  // rule: pulley1Speed > 0
  // rule: beltType must be one of: V-belt, Timing belt, Flat belt, Round belt
  // threshold beltSpeed: beltSpeed > 30 m/s -> warning: High belt speed may cause excessive wear and safety risk
  // threshold speedRatio: speedRatio > 6 -> warning: High speed ratio may require special belt or multiple stages
  const hiddenLossDrivers: string[] = ["beltSpeed > 30 m/s -> High speed may cause vibration and reduced belt life","wrapAngle1 < 120 degrees -> Insufficient wrap may cause slippage"];
  const suggestedActions: string[] = ["If beltSpeed > 30 m/s, consider using a larger pulley or reducing motor speed","If wrapAngle1 < 120 degrees, increase center distance or use an idler pulley","If speedRatio > 6, consider a two-stage drive system"];
  const dataConfidenceAdjusted = results.beltSpeed * (1 - 0.05) // Assuming 5% uncertainty in input measurements;

  return {
    beltSpeed,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of calculation report","CSV export of input/output data","Trend analysis over multiple configurations","Comparison of different belt types","Detailed report with tension and power calculations"],
  };
}
