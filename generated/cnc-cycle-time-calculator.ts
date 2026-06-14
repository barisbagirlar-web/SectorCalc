// Auto-generated from cnc-cycle-time-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CncCycleTimeCalculatorInput {
  cuttingLength: number;
  feedRate: number;
  spindleSpeed: number;
  numberOfPasses: number;
  rapidTraverseRate: number;
  rapidDistance: number;
  toolChangeTime: number;
  numberOfToolChanges: number;
  loadingUnloadingTime: number;
  idleTime: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CncCycleTimeCalculatorInputSchema = z.object({
  cuttingLength: z.number().min(0).default(100),
  feedRate: z.number().min(0).default(200),
  spindleSpeed: z.number().min(0).default(3000),
  numberOfPasses: z.number().min(1).default(1),
  rapidTraverseRate: z.number().min(0).default(10000),
  rapidDistance: z.number().min(0).default(50),
  toolChangeTime: z.number().min(0).default(5),
  numberOfToolChanges: z.number().min(0).default(0),
  loadingUnloadingTime: z.number().min(0).default(30),
  idleTime: z.number().min(0).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CncCycleTimeCalculatorOutput {
  totalCycleTime: number;
  breakdown: {
    cuttingTime: number;
    rapidTime: number;
    toolChangeTotalTime: number;
    loadingUnloadingTime: number;
    idleTime: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CncCycleTimeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.cuttingTime = (() => { try { return input.cuttingLength / input.feedRate * input.numberOfPasses; } catch { return 0; } })();
  results.rapidTime = (() => { try { return input.rapidDistance / input.rapidTraverseRate * 60; } catch { return 0; } })();
  results.toolChangeTotalTime = (() => { try { return input.toolChangeTime * input.numberOfToolChanges; } catch { return 0; } })();
  results.totalCycleTime = (() => { try { return results.cuttingTime + results.rapidTime + results.toolChangeTotalTime + input.loadingUnloadingTime + input.idleTime; } catch { return 0; } })();
  results.cycleTimePerPart = (() => { try { return results.totalCycleTime; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.totalCycleTime * (1 + (input.dataConfidence === 'low' ? 0.2 : input.dataConfidence === 'medium' ? 0.1 : 0)); } catch { return 0; } })();
  return results;
}

export function calculateCncCycleTimeCalculator(input: CncCycleTimeCalculatorInput): CncCycleTimeCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCycleTime = results.totalCycleTime ?? 0;
  const breakdown = {
    cuttingTime: results.cuttingTime,
    rapidTime: results.rapidTime,
    toolChangeTotalTime: results.toolChangeTotalTime,
    loadingUnloadingTime: results.loadingUnloadingTime,
    idleTime: results.idleTime,
  };

  // rule: cuttingLength > 0
  // rule: feedRate > 0
  // rule: spindleSpeed > 0
  // rule: numberOfPasses >= 1
  // rule: rapidTraverseRate >= 0
  // rule: rapidDistance >= 0
  // rule: toolChangeTime >= 0
  // rule: numberOfToolChanges >= 0
  // rule: loadingUnloadingTime >= 0
  // rule: idleTime >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (cuttingTime > 600) hiddenLossDrivers.push("cuttingTimeExcessive");
  if (rapidTime > 30) hiddenLossDrivers.push("rapidTimeExcessive");
  if (input.idleTime > 60) hiddenLossDrivers.push("idleTimeExcessive");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCycleTime; } })();

  return {
    totalCycleTime,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Data","Detailed Report with Charts"],
  };
}
