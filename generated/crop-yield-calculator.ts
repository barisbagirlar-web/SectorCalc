// Auto-generated from crop-yield-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CropYieldCalculatorInput {
  fieldArea: number;
  cropType: 'wheat' | 'corn' | 'rice' | 'soybean' | 'cotton';
  plantingDensity: number;
  germinationRate: number;
  survivalRate: number;
  earsPerPlant: number;
  kernelsPerEar: number;
  kernelWeight: number;
  moistureContent: number;
  harvestLoss: number;
  dataConfidence: number;
}

export const CropYieldCalculatorInputSchema = z.object({
  fieldArea: z.number().min(0.01).max(10000).default(1),
  cropType: z.enum(['wheat', 'corn', 'rice', 'soybean', 'cotton']).default('wheat'),
  plantingDensity: z.number().min(1000).max(1000000).default(100000),
  germinationRate: z.number().min(0).max(100).default(90),
  survivalRate: z.number().min(0).max(100).default(85),
  earsPerPlant: z.number().min(0.5).max(3).default(1),
  kernelsPerEar: z.number().min(100).max(1000).default(600),
  kernelWeight: z.number().min(100).max(500).default(300),
  moistureContent: z.number().min(5).max(30).default(15),
  harvestLoss: z.number().min(0).max(20).default(5),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface CropYieldCalculatorOutput {
  totalYieldTons: number;
  breakdown: {
    plantsPerHectare: number;
    earsPerHectare: number;
    kernelsPerHectare: number;
    grossYieldKgPerHa: number;
    netYieldKgPerHa: number;
    adjustedMoistureYieldKgPerHa: number;
    totalYieldKg: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CropYieldCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.plantsPerHectare = (() => { try { return input.plantingDensity * (input.germinationRate/100) * (input.survivalRate/100); } catch { return 0; } })();
  results.earsPerHectare = (() => { try { return results.plantsPerHectare * input.earsPerPlant; } catch { return 0; } })();
  results.kernelsPerHectare = (() => { try { return results.earsPerHectare * input.kernelsPerEar; } catch { return 0; } })();
  results.grossYieldKgPerHa = (() => { try { return results.kernelsPerHectare * (input.kernelWeight/1000) / 1000; } catch { return 0; } })();
  results.netYieldKgPerHa = (() => { try { return results.grossYieldKgPerHa * (1 - input.harvestLoss/100); } catch { return 0; } })();
  results.adjustedMoistureYieldKgPerHa = (() => { try { return results.netYieldKgPerHa * (1 - (input.moistureContent - 15)/100); } catch { return 0; } })();
  results.totalYieldKg = (() => { try { return results.adjustedMoistureYieldKgPerHa * input.fieldArea; } catch { return 0; } })();
  results.totalYieldTons = (() => { try { return results.totalYieldKg / 1000; } catch { return 0; } })();
  results.dataConfidenceAdjustedYieldTons = (() => { try { return results.totalYieldTons * (input.dataConfidence/100); } catch { return 0; } })();
  return results;
}

export function calculateCropYieldCalculator(input: CropYieldCalculatorInput): CropYieldCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalYieldTons = results.totalYieldTons ?? 0;
  const breakdown = {
    plantsPerHectare: results.plantsPerHectare,
    earsPerHectare: results.earsPerHectare,
    kernelsPerHectare: results.kernelsPerHectare,
    grossYieldKgPerHa: results.grossYieldKgPerHa,
    netYieldKgPerHa: results.netYieldKgPerHa,
    adjustedMoistureYieldKgPerHa: results.adjustedMoistureYieldKgPerHa,
    totalYieldKg: results.totalYieldKg,
  };

  // rule: germinationRate + survivalRate must be <= 200? (no strict rule)
  // rule: if cropType == 'rice' then fieldArea must be >= 0.1
  // rule: if moistureContent > 20 then harvestLoss must be increased by 2% (not enforced in formula)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low germination rate may require replanting
  // threshold skipped (non-JS): Low survival rate indicates pest or disease issues
  // threshold skipped (non-JS): High moisture content may cause storage spoilage
  // threshold skipped (non-JS): Excessive harvest loss, check equipment

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedYieldTons; } catch { return totalYieldTons; } })();

  return {
    totalYieldTons,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over seasons","Comparison with historical yields","Detailed report with charts"],
  };
}
