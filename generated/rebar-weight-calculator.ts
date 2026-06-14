// Auto-generated from rebar-weight-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RebarWeightCalculatorInput {
  diameter: number;
  length: number;
  quantity: number;
  steelDensity: number;
  unitSystem: 'metric' | 'imperial';
}

export const RebarWeightCalculatorInputSchema = z.object({
  diameter: z.number().min(6).max(50).default(12),
  length: z.number().min(0.1).max(100).default(12),
  quantity: z.number().min(1).max(100000).default(1),
  steelDensity: z.number().min(7800).max(7900).default(7850),
  unitSystem: z.enum(['metric', 'imperial']).default('metric'),
});

export interface RebarWeightCalculatorOutput {
  totalWeight: number;
  breakdown: {
    crossSectionalArea: number;
    weightPerMeter: number;
    totalWeight: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RebarWeightCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.crossSectionalArea = ((): number => { try { const __v = PI * (input.diameter/2000)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weightPerMeter = ((): number => { try { const __v = results.crossSectionalArea * input.steelDensity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWeight = ((): number => { try { const __v = results.weightPerMeter * input.length * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRebarWeightCalculator(input: RebarWeightCalculatorInput): RebarWeightCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalWeight = results.totalWeight ?? 0;
  const breakdown = {
    crossSectionalArea: results.crossSectionalArea,
    weightPerMeter: results.weightPerMeter,
    totalWeight: results.totalWeight,
  };

  // rule: diameter must be between 6 and 50 mm
  // rule: length must be positive and ≤ 100 m
  // rule: quantity must be positive integer
  // rule: steelDensity must be between 7800 and 7900 kg/m³
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.diameter < 10) hiddenLossDrivers.push("'Small diameter rebar, check structural requirements'");
  if (input.quantity > 1000) hiddenLossDrivers.push("'Large order, consider bulk pricing'");

  const dataConfidenceAdjusted = (() => { try { return totalWeight; } catch { return totalWeight; } })();

  return {
    totalWeight,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of calculation report","CSV export of multiple calculations","Trend analysis of weight vs diameter","Comparison of different rebar sizes","Detailed report with material cost estimation"],
  };
}
