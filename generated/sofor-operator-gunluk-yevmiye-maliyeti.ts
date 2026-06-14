// Auto-generated from sofor-operator-gunluk-yevmiye-maliyeti-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SoforOperatorGunlukYevmiyeMaliyetiInput {
  brutUcret: number;
  sgkIsverenPrimi: number;
  kidemTazminatiKarsilik: number;
  yemekYardimi: number;
  yolYardimi: number;
  digerYanOdeme: number;
  calismaGunu: number;
  vergiDilimi: number;
  damgaVergisiOrani: number;
}

export const SoforOperatorGunlukYevmiyeMaliyetiInputSchema = z.object({
  brutUcret: z.number().min(0).default(500),
  sgkIsverenPrimi: z.number().min(0).max(100).default(20.5),
  kidemTazminatiKarsilik: z.number().min(0).max(100).default(8.33),
  yemekYardimi: z.number().min(0).default(50),
  yolYardimi: z.number().min(0).default(30),
  digerYanOdeme: z.number().min(0).default(20),
  calismaGunu: z.number().min(1).max(31).default(26),
  vergiDilimi: z.number().min(0).max(40).default(15),
  damgaVergisiOrani: z.number().min(0).max(100).default(0.759),
});

export interface SoforOperatorGunlukYevmiyeMaliyetiOutput {
  gunlukYevmiyeMaliyeti: number;
  breakdown: {
    brutUcret: number;
    yemekYardimi: number;
    yolYardimi: number;
    digerYanOdeme: number;
    sgkIsverenMaliyeti: number;
    kidemTazminatiMaliyeti: number;
    toplamIsverenMaliyeti: number;
    netUcret: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SoforOperatorGunlukYevmiyeMaliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.brutToplam = ((): number => { try { const __v = input.brutUcret + input.yemekYardimi + input.yolYardimi + input.digerYanOdeme; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sgkIsverenMaliyeti = ((): number => { try { const __v = input.brutUcret * (input.sgkIsverenPrimi / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kidemTazminatiMaliyeti = ((): number => { try { const __v = input.brutUcret * (kidemTazminatiKarsilik / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamIsverenMaliyeti = ((): number => { try { const __v = results.brutToplam + results.sgkIsverenMaliyeti + results.kidemTazminatiMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gelirVergisi = ((): number => { try { const __v = input.brutUcret * (input.vergiDilimi / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.damgaVergisi = ((): number => { try { const __v = input.brutUcret * (input.damgaVergisiOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netUcret = ((): number => { try { const __v = input.brutUcret - results.gelirVergisi - results.damgaVergisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gunlukYevmiyeMaliyeti = ((): number => { try { const __v = results.toplamIsverenMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSoforOperatorGunlukYevmiyeMaliyeti(input: SoforOperatorGunlukYevmiyeMaliyetiInput): SoforOperatorGunlukYevmiyeMaliyetiOutput {
  const results = evaluateFormulas(input);
  const gunlukYevmiyeMaliyeti = results.gunlukYevmiyeMaliyeti ?? 0;
  const breakdown = {
    brutUcret: results.brutUcret,
    yemekYardimi: results.yemekYardimi,
    yolYardimi: results.yolYardimi,
    digerYanOdeme: results.digerYanOdeme,
    sgkIsverenMaliyeti: results.sgkIsverenMaliyeti,
    kidemTazminatiMaliyeti: results.kidemTazminatiMaliyeti,
    toplamIsverenMaliyeti: results.toplamIsverenMaliyeti,
    netUcret: results.netUcret,
  };

  // rule: brutUcret > 0
  // rule: sgkIsverenPrimi >= 0 && sgkIsverenPrimi <= 100
  // rule: kidemTazminatiKarsilik >= 0 && kidemTazminatiKarsilik <= 100
  // rule: yemekYardimi >= 0
  // rule: yolYardimi >= 0
  // rule: digerYanOdeme >= 0
  // rule: calismaGunu >= 1 && calismaGunu <= 31
  // rule: vergiDilimi >= 0 && vergiDilimi <= 40
  // rule: damgaVergisiOrani >= 0 && damgaVergisiOrani <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.brutUcret > 1000) hiddenLossDrivers.push("Yuksek brut ucret");
  if (input.sgkIsverenPrimi > 25) hiddenLossDrivers.push("SGK isveren primi orani yuksek");

  const dataConfidenceAdjusted = (() => { try { return results.gunlukYevmiyeMaliyeti * (1 - 0.05); } catch { return gunlukYevmiyeMaliyeti; } })();

  return {
    gunlukYevmiyeMaliyeti,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
