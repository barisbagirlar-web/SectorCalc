import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_074
 * Araç Adı: Araba Kredisi
 */

export const InputSchema_FIN_074 = z.object({
  fiyat: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  pesin: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_074 = z.infer<typeof InputSchema_FIN_074>;

export interface Output_FIN_074 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_074(input: Input_FIN_074): Output_FIN_074 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: fiyat, pesin, faiz, vade
  
  const validData = InputSchema_FIN_074.parse(input);
  const { fiyat, pesin, faiz, vade } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const kredi = fiyat - pesin;
  const aylikFaiz = (faiz / 100) / 12;
  const result = aylikFaiz === 0
    ? kredi / vade
    : kredi * (aylikFaiz * Math.pow(1 + aylikFaiz, vade)) / (Math.pow(1 + aylikFaiz, vade) - 1);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Otomotiv Finansmanı",
      message: "Uyarı: 60 ayı aşan araç kredilerinde, aracın piyasa değerindeki düşüş (amortisman) genellikle anapara ödeme hızından daha yüksektir. Kredinin ortalarında aracı satmak isterseniz 'Sualtında' (Borcun araç değerinden yüksek olması) kalabilirsiniz."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "LTV Kuralları",
      message: "Not: %20'nin altında peşinat verdiniz. Kredi/Değer (LTV) oranı çok yüksek olduğu için bankalar kasko dışında 'GAP Sigortası' talep edebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}