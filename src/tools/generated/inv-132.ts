import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: INV_132
 * Araç Adı: ABC Sınıflandırma
 */

export const InputSchema_INV_132 = z.object({
  yillik_talep: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  birim_maliyet: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_INV_132 = z.infer<typeof InputSchema_INV_132>;

export interface Output_INV_132 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_INV_132(input: Input_INV_132): Output_INV_132 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_talep, birim_maliyet
  
  const validData = InputSchema_INV_132.parse(input);
  const { yillik_talep, birim_maliyet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  let result: any = "C"; // Varsayılan sınıf
  
  const yillikDeger = yillik_talep * birim_maliyet;
  
  // PARETO_ANALIZI: Yıllık değere göre sınıflandırma
  // A Sınıfı: En yüksek %80 değeri oluşturan kalemler (genellikle toplam kalemlerin %20'si)
  // B Sınıfı: %15 değer oluşturan kalemler (%30-40 arası kalem)
  // C Sınıfı: %5 değer oluşturan kalemler (geri kalan kalemler)
  // Burada tek bir kalem için pareto sınır değerleri kullanıyoruz
  if (yillikDeger >= 100000) {
    result = "A";
  } else if (yillikDeger >= 10000) {
    result = "B";
  } else {
    result = "C";
  }
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Pareto Analizi",
      message: "Bilgi: Bu kalem, yıllık tüketim değeri itibarıyla büyük olasılıkla 'A Sınıfı' (Kritik) envantere girmektedir. Stok devir hızının maksimum seviyede tutulması ve sıkı sayım (Cycle Count) yapılması önerilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}