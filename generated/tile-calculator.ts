// Auto-generated from tile-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TileCalculatorInput {
  length: number;
  width: number;
  tileLength: number;
  tileWidth: number;
  groutWidth: number;
  wasteFactor: number;
  tileCostPerUnit: number;
  laborCostPerHour: number;
  installationTimePerSqm: number;
  dataConfidence: number;
}

export const TileCalculatorInputSchema = z.object({
  length: z.number().min(0.1).max(100).default(5),
  width: z.number().min(0.1).max(100).default(4),
  tileLength: z.number().min(1).max(200).default(30),
  tileWidth: z.number().min(1).max(200).default(30),
  groutWidth: z.number().min(0).max(20).default(3),
  wasteFactor: z.number().min(0).max(50).default(10),
  tileCostPerUnit: z.number().min(0).max(1000).default(20),
  laborCostPerHour: z.number().min(0).max(200).default(30),
  installationTimePerSqm: z.number().min(0.1).max(5).default(0.5),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface TileCalculatorOutput {
  totalCost: number;
  breakdown: {
    area: number;
    tilesNeeded: number;
    totalTileCost: number;
    totalLaborCost: number;
    costPerSqm: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TileCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.area = ((): number => { try { const __v = input.length * input.width; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tileArea = ((): number => { try { const __v = (input.tileLength / 100) * (input.tileWidth / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tilesPerSqm = ((): number => { try { const __v = 1 / results.tileArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tilesNeeded = ((): number => { try { const __v = results.area * results.tilesPerSqm * (1 + input.wasteFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalTileCost = ((): number => { try { const __v = results.tilesNeeded * input.tileCostPerUnit * results.tileArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = results.area * input.installationTimePerSqm * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalTileCost + results.totalLaborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerSqm = ((): number => { try { const __v = results.totalCost / results.area; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTileCalculator(input: TileCalculatorInput): TileCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    area: results.area,
    tilesNeeded: results.tilesNeeded,
    totalTileCost: results.totalTileCost,
    totalLaborCost: results.totalLaborCost,
    costPerSqm: results.costPerSqm,
  };

  // rule: length > 0
  // rule: width > 0
  // rule: tileLength > 0
  // rule: tileWidth > 0
  // rule: groutWidth >= 0
  // rule: wasteFactor >= 0
  // rule: tileCostPerUnit >= 0
  // rule: laborCostPerHour >= 0
  // rule: installationTimePerSqm > 0
  // rule: dataConfidence between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor may indicate poor planning or low quality tiles.
  // threshold skipped (non-JS): Installation time exceeds typical benchmark; consider process improvement.
  // threshold skipped (non-JS): Tile cost is high; verify with market rates.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalCost; } })();

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
