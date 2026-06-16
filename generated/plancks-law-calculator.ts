// Auto-generated from plancks-law-calculator-schema.json
import * as z from 'zod';

export interface Plancks_law_calculatorInput {
  temperature: number;
  wavelength: number;
  wavelengthMin: number;
  wavelengthMax: number;
  numSteps: number;
}

export const Plancks_law_calculatorInputSchema = z.object({
  temperature: z.number().default(5000),
  wavelength: z.number().default(5e-7),
  wavelengthMin: z.number().default(1e-7),
  wavelengthMax: z.number().default(0.000003),
  numSteps: z.number().default(1000),
});

function evaluateAllFormulas(input: Plancks_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2*h*c*c)/(lambda**5) * 1/(Math.exp((h*c)/(lambda*k*T)) - 1); results["spectralRadiance"] = Number.isFinite(v) ? v : 0; } catch { results["spectralRadiance"] = 0; }
  try { const v = (() => { const h = 6.62607015e-34; const c = 299792458; const k = 1.380649e-23; const T = input.temperature; const lamMin = input.wavelengthMin; const lamMax = input.wavelengthMax; const N = input.numSteps; const dlam = (lamMax - lamMin)/N; let sum = 0; for(let i=0; i<N; i++){ const lam = lamMin + (i+0.5)*dlam; sum += (2*h*c*c)/(lam**5) * 1/(Math.exp((h*c)/(lam*k*T)) - 1) * dlam; return } sum; })(); results["totalRadiance"] = Number.isFinite(v) ? v : 0; } catch { results["totalRadiance"] = 0; }
  try { const v = b / input.temperature; results["peakWavelength"] = Number.isFinite(v) ? v : 0; } catch { results["peakWavelength"] = 0; }
  return results;
}


export function calculatePlancks_law_calculator(input: Plancks_law_calculatorInput): Plancks_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["spectralRadiance"] ?? 0;
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


export interface Plancks_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
