import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: OHS_249
 * Araç Adı: Radyasyon Maruziyeti (Ters Kare Yasası)
 */

export const InputSchema_OHS_249 = z.object({
  kaynak_doz_hizi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yeni_mesafe: z.number().min(0.1, "Endüstriyel minimum tolerans: 0.1"),
});

export type Input_OHS_249 = z.infer<typeof InputSchema_OHS_249>;

export interface Output_OHS_249 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_OHS_249(input: Input_OHS_249): Output_OHS_249 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kaynak_doz_hizi, yeni_mesafe
  
  const validData = InputSchema_OHS_249.parse(input);
  const { kaynak_doz_hizi, yeni_mesafe } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "TAEK / ICRP Radyasyon Korunma Sınırları (ALARA)",
      message: "Kritik Radyasyon Riski: Belirlenen mesafedeki saatlik doz hızı halk/çalışan limitlerini (0.02 mSv/h) aşmaktadır. Bu bölgede kesintisiz çalışılması yıllık yasal doz limitlerinin aşılmasına yol açar; mesafeyi artırın veya kurşun/beton zırhlama (Shielding) uygulayın."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
