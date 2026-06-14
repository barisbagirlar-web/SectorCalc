// Auto-generated from hydraulic-pneumatic-cylinder-force-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HydraulicPneumaticCylinderForceCalculatorInput {
  pressure: number;
  pistonDiameter: number;
  rodDiameter: number;
  cylinderType: 'single-acting' | 'double-acting';
  fluidType: 'hydraulic' | 'pneumatic';
  efficiency: number;
}

export const HydraulicPneumaticCylinderForceCalculatorInputSchema = z.object({
  pressure: z.number().min(0).max(1000).default(100),
  pistonDiameter: z.number().min(0).max(1000).default(50),
  rodDiameter: z.number().min(0).max(500).default(20),
  cylinderType: z.enum(['single-acting', 'double-acting']).default('double-acting'),
  fluidType: z.enum(['hydraulic', 'pneumatic']).default('hydraulic'),
  efficiency: z.number().min(0).max(100).default(85),
});

export interface HydraulicPneumaticCylinderForceCalculatorOutput {
  forceExtension: number;
  breakdown: {
    pistonArea: number;
    rodArea: number;
    effectiveAreaExtension: number;
    effectiveAreaRetraction: number;
    forceExtension: number;
    forceRetraction: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HydraulicPneumaticCylinderForceCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.pistonArea = ((): number => { try { const __v = pi * (input.pistonDiameter/2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.rodArea = ((): number => { try { const __v = pi * (input.rodDiameter/2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveAreaExtension = ((): number => { try { const __v = results.pistonArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveAreaRetraction = ((): number => { try { const __v = results.pistonArea - results.rodArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.forceExtension = ((): number => { try { const __v = input.pressure * 10 * results.effectiveAreaExtension * (input.efficiency/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.forceRetraction = ((): number => { try { const __v = input.pressure * 10 * results.effectiveAreaRetraction * (input.efficiency/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primary = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHydraulicPneumaticCylinderForceCalculator(input: HydraulicPneumaticCylinderForceCalculatorInput): HydraulicPneumaticCylinderForceCalculatorOutput {
  const results = evaluateFormulas(input);
  const forceExtension = results.forceExtension ?? 0;
  const breakdown = {
    pistonArea: results.pistonArea,
    rodArea: results.rodArea,
    effectiveAreaExtension: results.effectiveAreaExtension,
    effectiveAreaRetraction: results.effectiveAreaRetraction,
    forceExtension: results.forceExtension,
    forceRetraction: results.forceRetraction,
  };

  // rule: rodDiameter must be less than pistonDiameter
  // rule: pressure must be positive
  // rule: efficiency must be between 0 and 100
  // rule: if cylinderType is 'single-acting', rodDiameter is not used in extension force calculation
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if pressure > 350 bar for hydraulic or > 10 bar for pneumatic, warning: 'Pressure exceeds typical range'
  // threshold skipped (non-JS): if efficiency < 70, warning: 'Low efficiency may indicate wear or misalignment'

  const dataConfidenceAdjusted = (() => { try { return forceExtension; } catch { return forceExtension; } })();

  return {
    forceExtension,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis","Comparison with standard cylinder sizes","Detailed report with efficiency analysis"],
  };
}
