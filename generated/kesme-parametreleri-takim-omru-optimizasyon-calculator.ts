// Auto-generated from kesme-parametreleri-takim-omru-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KesmeParametreleriTakimOmruOptimizasyonCalculatorInput {
  cuttingSpeed: number;
  feedRate: number;
  depthOfCut: number;
  toolMaterial: 'HSS' | 'Karbur' | 'Seramik' | 'CBN' | 'Elmas';
  workpieceMaterial: 'Celik' | 'Paslanmaz Celik' | 'Dokme Demir' | 'Aluminyum' | 'Titanyum';
  toolCost: number;
  machineHourlyCost: number;
  desiredToolLife: number;
  dataConfidence: number;
}

export const KesmeParametreleriTakimOmruOptimizasyonCalculatorInputSchema = z.object({
  cuttingSpeed: z.number().min(10).max(500).default(150),
  feedRate: z.number().min(0.01).max(1).default(0.2),
  depthOfCut: z.number().min(0.1).max(10).default(2),
  toolMaterial: z.enum(['HSS', 'Karbur', 'Seramik', 'CBN', 'Elmas']).default('Karbur'),
  workpieceMaterial: z.enum(['Celik', 'Paslanmaz Celik', 'Dokme Demir', 'Aluminyum', 'Titanyum']).default('Celik'),
  toolCost: z.number().min(1).max(1000).default(50),
  machineHourlyCost: z.number().min(10).max(500).default(100),
  desiredToolLife: z.number().min(1).max(480).default(30),
  dataConfidence: z.number().min(0.5).max(1).default(0.9),
});

export interface KesmeParametreleriTakimOmruOptimizasyonCalculatorOutput {
  totalCostPerPart: number;
  breakdown: {
    optimalCuttingSpeed: number;
    optimalFeedRate: number;
    optimalDepthOfCut: number;
    toolLifeActual: number;
    materialRemovalRate: number;
    costPerPart: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KesmeParametreleriTakimOmruOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.toolLife = ((): number => { try { const __v = input.desiredToolLife; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.taylorExponent = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialFactor = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimalCuttingSpeed = ((): number => { try { const __v = input.cuttingSpeed * (input.desiredToolLife / 30) ** (-results.taylorExponent) * results.materialFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimalFeedRate = ((): number => { try { const __v = input.feedRate * (input.desiredToolLife / 30) ** (-0.15); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimalDepthOfCut = ((): number => { try { const __v = input.depthOfCut * (input.desiredToolLife / 30) ** (-0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialRemovalRate = ((): number => { try { const __v = results.optimalCuttingSpeed * results.optimalFeedRate * results.optimalDepthOfCut * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toolLifeActual = ((): number => { try { const __v = 30 * (input.cuttingSpeed / results.optimalCuttingSpeed) ** (1/results.taylorExponent) * (input.feedRate / results.optimalFeedRate) ** (1/0.15) * (input.depthOfCut / results.optimalDepthOfCut) ** (1/0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerPart = ((): number => { try { const __v = (input.toolCost / results.toolLifeActual) + (input.machineHourlyCost / 60) * (1 / results.materialRemovalRate) * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPart = ((): number => { try { const __v = results.costPerPart; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCostPerPart * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(input: KesmeParametreleriTakimOmruOptimizasyonCalculatorInput): KesmeParametreleriTakimOmruOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCostPerPart = results.totalCostPerPart ?? 0;
  const breakdown = {
    optimalCuttingSpeed: results.optimalCuttingSpeed,
    optimalFeedRate: results.optimalFeedRate,
    optimalDepthOfCut: results.optimalDepthOfCut,
    toolLifeActual: results.toolLifeActual,
    materialRemovalRate: results.materialRemovalRate,
    costPerPart: results.costPerPart,
  };

  // rule: cuttingSpeed must be between 10 and 500 m/min
  // rule: feedRate must be between 0.01 and 1.0 mm/dev
  // rule: depthOfCut must be between 0.1 and 10 mm
  // rule: toolCost must be positive
  // rule: machineHourlyCost must be positive
  // rule: desiredToolLife must be between 1 and 480 minutes
  // rule: dataConfidence must be between 0.5 and 1.0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if toolLife < 10 then 'Kritik: Takim omru cok dusuk, parametreleri optimize edin'
  // threshold skipped (non-JS): if costPerPart > 5 then 'Uyari: Birim parca maliyeti yuksek'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCostPerPart; } })();

  return {
    totalCostPerPart,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
