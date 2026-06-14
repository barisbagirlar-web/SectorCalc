// Auto-generated from brick-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BrickCalculatorInput {
  wallLength: number;
  wallHeight: number;
  brickLength: number;
  brickHeight: number;
  brickDepth: number;
  mortarThickness: number;
  wasteFactor: number;
  bondType: 'stretcher' | 'header' | 'english' | 'flemish';
}

export const BrickCalculatorInputSchema = z.object({
  wallLength: z.number().min(0.1).max(100).default(10),
  wallHeight: z.number().min(0.1).max(20).default(3),
  brickLength: z.number().min(100).max(300).default(215),
  brickHeight: z.number().min(40).max(100).default(65),
  brickDepth: z.number().min(50).max(200).default(102.5),
  mortarThickness: z.number().min(5).max(20).default(10),
  wasteFactor: z.number().min(0).max(20).default(5),
  bondType: z.enum(['stretcher', 'header', 'english', 'flemish']).default('stretcher'),
});

export interface BrickCalculatorOutput {
  totalBricks: number;
  breakdown: {
    wallArea: number;
    bricksPerSquareMeter: number;
    bricksBeforeWaste: number;
    totalMortarVolume: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BrickCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.bricksPerSquareMeter = ((): number => { try { const __v = 1 / ((input.brickLength + input.mortarThickness) / 1000 * (input.brickHeight + input.mortarThickness) / 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wallArea = ((): number => { try { const __v = input.wallLength * input.wallHeight; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bricksBeforeWaste = ((): number => { try { const __v = results.wallArea * results.bricksPerSquareMeter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalBricks = ((): number => { try { const __v = results.bricksBeforeWaste * (1 + input.wasteFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.mortarVolumePerBrick = ((): number => { try { const __v = (input.brickLength + input.brickHeight) * input.brickDepth * input.mortarThickness / 1e9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMortarVolume = ((): number => { try { const __v = results.totalBricks * results.mortarVolumePerBrick; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateBrickCalculator(input: BrickCalculatorInput): BrickCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalBricks = results.totalBricks ?? 0;
  const breakdown = {
    wallArea: results.wallArea,
    bricksPerSquareMeter: results.bricksPerSquareMeter,
    bricksBeforeWaste: results.bricksBeforeWaste,
    totalMortarVolume: results.totalMortarVolume,
  };

  // rule: wallLength > 0
  // rule: wallHeight > 0
  // rule: brickLength > 0
  // rule: brickHeight > 0
  // rule: brickDepth > 0
  // rule: mortarThickness >= 5
  // rule: mortarThickness <= 20
  // rule: wasteFactor >= 0
  // rule: wasteFactor <= 20
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor may indicate poor quality control or handling.
  // threshold skipped (non-JS): Thick mortar joints may reduce structural integrity.

  const dataConfidenceAdjusted = (() => { try { return results.totalBricks; } catch { return totalBricks; } })();

  return {
    totalBricks,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical projects","Detailed report with cost estimation"],
  };
}
