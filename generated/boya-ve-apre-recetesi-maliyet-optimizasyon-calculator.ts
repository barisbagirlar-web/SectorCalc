// Auto-generated from boya-ve-apre-recetesi-maliyet-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInput {
  annualProductionVolume: number;
  batchSize: number;
  rawMaterialCostPerTon: number;
  laborCostPerHour: number;
  laborHoursPerBatch: number;
  energyCostPerKwh: number;
  energyConsumptionPerBatch: number;
  defectRate: number;
  reworkCostPerTon: number;
  setupTimePerBatch: number;
  setupCostPerHour: number;
  wasteDisposalCostPerTon: number;
  wasteRate: number;
  dataConfidence: number;
}

export const BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputSchema = z.object({
  annualProductionVolume: z.number().min(0).default(1000),
  batchSize: z.number().min(0.1).default(10),
  rawMaterialCostPerTon: z.number().min(0).default(500),
  laborCostPerHour: z.number().min(0).default(25),
  laborHoursPerBatch: z.number().min(0).default(8),
  energyCostPerKwh: z.number().min(0).default(0.12),
  energyConsumptionPerBatch: z.number().min(0).default(500),
  defectRate: z.number().min(0).max(1).default(0.02),
  reworkCostPerTon: z.number().min(0).default(200),
  setupTimePerBatch: z.number().min(0).default(2),
  setupCostPerHour: z.number().min(0).default(50),
  wasteDisposalCostPerTon: z.number().min(0).default(100),
  wasteRate: z.number().min(0).max(1).default(0.05),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorOutput {
  costPerTon: number;
  breakdown: {
    materialCostPerTon: number;
    laborCostPerTon: number;
    energyCostPerTon: number;
    defectCostPerTon: number;
    setupCostPerTon: number;
    wasteCostPerTon: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalAnnualCost = (() => { try { return input.annualProductionVolume * (input.rawMaterialCostPerTon + (input.laborCostPerHour * input.laborHoursPerBatch / input.batchSize) + (input.energyCostPerKwh * input.energyConsumptionPerBatch / input.batchSize) + (input.defectRate * input.reworkCostPerTon) + (input.setupTimePerBatch * input.setupCostPerHour / input.batchSize) + (input.wasteRate * input.wasteDisposalCostPerTon)); } catch { return 0; } })();
  results.costPerTon = (() => { try { return results.totalAnnualCost / input.annualProductionVolume; } catch { return 0; } })();
  results.materialCostPerTon = (() => { try { return input.rawMaterialCostPerTon; } catch { return 0; } })();
  results.laborCostPerTon = (() => { try { return input.laborCostPerHour * input.laborHoursPerBatch / input.batchSize; } catch { return 0; } })();
  results.energyCostPerTon = (() => { try { return input.energyCostPerKwh * input.energyConsumptionPerBatch / input.batchSize; } catch { return 0; } })();
  results.defectCostPerTon = (() => { try { return input.defectRate * input.reworkCostPerTon; } catch { return 0; } })();
  results.setupCostPerTon = (() => { try { return input.setupTimePerBatch * input.setupCostPerHour / input.batchSize; } catch { return 0; } })();
  results.wasteCostPerTon = (() => { try { return input.wasteRate * input.wasteDisposalCostPerTon; } catch { return 0; } })();
  results.dataConfidenceAdjustedCostPerTon = (() => { try { return results.costPerTon / input.dataConfidence; } catch { return 0; } })();
  return results;
}

export function calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(input: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInput): BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const costPerTon = results.costPerTon ?? 0;
  const breakdown = {
    materialCostPerTon: results.materialCostPerTon,
    laborCostPerTon: results.laborCostPerTon,
    energyCostPerTon: results.energyCostPerTon,
    defectCostPerTon: results.defectCostPerTon,
    setupCostPerTon: results.setupCostPerTon,
    wasteCostPerTon: results.wasteCostPerTon,
  };

  // rule: annualProductionVolume > 0
  // rule: batchSize > 0
  // rule: rawMaterialCostPerTon >= 0
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerBatch >= 0
  // rule: energyCostPerKwh >= 0
  // rule: energyConsumptionPerBatch >= 0
  // rule: defectRate >= 0 and defectRate <= 1
  // rule: reworkCostPerTon >= 0
  // rule: setupTimePerBatch >= 0
  // rule: setupCostPerHour >= 0
  // rule: wasteDisposalCostPerTon >= 0
  // rule: wasteRate >= 0 and wasteRate <= 1
  // rule: dataConfidence > 0 and dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Defect rate exceeds 5% - immediate quality improvement needed.
  // threshold skipped (non-JS): Warning: Waste rate above 10% - review material efficiency.
  // threshold skipped (non-JS): Warning: Setup time exceeds 4 hours - consider SMED implementation.
  // threshold skipped (non-JS): Warning: High energy consumption per batch - energy audit recommended.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCostPerTon; } catch { return costPerTon; } })();

  return {
    costPerTon,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
