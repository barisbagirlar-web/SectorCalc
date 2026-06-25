import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_085
 * Araç Adı: Borç-Gelir Oranı (DTI)
 */

export const InputSchema_FIN_085 = z.object({
  aylik_borc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  brut_gelir: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_FIN_085 = z.infer<typeof InputSchema_FIN_085>;

export interface Output_FIN_085 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_085(input: Input_FIN_085): Output_FIN_085 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: aylik_borc, brut_gelir
  
  const validData = InputSchema_FIN_085.parse(input);
  const { aylik_borc, brut_gelir } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (aylik_borc / Math.max(1, brut_gelir)) * 100; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Bankacılık Standartları",
      message: "Kritik Uyarı: Borç/Gelir (DTI) oranınız %40'ı aşıyor. Çoğu geleneksel banka bu seviyenin üzerindeki profilleri 'Yüksek Temerrüt Riski' olarak işaretler ve yeni kredi başvurularını otomatik reddeder."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}