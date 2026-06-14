// Auto-generated from drywall-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DrywallCalculatorInput {
  wallLength: number;
  wallHeight: number;
  sheetWidth: number;
  sheetLength: number;
  wasteFactor: number;
  laborRate: number;
  materialCostPerSheet: number;
  laborProductivity: number;
  numWorkers: number;
}

export const DrywallCalculatorInputSchema = z.object({
  wallLength: z.number().min(1).max(1000).default(10),
  wallHeight: z.number().min(1).max(50).default(8),
  sheetWidth: z.number().min(2).max(6).default(4),
  sheetLength: z.number().min(4).max(16).default(8),
  wasteFactor: z.number().min(0).max(50).default(10),
  laborRate: z.number().min(10).max(200).default(50),
  materialCostPerSheet: z.number().min(5).max(100).default(15),
  laborProductivity: z.number().min(0.5).max(10).default(2),
  numWorkers: z.number().min(1).max(10).default(2),
});

export interface DrywallCalculatorOutput {
  totalCost: number;
  breakdown: {
    totalMaterialCost: number;
    totalLaborCost: number;
    sheetsNeeded: number;
    costPerSqFt: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DrywallCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.wallArea = (() => { try { return input.wallLength * input.wallHeight; } catch { return 0; } })();
  results.sheetArea = (() => { try { return input.sheetWidth * input.sheetLength; } catch { return 0; } })();
  results.sheetsNeeded = (() => { try { return Math.Math.ceil(results.wallArea / results.sheetArea * (1 + input.wasteFactor / 100)); } catch { return 0; } })();
  results.totalMaterialCost = (() => { try { return results.sheetsNeeded * input.materialCostPerSheet; } catch { return 0; } })();
  results.totalLaborHours = (() => { try { return results.sheetsNeeded / input.laborProductivity / input.numWorkers; } catch { return 0; } })();
  results.totalLaborCost = (() => { try { return results.totalLaborHours * input.laborRate; } catch { return 0; } })();
  results.totalCost = (() => { try { return results.totalMaterialCost + results.totalLaborCost; } catch { return 0; } })();
  results.costPerSqFt = (() => { try { return results.totalCost / results.wallArea; } catch { return 0; } })();
  return results;
}

export function calculateDrywallCalculator(input: DrywallCalculatorInput): DrywallCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    totalMaterialCost: results.totalMaterialCost,
    totalLaborCost: results.totalLaborCost,
    sheetsNeeded: results.sheetsNeeded,
    costPerSqFt: results.costPerSqFt,
  };

  // rule: wallLength > 0
  // rule: wallHeight > 0
  // rule: sheetWidth > 0
  // rule: sheetLength > 0
  // rule: wasteFactor >= 0
  // rule: laborRate > 0
  // rule: materialCostPerSheet > 0
  // rule: laborProductivity > 0
  // rule: numWorkers > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.wasteFactor > 15) hiddenLossDrivers.push("High waste: review cutting process");
  if (input.laborProductivity < 1) hiddenLossDrivers.push("Low productivity: consider training or process improvement");

  const dataConfidenceAdjusted = (() => { try { return results.totalCost * (1 - 0.05); } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Charts"],
  };
}
