// Auto-generated from laser-cutting-time-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LaserCuttingTimeCheckInput {
  materialType: 'steel' | 'aluminum' | 'stainless steel' | 'copper' | 'brass' | 'acrylic' | 'wood' | 'other';
  materialThickness: number;
  cuttingLength: number;
  cuttingSpeed: number;
  piercingTimePerPierce: number;
  numberOfPierces: number;
  rapidTraverseDistance: number;
  rapidTraverseSpeed: number;
  setupTime: number;
  batchSize: number;
  laborCostPerHour: number;
  machineCostPerHour: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const LaserCuttingTimeCheckInputSchema = z.object({
  materialType: z.enum(['steel', 'aluminum', 'stainless steel', 'copper', 'brass', 'acrylic', 'wood', 'other']).default('steel'),
  materialThickness: z.number().min(0.5).max(25).default(2),
  cuttingLength: z.number().min(0.1).max(1000).default(10),
  cuttingSpeed: z.number().min(0.1).max(20).default(2),
  piercingTimePerPierce: z.number().min(0.1).max(10).default(1),
  numberOfPierces: z.number().min(1).max(1000).default(5),
  rapidTraverseDistance: z.number().min(0).max(100).default(5),
  rapidTraverseSpeed: z.number().min(10).max(120).default(60),
  setupTime: z.number().min(0).max(120).default(10),
  batchSize: z.number().min(1).max(10000).default(1),
  laborCostPerHour: z.number().min(0).max(200).default(30),
  machineCostPerHour: z.number().min(0).max(500).default(50),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface LaserCuttingTimeCheckOutput {
  totalTime: number;
  breakdown: {
    cuttingTime: number;
    piercingTime: number;
    rapidTraverseTime: number;
    cycleTimePerPart: number;
    totalCycleTime: number;
    setupTime: number;
    laborCost: number;
    machineCost: number;
    totalCost: number;
    costPerPart: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LaserCuttingTimeCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.cuttingTime = ((): number => { try { const __v = input.cuttingLength / input.cuttingSpeed * 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.piercingTime = ((): number => { try { const __v = input.numberOfPierces * input.piercingTimePerPierce; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.rapidTraverseTime = ((): number => { try { const __v = input.rapidTraverseDistance / input.rapidTraverseSpeed * 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cycleTimePerPart = ((): number => { try { const __v = results.cuttingTime + results.piercingTime + results.rapidTraverseTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCycleTime = ((): number => { try { const __v = results.cycleTimePerPart * input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalTime = ((): number => { try { const __v = results.totalCycleTime + input.setupTime * 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.totalTime / 60 * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.machineCost = ((): number => { try { const __v = results.totalTime / 60 * input.machineCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.laborCost + results.machineCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerPart = ((): number => { try { const __v = results.totalCost / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (1 + (input.dataConfidence == 'low' ? 0.2 : input.dataConfidence == 'medium' ? 0.1 : 0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLaserCuttingTimeCheck(input: LaserCuttingTimeCheckInput): LaserCuttingTimeCheckOutput {
  const results = evaluateFormulas(input);
  const totalTime = results.totalTime ?? 0;
  const breakdown = {
    cuttingTime: results.cuttingTime,
    piercingTime: results.piercingTime,
    rapidTraverseTime: results.rapidTraverseTime,
    cycleTimePerPart: results.cycleTimePerPart,
    totalCycleTime: results.totalCycleTime,
    setupTime: results.setupTime,
    laborCost: results.laborCost,
    machineCost: results.machineCost,
    totalCost: results.totalCost,
    costPerPart: results.costPerPart,
  };

  // rule: materialThickness > 0
  // rule: cuttingLength > 0
  // rule: cuttingSpeed > 0
  // rule: piercingTimePerPierce > 0
  // rule: numberOfPierces > 0
  // rule: rapidTraverseDistance >= 0
  // rule: rapidTraverseSpeed > 0
  // rule: setupTime >= 0
  // rule: batchSize >= 1
  // rule: laborCostPerHour >= 0
  // rule: machineCostPerHour >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If cuttingSpeed < 0.5, warning: 'Very slow cutting speed, check material/thickness compatibility.'
  // threshold skipped (non-JS): If piercingTimePerPierce > 5, warning: 'High piercing time, consider pre-drilling or different gas.'
  // threshold skipped (non-JS): If setupTime > 30, warning: 'Long setup time, consider SMED techniques.'
  // threshold skipped (non-JS): If batchSize < 10, warning: 'Small batch, setup time dominates.'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted ($); } catch { return totalTime; } })();

  return {
    totalTime,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Data","Detailed Report with Charts"],
  };
}
