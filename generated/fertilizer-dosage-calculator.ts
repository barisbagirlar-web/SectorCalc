// Auto-generated from fertilizer-dosage-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FertilizerDosageCalculatorInput {
  cropType: 'corn' | 'wheat' | 'rice' | 'soybean' | 'cotton';
  soilNitrogen: number;
  soilPhosphorus: number;
  soilPotassium: number;
  targetYield: number;
  fertilizerType: 'urea' | 'ammonium nitrate' | 'DAP' | 'MOP' | 'NPK blend';
  applicationMethod: 'broadcast' | 'banding' | 'fertigation' | 'foliar';
  efficiencyFactor: number;
  area: number;
}

export const FertilizerDosageCalculatorInputSchema = z.object({
  cropType: z.enum(['corn', 'wheat', 'rice', 'soybean', 'cotton']).default('corn'),
  soilNitrogen: z.number().min(0).max(200).default(20),
  soilPhosphorus: z.number().min(0).max(100).default(15),
  soilPotassium: z.number().min(0).max(500).default(100),
  targetYield: z.number().min(0).max(20000).default(8000),
  fertilizerType: z.enum(['urea', 'ammonium nitrate', 'DAP', 'MOP', 'NPK blend']).default('urea'),
  applicationMethod: z.enum(['broadcast', 'banding', 'fertigation', 'foliar']).default('broadcast'),
  efficiencyFactor: z.number().min(0).max(100).default(70),
  area: z.number().min(0.1).max(1000).default(1),
});

export interface FertilizerDosageCalculatorOutput {
  totalFertilizer: number;
  breakdown: {
    nitrogenDosage: number;
    phosphorusDosage: number;
    potassiumDosage: number;
    costEstimate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FertilizerDosageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.nutrientRequirement = ((): number => { try { const __v = cropNutrientDemand[input.cropType] * input.targetYield / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.availableNutrient = ((): number => { try { const __v = soilNutrient * 2.24 * 0.01; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.nutrientDeficit = ((): number => { try { const __v = Math.max(0, results.nutrientRequirement - results.availableNutrient); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fertilizerDosage = ((): number => { try { const __v = results.nutrientDeficit / (fertilizerNutrientContent[input.fertilizerType] * input.efficiencyFactor / 100) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFertilizer = ((): number => { try { const __v = results.fertilizerDosage * input.area; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFertilizerDosageCalculator(input: FertilizerDosageCalculatorInput): FertilizerDosageCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalFertilizer = results.totalFertilizer ?? 0;
  const breakdown = {
    nitrogenDosage: results.nitrogenDosage,
    phosphorusDosage: results.phosphorusDosage,
    potassiumDosage: results.potassiumDosage,
    costEstimate: results.costEstimate,
  };

  // rule: soilNitrogen >= 0 && soilNitrogen <= 200
  // rule: soilPhosphorus >= 0 && soilPhosphorus <= 100
  // rule: soilPotassium >= 0 && soilPotassium <= 500
  // rule: targetYield > 0
  // rule: efficiencyFactor >= 0 && efficiencyFactor <= 100
  // rule: area > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if soilNitrogen > 150 then 'High nitrogen level, reduce dosage'
  // threshold skipped (non-JS): if soilPhosphorus > 80 then 'High phosphorus level, reduce dosage'
  // threshold skipped (non-JS): if soilPotassium > 400 then 'High potassium level, reduce dosage'
  // threshold skipped (non-JS): if efficiencyFactor < 50 then 'Low efficiency, consider improving application method'

  const dataConfidenceAdjusted = (() => { try { return results.totalFertilizer * (1 + (1 - dataConfidence) * 0.1); } catch { return totalFertilizer; } })();

  return {
    totalFertilizer,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical data","Detailed report with recommendations"],
  };
}
