// Auto-generated from enjeksiyon-dokum-cekme-payi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnjeksiyonDokumCekmePayiHesabiInput {
  materialType: 'PP' | 'PE' | 'ABS' | 'PA' | 'PC' | 'POM';
  partLength: number;
  partWidth: number;
  partThickness: number;
  moldTemperature: number;
  meltTemperature: number;
  shrinkageFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const EnjeksiyonDokumCekmePayiHesabiInputSchema = z.object({
  materialType: z.enum(['PP', 'PE', 'ABS', 'PA', 'PC', 'POM']).default('PP'),
  partLength: z.number().min(1).max(10000).default(100),
  partWidth: z.number().min(1).max(10000).default(50),
  partThickness: z.number().min(0.5).max(50).default(3),
  moldTemperature: z.number().min(10).max(120).default(40),
  meltTemperature: z.number().min(150).max(350).default(220),
  shrinkageFactor: z.number().min(0.1).max(10).default(1.5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface EnjeksiyonDokumCekmePayiHesabiOutput {
  finalShrinkage: number;
  breakdown: {
    shrinkageLength: number;
    shrinkageWidth: number;
    shrinkageThickness: number;
    totalShrinkage: number;
    adjustedShrinkage: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnjeksiyonDokumCekmePayiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.shrinkageLength = (() => { try { return input.partLength * (input.shrinkageFactor / 100); } catch { return 0; } })();
  results.shrinkageWidth = (() => { try { return input.partWidth * (input.shrinkageFactor / 100); } catch { return 0; } })();
  results.shrinkageThickness = (() => { try { return input.partThickness * (input.shrinkageFactor / 100) * 1.2; } catch { return 0; } })();
  results.totalShrinkage = (() => { try { return (results.shrinkageLength + results.shrinkageWidth + results.shrinkageThickness) / 3; } catch { return 0; } })();
  results.adjustedShrinkage = (() => { try { return results.totalShrinkage * (1 + (input.moldTemperature - 40) * 0.002) * (1 + (input.meltTemperature - 220) * 0.001); } catch { return 0; } })();
  results.dataConfidenceMultiplier = (() => { try { return input.dataConfidence == 'low' ? 1.5 : (input.dataConfidence == 'medium' ? 1.0 : 0.8); } catch { return 0; } })();
  results.finalShrinkage = (() => { try { return results.adjustedShrinkage * results.dataConfidenceMultiplier; } catch { return 0; } })();
  return results;
}

export function calculateEnjeksiyonDokumCekmePayiHesabi(input: EnjeksiyonDokumCekmePayiHesabiInput): EnjeksiyonDokumCekmePayiHesabiOutput {
  const results = evaluateFormulas(input);
  const finalShrinkage = results.finalShrinkage ?? 0;
  const breakdown = {
    shrinkageLength: results.shrinkageLength,
    shrinkageWidth: results.shrinkageWidth,
    shrinkageThickness: results.shrinkageThickness,
    totalShrinkage: results.totalShrinkage,
    adjustedShrinkage: results.adjustedShrinkage,
  };

  // rule: partLength > 0
  // rule: partWidth > 0
  // rule: partThickness > 0
  // rule: moldTemperature < meltTemperature
  // rule: shrinkageFactor > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek cekme orani, parca toleranslarini asabilir.
  // threshold skipped (non-JS): Kalin kesit, carpilma riskini artirir.
  // threshold skipped (non-JS): Dusuk kalip sicakligi, yetersiz dolum ve yuksek cekmeye neden olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.finalShrinkage; } catch { return finalShrinkage; } })();

  return {
    finalShrinkage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma modulu","Detayli tolerans raporu"],
  };
}
