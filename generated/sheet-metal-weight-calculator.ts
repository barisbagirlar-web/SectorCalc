// Auto-generated from sheet-metal-weight-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SheetMetalWeightCalculatorInput {
  materialType: 'steel' | 'aluminum' | 'copper' | 'stainless_steel' | 'brass';
  thickness: number;
  width: number;
  length: number;
  quantity: number;
  unitSystem: 'metric' | 'imperial';
}

export const SheetMetalWeightCalculatorInputSchema = z.object({
  materialType: z.enum(['steel', 'aluminum', 'copper', 'stainless_steel', 'brass']).default('steel'),
  thickness: z.number().min(0.1).max(100).default(1),
  width: z.number().min(1).max(5000).default(1000),
  length: z.number().min(1).max(12000).default(2000),
  quantity: z.number().min(1).max(100000).default(1),
  unitSystem: z.enum(['metric', 'imperial']).default('metric'),
});

export interface SheetMetalWeightCalculatorOutput {
  totalWeight: number;
  breakdown: {
    density: number;
    volumePerSheet: number;
    weightPerSheet: number;
    totalWeight: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SheetMetalWeightCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.density = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.volumePerSheet = ((): number => { try { const __v = input.thickness * input.width * input.length / 1e9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weightPerSheet = ((): number => { try { const __v = results.volumePerSheet * results.density; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWeight = ((): number => { try { const __v = results.weightPerSheet * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weightPerSheetImperial = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWeightImperial = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSheetMetalWeightCalculator(input: SheetMetalWeightCalculatorInput): SheetMetalWeightCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalWeight = results.totalWeight ?? 0;
  const breakdown = {
    density: results.density,
    volumePerSheet: results.volumePerSheet,
    weightPerSheet: results.weightPerSheet,
    totalWeight: results.totalWeight,
  };

  // rule: thickness > 0
  // rule: width > 0
  // rule: length > 0
  // rule: quantity >= 1
  // rule: if unitSystem == 'imperial' then thickness, width, length must be in inches
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if thickness < 0.5 then 'Thin sheet; handle with care'
  // threshold skipped (non-JS): if width > 3000 then 'Oversized; special handling required'

  const dataConfidenceAdjusted = (() => { try { return results.totalWeight * 0.95; } catch { return totalWeight; } })();

  return {
    totalWeight,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical data","Detailed report with cost estimation"],
  };
}
