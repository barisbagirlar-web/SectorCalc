// Auto-generated from cnc-tool-wear-cost-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CncToolWearCostInput {
  toolPrice: number;
  toolLife: number;
  regrinds: number;
  regrindCost: number;
  machineHourlyRate: number;
  cuttingTimePerPart: number;
  toolChangeTime: number;
  partsPerToolChange: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CncToolWearCostInputSchema = z.object({
  toolPrice: z.number().min(0).default(100),
  toolLife: z.number().min(1).default(60),
  regrinds: z.number().min(0).max(10).default(3),
  regrindCost: z.number().min(0).default(20),
  machineHourlyRate: z.number().min(0).default(80),
  cuttingTimePerPart: z.number().min(0).default(2),
  toolChangeTime: z.number().min(0).default(5),
  partsPerToolChange: z.number().min(1).default(30),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CncToolWearCostOutput {
  toolWearCostPerPart: number;
  breakdown: {
    toolCostPerPart: number;
    machineCostPerPart: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CncToolWearCostInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalToolCost = (() => { try { return input.toolPrice + (input.regrinds * input.regrindCost); } catch { return 0; } })();
  results.totalLifeMinutes = (() => { try { return input.toolLife * (input.regrinds + 1); } catch { return 0; } })();
  results.toolCostPerMinute = (() => { try { return results.totalToolCost / results.totalLifeMinutes; } catch { return 0; } })();
  results.toolCostPerPart = (() => { try { return results.toolCostPerMinute * input.cuttingTimePerPart; } catch { return 0; } })();
  results.machineCostPerToolChange = (() => { try { return input.machineHourlyRate * (input.toolChangeTime / 60); } catch { return 0; } })();
  results.machineCostPerPart = (() => { try { return results.machineCostPerToolChange / input.partsPerToolChange; } catch { return 0; } })();
  results.toolWearCostPerPart = (() => { try { return results.toolCostPerPart + results.machineCostPerPart; } catch { return 0; } })();
  results.dataConfidenceFactor = (() => { try { return input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9); } catch { return 0; } })();
  results.adjustedToolWearCostPerPart = (() => { try { return results.toolWearCostPerPart * results.dataConfidenceFactor; } catch { return 0; } })();
  return results;
}

export function calculateCncToolWearCost(input: CncToolWearCostInput): CncToolWearCostOutput {
  const results = evaluateFormulas(input);
  const toolWearCostPerPart = results.toolWearCostPerPart ?? 0;
  const breakdown = {
    toolCostPerPart: results.toolCostPerPart,
    machineCostPerPart: results.machineCostPerPart,
  };

  // rule: toolPrice > 0
  // rule: toolLife > 0
  // rule: regrinds >= 0
  // rule: regrindCost >= 0
  // rule: machineHourlyRate > 0
  // rule: cuttingTimePerPart > 0
  // rule: toolChangeTime >= 0
  // rule: partsPerToolChange > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 5: 'High tool wear cost per part, consider optimizing parameters or tool selection'
  // threshold skipped (non-JS): < 30: 'Short tool life, investigate cutting conditions or tool quality'

  const dataConfidenceAdjusted = (() => { try { return results.adjustedToolWearCostPerPart; } catch { return toolWearCostPerPart; } })();

  return {
    toolWearCostPerPart,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Charts"],
  };
}
