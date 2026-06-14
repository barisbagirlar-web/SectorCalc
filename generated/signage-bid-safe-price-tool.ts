// Auto-generated from signage-bid-safe-price-tool-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SignageBidSafePriceToolInput {
  materialCost: number;
  laborCostPerHour: number;
  laborHoursPerUnit: number;
  overheadRate: number;
  profitMargin: number;
  quantity: number;
  complexityFactor: 'low' | 'medium' | 'high';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const SignageBidSafePriceToolInputSchema = z.object({
  materialCost: z.number().min(0).default(0),
  laborCostPerHour: z.number().min(0).default(25),
  laborHoursPerUnit: z.number().min(0).default(2),
  overheadRate: z.number().min(0).max(100).default(20),
  profitMargin: z.number().min(0).max(100).default(15),
  quantity: z.number().min(1).default(100),
  complexityFactor: z.enum(['low', 'medium', 'high']).default('medium'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface SignageBidSafePriceToolOutput {
  finalSafePrice: number;
  breakdown: {
    unitCost: number;
    directCostPerUnit: number;
    overheadCostPerUnit: number;
    profitPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SignageBidSafePriceToolInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.directCost = ((): number => { try { const __v = input.materialCost + (input.laborCostPerHour * input.laborHoursPerUnit); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = results.directCost * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.totalDirectCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.unitCost = ((): number => { try { const __v = results.totalCost / input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.safePrice = ((): number => { try { const __v = results.unitCost * (1 + input.profitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.complexityMultiplier = ((): number => { try { const __v = input.complexityFactor == 'low' ? 1.0 : (input.complexityFactor == 'medium' ? 1.2 : 1.5); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedSafePrice = ((): number => { try { const __v = results.safePrice * results.complexityMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceMultiplier = ((): number => { try { const __v = input.dataConfidence == 'low' ? 1.1 : (input.dataConfidence == 'medium' ? 1.0 : 0.95); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalSafePrice = ((): number => { try { const __v = results.adjustedSafePrice * results.dataConfidenceMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSignageBidSafePriceTool(input: SignageBidSafePriceToolInput): SignageBidSafePriceToolOutput {
  const results = evaluateFormulas(input);
  const finalSafePrice = results.finalSafePrice ?? 0;
  const breakdown = {
    unitCost: results.unitCost,
    directCostPerUnit: results.directCostPerUnit,
    overheadCostPerUnit: results.overheadCostPerUnit,
    profitPerUnit: results.profitPerUnit,
  };

  // rule: materialCost >= 0
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerUnit >= 0
  // rule: overheadRate >= 0 and overheadRate <= 100
  // rule: profitMargin >= 0 and profitMargin <= 100
  // rule: quantity >= 1
  // rule: if complexityFactor == 'high' then laborHoursPerUnit >= 3
  // rule: if dataConfidence == 'low' then profitMargin >= 20
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Overhead rate exceeds typical benchmark (WERC). Consider cost reduction.
  // threshold skipped (non-JS): Profit margin too low for sustainable business.
  // threshold skipped (non-JS): Labor hours per unit high; investigate process improvement (Lean).

  const dataConfidenceAdjusted = (() => { try { return results.finalSafePrice; } catch { return finalSafePrice; } })();

  return {
    finalSafePrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Breakdown"],
  };
}
