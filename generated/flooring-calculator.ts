// Auto-generated from flooring-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FlooringCalculatorInput {
  roomLength: number;
  roomWidth: number;
  flooringUnitCost: number;
  wasteFactor: number;
  laborCostPerHour: number;
  installationTimePerSqm: number;
  additionalCosts: number;
  dataConfidence: number;
}

export const FlooringCalculatorInputSchema = z.object({
  roomLength: z.number().min(0.1).max(100).default(5),
  roomWidth: z.number().min(0.1).max(100).default(4),
  flooringUnitCost: z.number().min(0).max(1000).default(50),
  wasteFactor: z.number().min(0).max(50).default(10),
  laborCostPerHour: z.number().min(0).max(200).default(30),
  installationTimePerSqm: z.number().min(0.1).max(5).default(0.5),
  additionalCosts: z.number().min(0).max(10000).default(0),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface FlooringCalculatorOutput {
  totalCost: number;
  breakdown: {
    roomArea: number;
    materialNeeded: number;
    materialCost: number;
    laborHours: number;
    laborCost: number;
    additionalCosts: number;
    costPerSqm: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FlooringCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.roomArea = ((): number => { try { const __v = input.roomLength * input.roomWidth; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialNeeded = ((): number => { try { const __v = results.roomArea * (1 + input.wasteFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.materialNeeded * input.flooringUnitCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborHours = ((): number => { try { const __v = results.roomArea * input.installationTimePerSqm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.laborHours * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.materialCost + results.laborCost + input.additionalCosts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerSqm = ((): number => { try { const __v = results.totalCost / results.roomArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFlooringCalculator(input: FlooringCalculatorInput): FlooringCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    roomArea: results.roomArea,
    materialNeeded: results.materialNeeded,
    materialCost: results.materialCost,
    laborHours: results.laborHours,
    laborCost: results.laborCost,
    additionalCosts: results.additionalCosts,
    costPerSqm: results.costPerSqm,
  };

  // rule: roomLength > 0
  // rule: roomWidth > 0
  // rule: flooringUnitCost >= 0
  // rule: wasteFactor >= 0 && wasteFactor <= 50
  // rule: laborCostPerHour >= 0
  // rule: installationTimePerSqm >= 0.1
  // rule: additionalCosts >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor may indicate poor planning or irregular room shape.
  // threshold skipped (non-JS): Labor cost exceeds typical range; verify market rates.
  // threshold skipped (non-JS): Installation time is high; consider efficiency improvements.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Cost Comparison","Detailed Report"],
  };
}
