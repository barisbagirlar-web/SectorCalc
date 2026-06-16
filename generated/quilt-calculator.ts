// Auto-generated from quilt-calculator-schema.json
import * as z from 'zod';

export interface Quilt_calculatorInput {
  quiltWidth: number;
  quiltLength: number;
  blockWidth: number;
  blockLength: number;
  seamAllowance: number;
  fabricWidth: number;
}

export const Quilt_calculatorInputSchema = z.object({
  quiltWidth: z.number().default(200),
  quiltLength: z.number().default(200),
  blockWidth: z.number().default(20),
  blockLength: z.number().default(20),
  seamAllowance: z.number().default(0.6),
  fabricWidth: z.number().default(110),
});

function evaluateAllFormulas(input: Quilt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.blockWidth + 2 * input.seamAllowance; results["blockCutWidth"] = Number.isFinite(v) ? v : 0; } catch { results["blockCutWidth"] = 0; }
  try { const v = input.blockLength + 2 * input.seamAllowance; results["blockCutLength"] = Number.isFinite(v) ? v : 0; } catch { results["blockCutLength"] = 0; }
  try { const v = Math.ceil(input.quiltWidth / input.blockWidth); results["horizontalBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["horizontalBlocks"] = 0; }
  try { const v = Math.ceil(input.quiltLength / input.blockLength); results["verticalBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["verticalBlocks"] = 0; }
  try { const v = (results["horizontalBlocks"] ?? 0) * (results["verticalBlocks"] ?? 0); results["totalBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["totalBlocks"] = 0; }
  try { const v = Math.floor(input.fabricWidth / (results["blockCutWidth"] ?? 0)); results["blocksPerWidth"] = Number.isFinite(v) ? v : 0; } catch { results["blocksPerWidth"] = 0; }
  try { const v = Math.ceil((results["totalBlocks"] ?? 0) / Math.max(1, (results["blocksPerWidth"] ?? 0))); results["rowsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["rowsNeeded"] = 0; }
  try { const v = (results["rowsNeeded"] ?? 0) * (results["blockCutLength"] ?? 0); results["totalFabricLengthCm"] = Number.isFinite(v) ? v : 0; } catch { results["totalFabricLengthCm"] = 0; }
  try { const v = (results["totalFabricLengthCm"] ?? 0) / 100; results["totalFabricLengthM"] = Number.isFinite(v) ? v : 0; } catch { results["totalFabricLengthM"] = 0; }
  try { const v = ((results["totalBlocks"] ?? 0) * (results["blockCutWidth"] ?? 0) * (results["blockCutLength"] ?? 0)) / 10000; results["totalFabricAreaSqM"] = Number.isFinite(v) ? v : 0; } catch { results["totalFabricAreaSqM"] = 0; }
  return results;
}


export function calculateQuilt_calculator(input: Quilt_calculatorInput): Quilt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFabricLengthM"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Quilt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
