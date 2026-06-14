// Auto-generated from stair-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface StairCalculatorInput {
  riserHeight: number;
  treadDepth: number;
  numberOfSteps: number;
  stairWidth: number;
  materialType: 'concrete' | 'steel' | 'wood' | 'aluminum';
  unitCostMaterial: number;
  laborRate: number;
  laborHoursPerStep: number;
  wasteFactor: number;
  dataConfidence: number;
}

export const StairCalculatorInputSchema = z.object({
  riserHeight: z.number().min(100).max(220).default(180),
  treadDepth: z.number().min(200).max(400).default(280),
  numberOfSteps: z.number().min(1).max(100).default(10),
  stairWidth: z.number().min(800).max(2000).default(1000),
  materialType: z.enum(['concrete', 'steel', 'wood', 'aluminum']).default('concrete'),
  unitCostMaterial: z.number().min(0).max(10000).default(150),
  laborRate: z.number().min(0).max(200).default(30),
  laborHoursPerStep: z.number().min(0.5).max(10).default(2),
  wasteFactor: z.number().min(0).max(20).default(5),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface StairCalculatorOutput {
  totalCost: number;
  breakdown: {
    materialCost: number;
    laborCost: number;
    costPerStep: number;
    totalRise: number;
    totalRun: number;
    stringerLength: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: StairCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalRise = ((): number => { try { const __v = input.riserHeight * input.numberOfSteps; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalRun = ((): number => { try { const __v = input.treadDepth * (input.numberOfSteps - 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.stringerLength = ((): number => { try { const __v = Math.sqrt(results.totalRise^2 + results.totalRun^2); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialVolumePerStep = ((): number => { try { const __v = input.treadDepth * input.stairWidth * input.riserHeight / 1e9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMaterialVolume = ((): number => { try { const __v = results.materialVolumePerStep * input.numberOfSteps * (1 + input.wasteFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.totalMaterialVolume * input.unitCostMaterial; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = input.laborRate * input.laborHoursPerStep * input.numberOfSteps; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.materialCost + results.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerStep = ((): number => { try { const __v = results.totalCost / input.numberOfSteps; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateStairCalculator(input: StairCalculatorInput): StairCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    materialCost: results.materialCost,
    laborCost: results.laborCost,
    costPerStep: results.costPerStep,
    totalRise: results.totalRise,
    totalRun: results.totalRun,
    stringerLength: results.stringerLength,
  };

  // rule: riserHeight >= 100 && riserHeight <= 220
  // rule: treadDepth >= 200 && treadDepth <= 400
  // rule: numberOfSteps >= 1 && numberOfSteps <= 100
  // rule: stairWidth >= 800 && stairWidth <= 2000
  // rule: unitCostMaterial >= 0
  // rule: laborRate >= 0
  // rule: laborHoursPerStep >= 0.5 && laborHoursPerStep <= 10
  // rule: wasteFactor >= 0 && wasteFactor <= 20
  // rule: dataConfidence >= 50 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Riser height exceeds 190 mm; consider reducing for comfort.
  // threshold skipped (non-JS): Tread depth below 250 mm; may cause safety issues.
  // threshold skipped (non-JS): Waste factor above 10%; review material handling processes.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Building Codes","Detailed Report with Charts"],
  };
}
