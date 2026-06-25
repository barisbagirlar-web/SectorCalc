import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_050
 * Araç Adı: Gerçek Getiri (Real Return)
 */

export const InputSchema_FIN_050 = z.object({
  nominal_getiri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  enflasyon: z.number().min(-99.9, "Endüstriyel minimum tolerans: -99.9"),
});

export type Input_FIN_050 = z.infer<typeof InputSchema_FIN_050>;

export interface Output_FIN_050 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_050(input: Input_FIN_050): Output_FIN_050 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: nominal_getiri, enflasyon
  
  const validData = InputSchema_FIN_050.parse(input);
  const { nominal_getiri, enflasyon } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Reel = ((1 + NominalGetiri/100) / MAX(0.0001, (1 + Enflasyon/100)) - 1) * 100
  const safeDenominator = Math.max(0.0001, (1 + enflasyon / 100));
  const result = ((1 + nominal_getiri / 100) / safeDenominator - 1) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (nominal_getiri > 0 && result < 0) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Reel Değer Kaybı",
      message: "Kritik Çıktı: Yatırımınız kâğıt üzerinde (nominal) kâr etmiş olsa da, elde edilen getiri enflasyonun altında kaldığı için satın alma gücünüz net olarak erimiştir (Reel Zarar)."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}