// Auto-generated from tool-life-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ToolLifeCalculatorInput {
  cuttingSpeed: number;
  feedRate: number;
  depthOfCut: number;
  toolMaterial: 'high-speed-steel' | 'carbide' | 'ceramic' | 'cbn' | 'diamond';
  workpieceMaterial: 'steel' | 'stainless-steel' | 'aluminum' | 'titanium' | 'cast-iron';
  coolantUsed: boolean;
  toolCost: number;
  laborCostPerHour: number;
  machineCostPerHour: number;
  toolChangeTime: number;
  desiredReliability: number;
}

export const ToolLifeCalculatorInputSchema = z.object({
  cuttingSpeed: z.number().min(10).max(500).default(100),
  feedRate: z.number().min(0.05).max(1).default(0.2),
  depthOfCut: z.number().min(0.5).max(10).default(2),
  toolMaterial: z.enum(['high-speed-steel', 'carbide', 'ceramic', 'cbn', 'diamond']).default('carbide'),
  workpieceMaterial: z.enum(['steel', 'stainless-steel', 'aluminum', 'titanium', 'cast-iron']).default('steel'),
  coolantUsed: z.boolean().default(true),
  toolCost: z.number().min(1).max(1000).default(50),
  laborCostPerHour: z.number().min(0).max(200).default(30),
  machineCostPerHour: z.number().min(0).max(500).default(50),
  toolChangeTime: z.number().min(0.5).max(30).default(5),
  desiredReliability: z.number().min(50).max(99).default(90),
});

export interface ToolLifeCalculatorOutput {
  toolLifeMinutes: number;
  breakdown: {
    toolLifeParts: number;
    totalToolLifeParts: number;
    costPerPart: number;
    cuttingTimePerPart: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ToolLifeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.toolMaterialFactor = ((): number => { try { const __v = input.toolMaterial == 'high-speed-steel' ? 0.5 : input.toolMaterial == 'carbide' ? 1.0 : input.toolMaterial == 'ceramic' ? 2.0 : input.toolMaterial == 'cbn' ? 3.0 : input.toolMaterial == 'diamond' ? 4.0 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.workpieceMaterialFactor = ((): number => { try { const __v = input.workpieceMaterial == 'steel' ? 1.0 : input.workpieceMaterial == 'stainless-steel' ? 0.6 : input.workpieceMaterial == 'aluminum' ? 2.0 : input.workpieceMaterial == 'titanium' ? 0.4 : input.workpieceMaterial == 'cast-iron' ? 1.2 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coolantFactor = ((): number => { try { const __v = input.coolantUsed ? 1.2 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lengthOfCut = ((): number => { try { const __v = 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.numberOfRegrinds = ((): number => { try { const __v = 3; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toolLifeMinutes = ((): number => { try { const __v = input.cuttingSpeed ** (-1.5) * input.feedRate ** (-0.5) * input.depthOfCut ** (-0.3) * (results.toolMaterialFactor) * (results.workpieceMaterialFactor) * (results.coolantFactor) * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cuttingTimePerPart = ((): number => { try { const __v = results.lengthOfCut / (input.feedRate * input.cuttingSpeed * 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.toolLifeMinutes * (input.desiredReliability / 100) * 0.9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toolLifeParts = ((): number => { try { const __v = results.toolLifeMinutes / (results.cuttingTimePerPart); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalToolLifeParts = ((): number => { try { const __v = results.toolLifeParts * (results.numberOfRegrinds + 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerPart = ((): number => { try { const __v = (input.toolCost / results.totalToolLifeParts) + (input.laborCostPerHour + input.machineCostPerHour) * (results.cuttingTimePerPart / 60) + (input.toolChangeTime / 60) * (input.laborCostPerHour + input.machineCostPerHour) / results.toolLifeParts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateToolLifeCalculator(input: ToolLifeCalculatorInput): ToolLifeCalculatorOutput {
  const results = evaluateFormulas(input);
  const toolLifeMinutes = results.toolLifeMinutes ?? 0;
  const breakdown = {
    toolLifeParts: results.toolLifeParts,
    totalToolLifeParts: results.totalToolLifeParts,
    costPerPart: results.costPerPart,
    cuttingTimePerPart: results.cuttingTimePerPart,
  };

  // rule: cuttingSpeed must be between 10 and 500 m/min
  // rule: feedRate must be between 0.05 and 1.0 mm/rev
  // rule: depthOfCut must be between 0.5 and 10.0 mm
  // rule: toolCost must be positive
  // rule: laborCostPerHour must be non-negative
  // rule: machineCostPerHour must be non-negative
  // rule: toolChangeTime must be positive
  // rule: desiredReliability must be between 50 and 99
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if toolLifeMinutes < 10 then 'CRITICAL: Tool life too short, adjust parameters'
  // threshold skipped (non-JS): if costPerPart > 5 then 'WARNING: High cost per part, consider optimization'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return toolLifeMinutes; } })();

  return {
    toolLifeMinutes,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with historical data","Detailed report with charts"],
  };
}
