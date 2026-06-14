// Auto-generated from oee-equipment-effectiveness-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface OeeEquipmentEffectivenessCalculatorInput {
  plannedProductionTime: number;
  operatingTime: number;
  idealCycleTime: number;
  totalPartsProduced: number;
  goodPartsProduced: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const OeeEquipmentEffectivenessCalculatorInputSchema = z.object({
  plannedProductionTime: z.number().min(0).default(480),
  operatingTime: z.number().min(0).default(450),
  idealCycleTime: z.number().min(0.001).default(0.5),
  totalPartsProduced: z.number().min(0).default(800),
  goodPartsProduced: z.number().min(0).default(760),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface OeeEquipmentEffectivenessCalculatorOutput {
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

function evaluateFormulas(input: OeeEquipmentEffectivenessCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.availability = ((): number => { try { const __v = input.operatingTime / input.plannedProductionTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.performance = ((): number => { try { const __v = (input.totalPartsProduced * input.idealCycleTime) / input.operatingTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.quality = ((): number => { try { const __v = input.goodPartsProduced / input.totalPartsProduced; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.oee = ((): number => { try { const __v = results.availability * results.performance * results.quality; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.oee * (input.dataConfidence == 'high' ? 1.0 : input.dataConfidence == 'medium' ? 0.95 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateOeeEquipmentEffectivenessCalculator(input: OeeEquipmentEffectivenessCalculatorInput): OeeEquipmentEffectivenessCalculatorOutput {
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
  // threshold skipped (non-JS): availability < 0.9 -> 'Low availability: investigate downtime causes'
  // threshold skipped (non-JS): performance < 0.95 -> 'Low performance: check speed losses'
  // threshold skipped (non-JS): quality < 0.99 -> 'Low quality: review defect sources'
  // threshold skipped (non-JS): oee < 0.85 -> 'OEE below world-class (85%)'

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
