// Auto-generated from oee-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface OeeCalculatorInput {
  plannedProductionTime: number;
  operatingTime: number;
  idealCycleTime: number;
  totalPartsProduced: number;
  goodPartsProduced: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const OeeCalculatorInputSchema = z.object({
  plannedProductionTime: z.number().min(0).default(480),
  operatingTime: z.number().min(0).default(450),
  idealCycleTime: z.number().min(0).default(1),
  totalPartsProduced: z.number().min(0).default(400),
  goodPartsProduced: z.number().min(0).default(380),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface OeeCalculatorOutput {
  oee: number;
  breakdown: {
    availability: number;
    performance: number;
    quality: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: OeeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.availability = ((): number => { try { const __v = input.operatingTime / input.plannedProductionTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.performance = ((): number => { try { const __v = (input.totalPartsProduced * input.idealCycleTime) / input.operatingTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.quality = ((): number => { try { const __v = input.goodPartsProduced / input.totalPartsProduced; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.oee = ((): number => { try { const __v = results.availability * results.performance * results.quality; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.oee * (input.dataConfidence === 'high' ? 1 : input.dataConfidence === 'medium' ? 0.95 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateOeeCalculator(input: OeeCalculatorInput): OeeCalculatorOutput {
  const results = evaluateFormulas(input);
  const oee = results.oee ?? 0;
  const breakdown = {
    availability: results.availability,
    performance: results.performance,
    quality: results.quality,
  };

  // rule: operatingTime <= plannedProductionTime
  // rule: totalPartsProduced >= 0
  // rule: goodPartsProduced <= totalPartsProduced
  // rule: idealCycleTime > 0
  // rule: plannedProductionTime > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): oee
  // threshold skipped (non-string): availability
  // threshold skipped (non-string): performance
  // threshold skipped (non-string): quality

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return oee; } })();

  return {
    oee,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed loss breakdown report"],
  };
}
