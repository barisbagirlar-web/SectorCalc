// Auto-generated from plaster-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PlasterCalculatorInput {
  wallLength: number;
  wallHeight: number;
  plasterThickness: number;
  mixRatio: '1:3' | '1:4' | '1:5' | '1:6';
  cementDensity: number;
  sandDensity: number;
  wastageFactor: number;
  laborRate: number;
  cementPrice: number;
  sandPrice: number;
}

export const PlasterCalculatorInputSchema = z.object({
  wallLength: z.number().min(0.1).max(100).default(10),
  wallHeight: z.number().min(0.1).max(20).default(3),
  plasterThickness: z.number().min(5).max(50).default(15),
  mixRatio: z.enum(['1:3', '1:4', '1:5', '1:6']).default('1:4'),
  cementDensity: z.number().min(1300).max(1600).default(1440),
  sandDensity: z.number().min(1400).max(1800).default(1600),
  wastageFactor: z.number().min(0).max(20).default(5),
  laborRate: z.number().min(0).max(50).default(5),
  cementPrice: z.number().min(0).max(100).default(7),
  sandPrice: z.number().min(0).max(100).default(20),
});

export interface PlasterCalculatorOutput {
  totalCost: number;
  breakdown: {
    wallArea: number;
    plasterVolume: number;
    cementBags: number;
    sandVolume: number;
    totalMaterialCost: number;
    totalLaborCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PlasterCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.wallArea = ((): number => { try { const __v = input.wallLength * input.wallHeight; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.plasterVolume = ((): number => { try { const __v = results.wallArea * (input.plasterThickness / 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dryVolume = ((): number => { try { const __v = results.plasterVolume * 1.33; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.mixParts = ((): number => { try { const __v = parseInt(input.mixRatio.split(':')[0]) + parseInt(input.mixRatio.split(':')[1]); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cementVolume = ((): number => { try { const __v = results.dryVolume * (parseInt(input.mixRatio.split(':')[0]) / results.mixParts); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sandVolume = ((): number => { try { const __v = results.dryVolume * (parseInt(input.mixRatio.split(':')[1]) / results.mixParts); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cementWeight = ((): number => { try { const __v = results.cementVolume * input.cementDensity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cementBags = ((): number => { try { const __v = results.cementWeight / 50; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sandWeight = ((): number => { try { const __v = results.sandVolume * input.sandDensity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMaterialCost = ((): number => { try { const __v = (results.cementBags * input.cementPrice) + (results.sandVolume * input.sandPrice); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = results.wallArea * input.laborRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = (results.totalMaterialCost + results.totalLaborCost) * (1 + input.wastageFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePlasterCalculator(input: PlasterCalculatorInput): PlasterCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    wallArea: results.wallArea,
    plasterVolume: results.plasterVolume,
    cementBags: results.cementBags,
    sandVolume: results.sandVolume,
    totalMaterialCost: results.totalMaterialCost,
    totalLaborCost: results.totalLaborCost,
  };

  // rule: wallLength > 0
  // rule: wallHeight > 0
  // rule: plasterThickness >= 5 && plasterThickness <= 50
  // rule: wastageFactor >= 0 && wastageFactor <= 20
  // rule: laborRate >= 0
  // rule: cementPrice >= 0
  // rule: sandPrice >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High wastage factor may indicate poor workmanship or material quality.
  // threshold skipped (non-JS): Thick plaster may require multiple coats or structural assessment.
  // threshold skipped (non-JS): Labor cost is above typical market rate.

  const dataConfidenceAdjusted = (() => { try { return results.totalCost * (1 - 0.05); } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Cost Comparison","Detailed Report"],
  };
}
