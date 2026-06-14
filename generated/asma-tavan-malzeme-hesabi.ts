// Auto-generated from asma-tavan-malzeme-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AsmaTavanMalzemeHesabiInput {
  alan: number;
  profilAraligi: number;
  plakaBoyutu: '60x60' | '60x120' | '120x120';
  malzemeTuru: 'alcipan' | 'metal' | 'ahsap' | 'mineral lif';
  fireOrani: number;
  birimMaliyetPlaka: number;
  birimMaliyetProfil: number;
  iscilikSaatUcreti: number;
  verimlilikFaktoru: number;
}

export const AsmaTavanMalzemeHesabiInputSchema = z.object({
  alan: z.number().min(1).max(10000).default(100),
  profilAraligi: z.number().min(30).max(120).default(60),
  plakaBoyutu: z.enum(['60x60', '60x120', '120x120']).default('60x60'),
  malzemeTuru: z.enum(['alcipan', 'metal', 'ahsap', 'mineral lif']).default('alcipan'),
  fireOrani: z.number().min(0).max(20).default(5),
  birimMaliyetPlaka: z.number().min(10).max(500).default(50),
  birimMaliyetProfil: z.number().min(5).max(100).default(15),
  iscilikSaatUcreti: z.number().min(50).max(300).default(100),
  verimlilikFaktoru: z.number().min(1).max(20).default(5),
});

export interface AsmaTavanMalzemeHesabiOutput {
  toplamMaliyet: number;
  breakdown: {
    plakaMiktari: number;
    profilMiktari: number;
    toplamMalzemeMaliyeti: number;
    iscilikSuresi: number;
    toplamIscilikMaliyeti: number;
    birimMaliyet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AsmaTavanMalzemeHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.plakaMiktari = (() => { try { return input.alan * (1 + input.fireOrani / 100); } catch { return 0; } })();
  results.profilMiktari = (() => { try { return input.alan * (100 / input.profilAraligi) * 2; } catch { return 0; } })();
  results.toplamMalzemeMaliyeti = (() => { try { return results.plakaMiktari * input.birimMaliyetPlaka + results.profilMiktari * input.birimMaliyetProfil; } catch { return 0; } })();
  results.iscilikSuresi = (() => { try { return input.alan / input.verimlilikFaktoru; } catch { return 0; } })();
  results.toplamIscilikMaliyeti = (() => { try { return results.iscilikSuresi * input.iscilikSaatUcreti; } catch { return 0; } })();
  results.toplamMaliyet = (() => { try { return results.toplamMalzemeMaliyeti + results.toplamIscilikMaliyeti; } catch { return 0; } })();
  results.birimMaliyet = (() => { try { return results.toplamMaliyet / input.alan; } catch { return 0; } })();
  return results;
}

export function calculateAsmaTavanMalzemeHesabi(input: AsmaTavanMalzemeHesabiInput): AsmaTavanMalzemeHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    plakaMiktari: results.plakaMiktari,
    profilMiktari: results.profilMiktari,
    toplamMalzemeMaliyeti: results.toplamMalzemeMaliyeti,
    iscilikSuresi: results.iscilikSuresi,
    toplamIscilikMaliyeti: results.toplamIscilikMaliyeti,
    birimMaliyet: results.birimMaliyet,
  };

  // rule: alan > 0
  // rule: profilAraligi >= 30 && profilAraligi <= 120
  // rule: fireOrani >= 0 && fireOrani <= 20
  // rule: birimMaliyetPlaka > 0
  // rule: birimMaliyetProfil > 0
  // rule: iscilikSaatUcreti > 0
  // rule: verimlilikFaktoru > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Fire orani yuksek, malzeme kaybini azaltmak icin kesim plani gozden gecirilmeli.
  // threshold skipped (non-JS): Iscilik maliyeti yuksek, alternatif ekip veya yontem degerlendirilmeli.

  const dataConfidenceAdjusted = (() => { try { return results.toplamMaliyet * (1 - 0.05); } catch { return toplamMaliyet; } })();

  return {
    toplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli rapor"],
  };
}
