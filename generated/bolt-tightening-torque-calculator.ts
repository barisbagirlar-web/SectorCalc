// Auto-generated from bolt-tightening-torque-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoltTighteningTorqueCalculatorInput {
  boltDiameter: number;
  threadPitch: number;
  frictionCoefficient: number;
  preloadForce: number;
  nutFactor: number;
  torqueMethod: 'torqueControl' | 'torqueAngle' | 'yieldControl';
  lubricationCondition: 'dry' | 'oiled' | 'coated';
}

export const BoltTighteningTorqueCalculatorInputSchema = z.object({
  boltDiameter: z.number().min(3).max(100).default(10),
  threadPitch: z.number().min(0.5).max(6).default(1.5),
  frictionCoefficient: z.number().min(0.05).max(0.5).default(0.15),
  preloadForce: z.number().min(100).max(1000000).default(10000),
  nutFactor: z.number().min(0.1).max(0.4).default(0.2),
  torqueMethod: z.enum(['torqueControl', 'torqueAngle', 'yieldControl']).default('torqueControl'),
  lubricationCondition: z.enum(['dry', 'oiled', 'coated']).default('dry'),
});

export interface BoltTighteningTorqueCalculatorOutput {
  tighteningTorque: number;
  breakdown: {
    tighteningTorque: number;
    torqueAngle: number;
    clampForce: number;
    torqueTensionEfficiency: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoltTighteningTorqueCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.tighteningTorque = ((): number => { try { const __v = input.nutFactor * input.boltDiameter * input.preloadForce / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.torqueAngle = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.clampForce = ((): number => { try { const __v = input.preloadForce; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.torqueTensionEfficiency = ((): number => { try { const __v = input.preloadForce / (results.tighteningTorque * 1000 / input.boltDiameter); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateBoltTighteningTorqueCalculator(input: BoltTighteningTorqueCalculatorInput): BoltTighteningTorqueCalculatorOutput {
  const results = evaluateFormulas(input);
  const tighteningTorque = results.tighteningTorque ?? 0;
  const breakdown = {
    tighteningTorque: results.tighteningTorque,
    torqueAngle: results.torqueAngle,
    clampForce: results.clampForce,
    torqueTensionEfficiency: results.torqueTensionEfficiency,
  };

  // rule: boltDiameter >= 3 and boltDiameter <= 100
  // rule: threadPitch >= 0.5 and threadPitch <= 6
  // rule: frictionCoefficient >= 0.05 and frictionCoefficient <= 0.5
  // rule: preloadForce >= 100 and preloadForce <= 1000000
  // rule: nutFactor >= 0.1 and nutFactor <= 0.4
  // rule: if torqueMethod == 'torqueAngle' then preloadForce must be specified
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High friction may cause under-tightening; consider lubrication.
  // threshold skipped (non-JS): Nut factor high; verify lubrication and surface condition.
  // threshold skipped (non-JS): Very high preload; verify bolt grade and joint capacity.

  const dataConfidenceAdjusted = (() => { try { return results.tighteningTorque * (1 - 0.1 * (input.frictionCoefficient / 0.2)); } catch { return tighteningTorque; } })();

  return {
    tighteningTorque,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of torque calculation report","CSV export of historical torque data","Trend analysis of torque vs. preload over time","Comparison of different tightening methods","Detailed report with joint diagrams and material specs"],
  };
}
