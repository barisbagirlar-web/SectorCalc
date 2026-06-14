// Auto-generated from bolt-tightening-torque-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoltTighteningTorqueCalculatorInput {
  boltDiameter: number;
  threadPitch: number;
  materialGrade: '4.6' | '4.8' | '5.6' | '5.8' | '6.8' | '8.8' | '9.8' | '10.9' | '12.9';
  frictionCoefficient: number;
  preloadPercentage: number;
  lubricationCondition: 'dry' | 'light_oil' | 'grease' | 'moly_coated' | 'zinc_plated';
  safetyFactor: number;
  jointType: 'hard' | 'soft' | 'gasketed';
  tighteningMethod: 'torque_control' | 'angle_control' | 'yield_control';
  dataConfidence: number;
}

export const BoltTighteningTorqueCalculatorInputSchema = z.object({
  boltDiameter: z.number().min(3).max(100).default(10),
  threadPitch: z.number().min(0.5).max(6).default(1.5),
  materialGrade: z.enum(['4.6', '4.8', '5.6', '5.8', '6.8', '8.8', '9.8', '10.9', '12.9']).default('8.8'),
  frictionCoefficient: z.number().min(0.08).max(0.3).default(0.15),
  preloadPercentage: z.number().min(50).max(90).default(75),
  lubricationCondition: z.enum(['dry', 'light_oil', 'grease', 'moly_coated', 'zinc_plated']).default('light_oil'),
  safetyFactor: z.number().min(1.2).max(3).default(1.5),
  jointType: z.enum(['hard', 'soft', 'gasketed']).default('hard'),
  tighteningMethod: z.enum(['torque_control', 'angle_control', 'yield_control']).default('torque_control'),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface BoltTighteningTorqueCalculatorOutput {
  adjustedTorque: number;
  breakdown: {
    stressArea: number;
    yieldStrength: number;
    allowableStress: number;
    targetPreload: number;
    torqueCoefficient: number;
    recommendedTorque: number;
    maxPreload: number;
    maxTorque: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoltTighteningTorqueCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.stressArea = 0.7854 * (input.boltDiameter - 0.9382 * input.threadPitch)^2;
  results.yieldStrength = input.materialGrade === '4.6' ? 240 : input.materialGrade === '4.8' ? 320 : input.materialGrade === '5.6' ? 300 : input.materialGrade === '5.8' ? 400 : input.materialGrade === '6.8' ? 480 : input.materialGrade === '8.8' ? 640 : input.materialGrade === '9.8' ? 720 : input.materialGrade === '10.9' ? 940 : input.materialGrade === '12.9' ? 1100 : 640;
  results.allowableStress = results.yieldStrength / input.safetyFactor;
  results.targetPreload = results.allowableStress * results.stressArea * (input.preloadPercentage / 100);
  results.torqueCoefficient = 0.16 * input.frictionCoefficient + 0.02;
  results.recommendedTorque = results.targetPreload * input.boltDiameter / 1000 * results.torqueCoefficient;
  results.adjustedTorque = results.recommendedTorque * (input.dataConfidence / 100);
  results.maxPreload = results.yieldStrength * results.stressArea * 0.9;
  results.maxTorque = results.maxPreload * input.boltDiameter / 1000 * results.torqueCoefficient;
  return results;
}

export function calculateBoltTighteningTorqueCalculator(input: BoltTighteningTorqueCalculatorInput): BoltTighteningTorqueCalculatorOutput {
  const results = evaluateFormulas(input);
  const adjustedTorque = results.adjustedTorque;
  const breakdown = {
    stressArea: results.stressArea,
    yieldStrength: results.yieldStrength,
    allowableStress: results.allowableStress,
    targetPreload: results.targetPreload,
    torqueCoefficient: results.torqueCoefficient,
    recommendedTorque: results.recommendedTorque,
    maxPreload: results.maxPreload,
    maxTorque: results.maxTorque,
  };

  // rule: boltDiameter must be between 3 and 100 mm
  // rule: threadPitch must be between 0.5 and 6 mm
  // rule: frictionCoefficient must be between 0.08 and 0.3
  // rule: preloadPercentage must be between 50 and 90
  // rule: safetyFactor must be between 1.2 and 3
  // rule: dataConfidence must be between 50 and 100
  // rule: If lubricationCondition is 'dry', frictionCoefficient must be >= 0.18
  // rule: If lubricationCondition is 'light_oil', frictionCoefficient must be between 0.12 and 0.18
  // rule: If lubricationCondition is 'grease', frictionCoefficient must be between 0.10 and 0.15
  // rule: If lubricationCondition is 'moly_coated', frictionCoefficient must be between 0.08 and 0.12
  // rule: If lubricationCondition is 'zinc_plated', frictionCoefficient must be between 0.14 and 0.22
  // rule: If jointType is 'gasketed', preloadPercentage must be <= 75
  // rule: If tighteningMethod is 'yield_control', preloadPercentage must be >= 80
  // threshold frictionCoefficient > 0.25: High friction may cause galling; consider lubrication.
  // threshold preloadPercentage > 85: Risk of bolt yielding; verify material grade.
  // threshold safetyFactor < 1.5: Low safety factor for critical joints; review application.
  // threshold dataConfidence < 70: Low data confidence; torque recommendation reduced.
  const hiddenLossDrivers: string[] = ["frictionCoefficient > 0.25 ? 'High friction may cause galling; consider lubrication.' : ''","preloadPercentage > 85 ? 'Risk of bolt yielding; verify material grade.' : ''","safetyFactor < 1.5 ? 'Low safety factor for critical joints; review application.' : ''","dataConfidence < 70 ? 'Low data confidence; torque recommendation reduced.' : ''"];
  const suggestedActions: string[] = ["Use calibrated torque wrench for accuracy.","Verify bolt material grade and condition.","Apply lubrication to reduce friction scatter.","Perform torque-tension testing for critical joints.","Consider angle control for higher precision."];
  const dataConfidenceAdjusted = results.adjustedTorque;

  return {
    adjustedTorque,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of torque specification report","CSV export of calculation data","Trend analysis of torque values over time","Comparison of multiple bolt sizes or grades","Detailed report with joint diagrams and references","Integration with inventory management systems"],
  };
}
