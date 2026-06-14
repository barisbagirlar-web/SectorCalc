// Auto-generated from concrete-bag-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ConcreteBagCalculatorInput {
  projectVolume: number;
  bagSize: '20' | '25' | '30' | '40' | '50';
  mixRatio: '1:1.5:3' | '1:2:4' | '1:3:6' | '1:4:8';
  wasteFactor: number;
  cementDensity: number;
  sandDensity: number;
  aggregateDensity: number;
  waterCementRatio: number;
  bagCost: number;
  sandCost: number;
  aggregateCost: number;
  waterCost: number;
  laborRate: number;
  laborHoursPerM3: number;
  equipmentCost: number;
  dataConfidence: number;
}

export const ConcreteBagCalculatorInputSchema = z.object({
  projectVolume: z.number().min(0.1).max(10000).default(10),
  bagSize: z.enum(['20', '25', '30', '40', '50']).default('25'),
  mixRatio: z.enum(['1:1.5:3', '1:2:4', '1:3:6', '1:4:8']).default('1:2:4'),
  wasteFactor: z.number().min(0).max(20).default(5),
  cementDensity: z.number().min(1200).max(1600).default(1440),
  sandDensity: z.number().min(1400).max(1800).default(1600),
  aggregateDensity: z.number().min(1300).max(1700).default(1500),
  waterCementRatio: z.number().min(0.35).max(0.7).default(0.5),
  bagCost: z.number().min(0).max(100).default(5),
  sandCost: z.number().min(0).max(200).default(30),
  aggregateCost: z.number().min(0).max(200).default(25),
  waterCost: z.number().min(0).max(10).default(1.5),
  laborRate: z.number().min(0).max(100).default(20),
  laborHoursPerM3: z.number().min(0.5).max(10).default(2),
  equipmentCost: z.number().min(0).max(100).default(10),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface ConcreteBagCalculatorOutput {
  totalCost: number;
  breakdown: {
    cementCost: number;
    sandCost: number;
    aggregateCost: number;
    waterCost: number;
    laborCost: number;
    equipmentCost: number;
    bagsNeeded: number;
    costPerM3: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ConcreteBagCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.adjustedVolume = (() => { try { return input.projectVolume * (1 + input.wasteFactor / 100); } catch { return 0; } })();
  results.mixParts = (() => { try { return 0; } catch { return 0; } })();
  results.cementRatio = (() => { try { return 0; } catch { return 0; } })();
  results.sandRatio = (() => { try { return 0; } catch { return 0; } })();
  results.aggregateRatio = (() => { try { return 0; } catch { return 0; } })();
  results.cementMass = (() => { try { return results.adjustedVolume * results.cementRatio * input.cementDensity; } catch { return 0; } })();
  results.sandMass = (() => { try { return results.adjustedVolume * results.sandRatio * input.sandDensity; } catch { return 0; } })();
  results.aggregateMass = (() => { try { return results.adjustedVolume * results.aggregateRatio * input.aggregateDensity; } catch { return 0; } })();
  results.waterMass = (() => { try { return results.cementMass * input.waterCementRatio; } catch { return 0; } })();
  results.waterVolume = (() => { try { return results.waterMass / 1000; } catch { return 0; } })();
  results.bagsNeeded = (() => { try { return Math.ceil(results.cementMass / input.bagSize); } catch { return 0; } })();
  results.cementCost = (() => { try { return results.bagsNeeded * input.bagCost; } catch { return 0; } })();
  results.sandCostTotal = (() => { try { return results.sandMass / 1000 * input.sandCost; } catch { return 0; } })();
  results.aggregateCostTotal = (() => { try { return results.aggregateMass / 1000 * input.aggregateCost; } catch { return 0; } })();
  results.waterCostTotal = (() => { try { return results.waterVolume * input.waterCost; } catch { return 0; } })();
  results.laborCost = (() => { try { return results.adjustedVolume * input.laborHoursPerM3 * input.laborRate; } catch { return 0; } })();
  results.equipmentCostTotal = (() => { try { return results.adjustedVolume * input.equipmentCost; } catch { return 0; } })();
  results.totalMaterialCost = (() => { try { return results.cementCost + results.sandCostTotal + results.aggregateCostTotal + results.waterCostTotal; } catch { return 0; } })();
  results.totalCost = (() => { try { return results.totalMaterialCost + results.laborCost + results.equipmentCostTotal; } catch { return 0; } })();
  results.costPerM3 = (() => { try { return results.totalCost / input.projectVolume; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = (() => { try { return results.totalCost * (1 + (100 - input.dataConfidence) / 100); } catch { return 0; } })();
  return results;
}

export function calculateConcreteBagCalculator(input: ConcreteBagCalculatorInput): ConcreteBagCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    cementCost: results.cementCost,
    sandCost: results.sandCostTotal,
    aggregateCost: results.aggregateCostTotal,
    waterCost: results.waterCostTotal,
    laborCost: results.laborCost,
    equipmentCost: results.equipmentCostTotal,
    bagsNeeded: results.bagsNeeded,
    costPerM3: results.costPerM3,
  };

  // rule: projectVolume > 0
  // rule: bagSize must be one of 20,25,30,40,50
  // rule: mixRatio must be one of 1:1.5:3, 1:2:4, 1:3:6, 1:4:8
  // rule: wasteFactor >= 0 and <= 20
  // rule: cementDensity >= 1200 and <= 1600
  // rule: sandDensity >= 1400 and <= 1800
  // rule: aggregateDensity >= 1300 and <= 1700
  // rule: waterCementRatio >= 0.35 and <= 0.7
  // rule: bagCost >= 0
  // rule: sandCost >= 0
  // rule: aggregateCost >= 0
  // rule: waterCost >= 0
  // rule: laborRate >= 0
  // rule: laborHoursPerM3 >= 0.5 and <= 10
  // rule: equipmentCost >= 0
  // rule: dataConfidence >= 50 and <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor may indicate inefficiency.
  // threshold skipped (non-JS): High water-cement ratio may reduce strength.
  // threshold skipped (non-JS): High labor hours indicate low productivity.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Projects","Detailed Cost Breakdown Report"],
  };
}
