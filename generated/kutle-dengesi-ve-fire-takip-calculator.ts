// Auto-generated from kutle-dengesi-ve-fire-takip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KutleDengesiVeFireTakipCalculatorInput {
  girdiMalzemeMiktari: number;
  fireOrani: number;
  geriKazanimOrani: number;
  birimMaliyet: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const KutleDengesiVeFireTakipCalculatorInputSchema = z.object({
  girdiMalzemeMiktari: z.number().min(0).default(1000),
  fireOrani: z.number().min(0).max(100).default(5),
  geriKazanimOrani: z.number().min(0).max(100).default(0),
  birimMaliyet: z.number().min(0).default(10),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface KutleDengesiVeFireTakipCalculatorOutput {
  fireMaliyeti: number;
  breakdown: {
    toplamFireMiktari: number;
    geriKazanilanMiktar: number;
    netFireMiktari: number;
    fireOraniNet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KutleDengesiVeFireTakipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.toplamFireMiktari = ((): number => { try { const __v = input.girdiMalzemeMiktari * (input.fireOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.geriKazanilanMiktar = ((): number => { try { const __v = results.toplamFireMiktari * (input.geriKazanimOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netFireMiktari = ((): number => { try { const __v = results.toplamFireMiktari - results.geriKazanilanMiktar; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fireMaliyeti = ((): number => { try { const __v = results.netFireMiktari * input.birimMaliyet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fireOraniNet = ((): number => { try { const __v = (results.netFireMiktari / input.girdiMalzemeMiktari) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'dusuk' ? results.fireMaliyeti * 1.2 : (input.dataConfidence == 'orta' ? results.fireMaliyeti * 1.1 : results.fireMaliyeti); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKutleDengesiVeFireTakipCalculator(input: KutleDengesiVeFireTakipCalculatorInput): KutleDengesiVeFireTakipCalculatorOutput {
  const results = evaluateFormulas(input);
  const fireMaliyeti = results.fireMaliyeti ?? 0;
  const breakdown = {
    toplamFireMiktari: results.toplamFireMiktari,
    geriKazanilanMiktar: results.geriKazanilanMiktar,
    netFireMiktari: results.netFireMiktari,
    fireOraniNet: results.fireOraniNet,
  };

  // rule: girdiMalzemeMiktari > 0
  // rule: fireOrani >= 0 ve fireOrani <= 100
  // rule: geriKazanimOrani >= 0 ve geriKazanimOrani <= 100
  // rule: birimMaliyet >= 0
  // rule: fireOrani + geriKazanimOrani <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek fire orani, surec iyilestirme gerekiyor.
  // threshold skipped (non-JS): Geri kazanim potansiyeli degerlendirilmeli.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return fireMaliyeti; } })();

  return {
    fireMaliyeti,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (benchmark)","Detayli rapor"],
  };
}
