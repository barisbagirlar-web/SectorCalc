// Auto-generated from home-renovation-m2-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HomeRenovationM2CalculatorInput {
  roomLength: number;
  roomWidth: number;
  flooringType: 'laminate' | 'tile' | 'hardwood' | 'carpet' | 'vinyl';
  wasteFactor: number;
  materialCostPerM2: number;
  laborCostPerM2: number;
  additionalCosts: number;
  dataConfidence: number;
}

export const HomeRenovationM2CalculatorInputSchema = z.object({
  roomLength: z.number().min(0.5).max(50).default(5),
  roomWidth: z.number().min(0.5).max(50).default(4),
  flooringType: z.enum(['laminate', 'tile', 'hardwood', 'carpet', 'vinyl']).default('laminate'),
  wasteFactor: z.number().min(0).max(30).default(10),
  materialCostPerM2: z.number().min(1).max(500).default(30),
  laborCostPerM2: z.number().min(0).max(200).default(20),
  additionalCosts: z.number().min(0).max(10000).default(0),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface HomeRenovationM2CalculatorOutput {
  totalCost: number;
  breakdown: {
    netArea: number;
    totalMaterialArea: number;
    materialCost: number;
    laborCost: number;
    additionalCosts: number;
    costPerM2: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HomeRenovationM2CalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.netArea = ((): number => { try { const __v = input.roomLength * input.roomWidth; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMaterialArea = ((): number => { try { const __v = results.netArea * (1 + input.wasteFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.totalMaterialArea * input.materialCostPerM2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.netArea * input.laborCostPerM2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.materialCost + results.laborCost + input.additionalCosts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerM2 = ((): number => { try { const __v = results.totalCost / results.netArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHomeRenovationM2Calculator(input: HomeRenovationM2CalculatorInput): HomeRenovationM2CalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    netArea: results.netArea,
    totalMaterialArea: results.totalMaterialArea,
    materialCost: results.materialCost,
    laborCost: results.laborCost,
    additionalCosts: results.additionalCosts,
    costPerM2: results.costPerM2,
  };

  // rule: roomLength > 0
  // rule: roomWidth > 0
  // rule: wasteFactor >= 0 and wasteFactor <= 30
  // rule: materialCostPerM2 > 0
  // rule: laborCostPerM2 >= 0
  // rule: additionalCosts >= 0
  // rule: dataConfidence >= 0 and dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor; consider optimizing layout or ordering extra material.
  // threshold skipped (non-JS): Material cost is high; consider alternative flooring types.
  // threshold skipped (non-JS): Labor cost is high; consider DIY or negotiate rates.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with benchmarks","Detailed report with charts"],
  };
}
