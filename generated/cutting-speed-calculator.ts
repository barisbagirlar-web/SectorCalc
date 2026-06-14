// Auto-generated from cutting-speed-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CuttingSpeedCalculatorInput {
  workpieceMaterial: 'steel' | 'aluminum' | 'cast iron' | 'stainless steel' | 'titanium' | 'brass' | 'copper' | 'plastic';
  toolMaterial: 'HSS' | 'carbide' | 'ceramic' | 'CBN' | 'diamond';
  operationType: 'turning' | 'milling' | 'drilling' | 'grinding';
  cuttingSpeed: number;
  toolDiameter: number;
  spindleSpeed: number;
  feedRate: number;
  depthOfCut: number;
  toolLife: number;
  machinePower: number;
  dataConfidence: number;
}

export const CuttingSpeedCalculatorInputSchema = z.object({
  workpieceMaterial: z.enum(['steel', 'aluminum', 'cast iron', 'stainless steel', 'titanium', 'brass', 'copper', 'plastic']).default('steel'),
  toolMaterial: z.enum(['HSS', 'carbide', 'ceramic', 'CBN', 'diamond']).default('HSS'),
  operationType: z.enum(['turning', 'milling', 'drilling', 'grinding']).default('turning'),
  cuttingSpeed: z.number().min(1).max(10000).default(100),
  toolDiameter: z.number().min(0.1).max(500).default(10),
  spindleSpeed: z.number().min(1).max(100000).default(3000),
  feedRate: z.number().min(0.01).max(10).default(0.2),
  depthOfCut: z.number().min(0.1).max(50).default(2),
  toolLife: z.number().min(1).max(10000).default(60),
  machinePower: z.number().min(0.1).max(1000).default(10),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface CuttingSpeedCalculatorOutput {
  recommendedCuttingSpeed: number;
  breakdown: {
    recommendedSpeedMin: number;
    recommendedSpeedMax: number;
    spindleSpeed: number;
    requiredPower: number;
    materialRemovalRate: number;
    toolLifeCost: number;
    machiningTime: number;
    totalCostPerPart: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CuttingSpeedCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.recommendedSpeedRange = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.spindleSpeedFromCuttingSpeed = ((): number => { try { const __v = input.spindleSpeed = (input.cuttingSpeed * 1000) / (PI * input.toolDiameter); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cuttingSpeedFromSpindleSpeed = ((): number => { try { const __v = input.cuttingSpeed = (input.spindleSpeed * PI * input.toolDiameter) / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.requiredCuttingPower = ((): number => { try { const __v = results.requiredCuttingPower = (input.cuttingSpeed * input.feedRate * input.depthOfCut * specificCuttingForce) / (60 * 1000 * efficiency); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialRemovalRate = ((): number => { try { const __v = MRR = input.cuttingSpeed * input.feedRate * input.depthOfCut * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toolLifeCost = ((): number => { try { const __v = results.toolLifeCost = toolCost / input.toolLife; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.machiningTime = ((): number => { try { const __v = results.machiningTime = (lengthOfCut) / (input.feedRate * input.spindleSpeed); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.dataConfidenceAdjusted = primary * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPart = ((): number => { try { const __v = results.totalCostPerPart = (machineHourlyRate * results.machiningTime) + results.toolLifeCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCuttingSpeedCalculator(input: CuttingSpeedCalculatorInput): CuttingSpeedCalculatorOutput {
  const results = evaluateFormulas(input);
  const recommendedCuttingSpeed = results.recommendedCuttingSpeed ?? 0;
  const breakdown = {
    recommendedSpeedMin: results.recommendedSpeedMin,
    recommendedSpeedMax: results.recommendedSpeedMax,
    spindleSpeed: results.spindleSpeedFromCuttingSpeed,
    requiredPower: results.requiredPower,
    materialRemovalRate: results.materialRemovalRate,
    toolLifeCost: results.toolLifeCost,
    machiningTime: results.machiningTime,
    totalCostPerPart: results.totalCostPerPart,
  };

  // rule: cuttingSpeed must be between recommended min and max for given workpieceMaterial and toolMaterial
  // rule: spindleSpeed must be <= machineMaxSpindleSpeed (if known)
  // rule: feedRate must be within recommended range for operationType
  // rule: depthOfCut must be <= toolMaxDepthOfCut
  // rule: toolLife must be positive
  // rule: machinePower must be >= requiredCuttingPower
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): cuttingSpeed > 1.2 * recommendedMaxSpeed -> 'Cutting speed exceeds recommended maximum by more than 20%. Risk of tool failure.'
  // threshold skipped (non-JS): cuttingSpeed < 0.8 * recommendedMinSpeed -> 'Cutting speed below recommended minimum. Inefficient material removal.'
  // threshold skipped (non-JS): toolLife < 10 -> 'Tool life very short. Consider reducing cutting speed or feed.'
  // threshold skipped (non-JS): requiredCuttingPower > machinePower -> 'Required cutting power exceeds machine capacity. Reduce depth of cut or feed.'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return recommendedCuttingSpeed; } })();

  return {
    recommendedCuttingSpeed,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Graphs"],
  };
}
