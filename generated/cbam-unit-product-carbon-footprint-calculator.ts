// Auto-generated from cbam-unit-product-carbon-footprint-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CbamUnitProductCarbonFootprintCalculatorInput {
  productWeight: number;
  materialType: 'steel' | 'aluminum' | 'plastic' | 'glass' | 'wood' | 'other';
  emissionFactorMaterial: number;
  productionEnergy: number;
  gridEmissionFactor: number;
  transportDistance: number;
  transportMode: 'truck' | 'train' | 'ship' | 'air';
  emissionFactorTransport: number;
  usePhaseEnergy: number;
  usePhaseEmissionFactor: number;
  endOfLifeRecyclingRate: number;
  recyclingEmissionFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CbamUnitProductCarbonFootprintCalculatorInputSchema = z.object({
  productWeight: z.number().min(0).default(1),
  materialType: z.enum(['steel', 'aluminum', 'plastic', 'glass', 'wood', 'other']).default('steel'),
  emissionFactorMaterial: z.number().min(0).default(1.85),
  productionEnergy: z.number().min(0).default(10),
  gridEmissionFactor: z.number().min(0).default(0.5),
  transportDistance: z.number().min(0).default(100),
  transportMode: z.enum(['truck', 'train', 'ship', 'air']).default('truck'),
  emissionFactorTransport: z.number().min(0).default(0.1),
  usePhaseEnergy: z.number().min(0).default(0),
  usePhaseEmissionFactor: z.number().min(0).default(0.5),
  endOfLifeRecyclingRate: z.number().min(0).max(100).default(50),
  recyclingEmissionFactor: z.number().min(0).default(0.5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CbamUnitProductCarbonFootprintCalculatorOutput {
  totalCarbonFootprint: number;
  breakdown: {
    materialCarbonFootprint: number;
    energyCarbonFootprint: number;
    transportCarbonFootprint: number;
    usePhaseCarbonFootprint: number;
    recyclingCredit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CbamUnitProductCarbonFootprintCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.materialCarbonFootprint = (() => { try { return input.productWeight * input.emissionFactorMaterial; } catch { return 0; } })();
  results.energyCarbonFootprint = (() => { try { return input.productionEnergy * input.gridEmissionFactor; } catch { return 0; } })();
  results.transportCarbonFootprint = (() => { try { return (input.productWeight / 1000) * input.transportDistance * input.emissionFactorTransport; } catch { return 0; } })();
  results.usePhaseCarbonFootprint = (() => { try { return input.usePhaseEnergy * input.usePhaseEmissionFactor; } catch { return 0; } })();
  results.recyclingCredit = (() => { try { return input.productWeight * (input.endOfLifeRecyclingRate / 100) * (input.emissionFactorMaterial - input.recyclingEmissionFactor); } catch { return 0; } })();
  results.totalCarbonFootprint = (() => { try { return results.materialCarbonFootprint + results.energyCarbonFootprint + results.transportCarbonFootprint + results.usePhaseCarbonFootprint - results.recyclingCredit; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.totalCarbonFootprint * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); } catch { return 0; } })();
  return results;
}

export function calculateCbamUnitProductCarbonFootprintCalculator(input: CbamUnitProductCarbonFootprintCalculatorInput): CbamUnitProductCarbonFootprintCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCarbonFootprint = results.totalCarbonFootprint ?? 0;
  const breakdown = {
    materialCarbonFootprint: results.materialCarbonFootprint,
    energyCarbonFootprint: results.energyCarbonFootprint,
    transportCarbonFootprint: results.transportCarbonFootprint,
    usePhaseCarbonFootprint: results.usePhaseCarbonFootprint,
    recyclingCredit: results.recyclingCredit,
  };

  // rule: productWeight > 0
  // rule: emissionFactorMaterial >= 0
  // rule: productionEnergy >= 0
  // rule: gridEmissionFactor >= 0
  // rule: transportDistance >= 0
  // rule: emissionFactorTransport >= 0
  // rule: usePhaseEnergy >= 0
  // rule: usePhaseEmissionFactor >= 0
  // rule: endOfLifeRecyclingRate >= 0 and <= 100
  // rule: recyclingEmissionFactor >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 1000: 'High carbon footprint, consider reduction strategies'
  // threshold skipped (non-JS): > 500: 'Material emissions are high, consider alternative materials'
  // threshold skipped (non-JS): > 300: 'Production energy emissions are high, improve energy efficiency'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCarbonFootprint; } })();

  return {
    totalCarbonFootprint,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
