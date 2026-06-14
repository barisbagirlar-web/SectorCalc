// Auto-generated from ogrenme-egrisi-ve-parti-sure-tahmin-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface OgrenmeEgrisiVePartiSureTahminCalculatorInput {
  initialTime: number;
  learningRate: number;
  batchSize: number;
  setupTime: number;
  numOperators: number;
  hourlyCost: number;
  overheadRate: number;
}

export const OgrenmeEgrisiVePartiSureTahminCalculatorInputSchema = z.object({
  initialTime: z.number().min(1).max(10000).default(60),
  learningRate: z.number().min(50).max(100).default(80),
  batchSize: z.number().min(1).max(1000000).default(100),
  setupTime: z.number().min(0).max(1000).default(30),
  numOperators: z.number().min(1).max(100).default(1),
  hourlyCost: z.number().min(0).max(10000).default(50),
  overheadRate: z.number().min(0).max(500).default(150),
});

export interface OgrenmeEgrisiVePartiSureTahminCalculatorOutput {
  totalTime: number;
  breakdown: {
    totalTime: number;
    averageTimePerUnit: number;
    totalLaborCost: number;
    totalOverheadCost: number;
    totalCost: number;
    costPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: OgrenmeEgrisiVePartiSureTahminCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalTime = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.averageTimePerUnit = ((): number => { try { const __v = results.totalTime / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = (results.totalTime / 60) * input.numOperators * input.hourlyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalOverheadCost = ((): number => { try { const __v = results.totalLaborCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalLaborCost + results.totalOverheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnit = ((): number => { try { const __v = results.totalCost / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateOgrenmeEgrisiVePartiSureTahminCalculator(input: OgrenmeEgrisiVePartiSureTahminCalculatorInput): OgrenmeEgrisiVePartiSureTahminCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalTime = results.totalTime ?? 0;
  const breakdown = {
    totalTime: results.totalTime,
    averageTimePerUnit: results.averageTimePerUnit,
    totalLaborCost: results.totalLaborCost,
    totalOverheadCost: results.totalOverheadCost,
    totalCost: results.totalCost,
    costPerUnit: results.costPerUnit,
  };

  // rule: learningRate must be between 50 and 100
  // rule: batchSize must be >= 1
  // rule: setupTime must be >= 0
  // rule: numOperators must be >= 1
  // rule: hourlyCost must be >= 0 if numOperators > 0
  // rule: overheadRate must be >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.learningRate < 70) hiddenLossDrivers.push("Dusuk ogrenme orani, iyilestirme firsati");
  if (input.setupTime > 60) hiddenLossDrivers.push("Hazirlik suresi yuksek, SMED uygulanabilir");
  if (input.batchSize < 10) hiddenLossDrivers.push("Cok kucuk parti, verimsizlik riski");

  const dataConfidenceAdjusted = (() => { try { return totalTime; } catch { return totalTime; } })();

  return {
    totalTime,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (ogrenme egrisi grafigi)","Karsilastirma (farkli senaryolar)","Detayli rapor (maliyet kirilimi)"],
  };
}
