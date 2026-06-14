// Auto-generated from 3d-print-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface Tool3dPrintCostCheckInput {
  materialCostPerKg: number;
  materialDensity: number;
  partVolume: number;
  infillPercentage: number;
  printTimeHours: number;
  machineCostPerHour: number;
  laborCostPerHour: number;
  postProcessingTimeHours: number;
  failureRate: number;
  batchSize: number;
  setupCost: number;
  overheadRate: number;
  profitMargin: number;
}

export const Tool3dPrintCostCheckInputSchema = z.object({
  materialCostPerKg: z.number().min(0).max(1000).default(50),
  materialDensity: z.number().min(0.5).max(3).default(1.24),
  partVolume: z.number().min(0.1).max(10000).default(100),
  infillPercentage: z.number().min(0).max(100).default(20),
  printTimeHours: z.number().min(0.1).max(168).default(10),
  machineCostPerHour: z.number().min(0).max(50).default(2),
  laborCostPerHour: z.number().min(0).max(100).default(15),
  postProcessingTimeHours: z.number().min(0).max(50).default(1),
  failureRate: z.number().min(0).max(100).default(5),
  batchSize: z.number().min(1).max(1000).default(1),
  setupCost: z.number().min(0).max(1000).default(0),
  overheadRate: z.number().min(0).max(100).default(20),
  profitMargin: z.number().min(0).max(200).default(30),
});

export interface Tool3dPrintCostCheckOutput {
  sellingPricePerPart: number;
  breakdown: {
    materialCost: number;
    machineCost: number;
    laborCost: number;
    setupCostPerPart: number;
    directCostPerPart: number;
    overheadCost: number;
    totalCostPerPart: number;
    profitAmount: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: Tool3dPrintCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.materialWeight = ((): number => { try { const __v = input.partVolume * (input.infillPercentage / 100) * input.materialDensity / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.materialWeight * input.materialCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.machineCost = ((): number => { try { const __v = input.printTimeHours * input.machineCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = (input.printTimeHours + input.postProcessingTimeHours) * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCostPerPart = ((): number => { try { const __v = (results.materialCost + results.machineCost + results.laborCost + input.setupCost / input.batchSize) * (1 + input.failureRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPart = ((): number => { try { const __v = results.directCostPerPart * (1 + input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sellingPricePerPart = ((): number => { try { const __v = results.totalCostPerPart * (1 + input.profitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTool3dPrintCostCheck(input: Tool3dPrintCostCheckInput): Tool3dPrintCostCheckOutput {
  const results = evaluateFormulas(input);
  const sellingPricePerPart = results.sellingPricePerPart ?? 0;
  const breakdown = {
    materialCost: results.materialCost,
    machineCost: results.machineCost,
    laborCost: results.laborCost,
    setupCostPerPart: results.setupCostPerPart,
    directCostPerPart: results.directCostPerPart,
    overheadCost: results.overheadCost,
    totalCostPerPart: results.totalCostPerPart,
    profitAmount: results.profitAmount,
  };

  // rule: materialCostPerKg >= 0
  // rule: materialDensity > 0
  // rule: partVolume > 0
  // rule: infillPercentage >= 0 && infillPercentage <= 100
  // rule: printTimeHours > 0
  // rule: machineCostPerHour >= 0
  // rule: laborCostPerHour >= 0
  // rule: postProcessingTimeHours >= 0
  // rule: failureRate >= 0 && failureRate <= 100
  // rule: batchSize >= 1
  // rule: setupCost >= 0
  // rule: overheadRate >= 0
  // rule: profitMargin >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.failureRate > 10) hiddenLossDrivers.push("High failure rate, consider tuning printer");
  if (input.infillPercentage > 80) hiddenLossDrivers.push("High infill, consider reducing for cost savings");
  if (input.printTimeHours > 48) hiddenLossDrivers.push("Long print time, risk of failure increases");

  const dataConfidenceAdjusted = (() => { try { return results.sellingPricePerPart * (1 - 0.1 * (input.failureRate / 100)); } catch { return sellingPricePerPart; } })();

  return {
    sellingPricePerPart,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Data","Detailed Report with Graphs"],
  };
}
