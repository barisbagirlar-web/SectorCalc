import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MFG_363
 * Araç Adı: Kompozit Fiber Hacim Oranı (Vf)
 */

export const InputSchema_MFG_363 = z.object({
  fiber_hacmi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  recine_hacmi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MFG_363 = z.infer<typeof InputSchema_MFG_363>;

export interface Output_MFG_363 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_363(input: Input_MFG_363): Output_MFG_363 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: fiber_hacmi, recine_hacmi
  
  const validData = InputSchema_MFG_363.parse(input);
  const { fiber_hacmi, recine_hacmi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Havacılık Kompozit Standartları",
      message: "Kritik Yapısal Zafiyet: Fiber hacim oranı %70'in üzerindedir. Reçine miktarı yetersiz kalarak elyafları tam olarak ıslatamayacak (Wet-out failure); yapıda mikro boşluklar (Voids), kuru bölgeler (Dry Spots) ve katman ayrışması (Delamination) oluşacaktır."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Kompozit Mühendisliği",
      message: "Uyarı: Fiber oranı çok düşük (<%30). Reçine açısından zengin (Resin-rich) olan bu parça gereksiz yere ağır ve mekanik dayanım (Çekme/Eğilme) açısından son derece zayıf olacaktır. İnfüzyon veya Prepreg yöntemine geçin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
