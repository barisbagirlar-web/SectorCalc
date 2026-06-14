// Auto-generated from belt-pulley-speed-length-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BeltPulleySpeedLengthCalculatorInput {
  driverPulleyDiameter: number;
  drivenPulleyDiameter: number;
  centerDistance: number;
  driverSpeed: number;
  beltType: 'V-belt' | 'Timing belt' | 'Flat belt';
}

export const BeltPulleySpeedLengthCalculatorInputSchema = z.object({
  driverPulleyDiameter: z.number().min(10).max(5000).default(100),
  drivenPulleyDiameter: z.number().min(10).max(5000).default(200),
  centerDistance: z.number().min(50).max(10000).default(500),
  driverSpeed: z.number().min(1).max(10000).default(1500),
  beltType: z.enum(['V-belt', 'Timing belt', 'Flat belt']).default('V-belt'),
});

export interface BeltPulleySpeedLengthCalculatorOutput {
  drivenSpeed: number;
  breakdown: {
    speedRatio: number;
    beltLength: number;
    beltSpeed: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BeltPulleySpeedLengthCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.speedRatio = ((): number => { try { const __v = input.driverSpeed / (input.drivenPulleyDiameter / input.driverPulleyDiameter); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.drivenSpeed = ((): number => { try { const __v = input.driverSpeed * (input.driverPulleyDiameter / input.drivenPulleyDiameter); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.beltLength = ((): number => { try { const __v = 2 * input.centerDistance + (Math.PI * (input.driverPulleyDiameter + input.drivenPulleyDiameter) / 2) + (Math.Math.pow(input.drivenPulleyDiameter - input.driverPulleyDiameter, 2) / (4 * input.centerDistance)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.beltSpeed = ((): number => { try { const __v = Math.PI * input.driverPulleyDiameter * input.driverSpeed / 60000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateBeltPulleySpeedLengthCalculator(input: BeltPulleySpeedLengthCalculatorInput): BeltPulleySpeedLengthCalculatorOutput {
  const results = evaluateFormulas(input);
  const drivenSpeed = results.drivenSpeed ?? 0;
  const breakdown = {
    speedRatio: results.speedRatio,
    beltLength: results.beltLength,
    beltSpeed: results.beltSpeed,
  };

  // rule: driverPulleyDiameter > 0
  // rule: drivenPulleyDiameter > 0
  // rule: centerDistance > (driverPulleyDiameter + drivenPulleyDiameter)/2
  // rule: driverSpeed > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If speedRatio > 5, warning: 'High speed ratio may require special belt'
  // threshold skipped (non-JS): If beltSpeed > 30 m/s, warning: 'Belt speed exceeds typical limit'

  const dataConfidenceAdjusted = (() => { try { return results.drivenSpeed * (1 - 0.05); } catch { return drivenSpeed; } })();

  return {
    drivenSpeed,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with multiple configurations","Detailed report with tension recommendations"],
  };
}
