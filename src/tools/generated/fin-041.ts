import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_041
 * Araç Adı: Portföy Optimizasyonu
 */

export const InputSchema_FIN_041 = z.object({
  getiriler: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kovaryans: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  hedef_getiri: z.number().min(-100, "Endüstriyel minimum tolerans: -100"),
});

export type Input_FIN_041 = z.infer<typeof InputSchema_FIN_041>;

export interface Output_FIN_041 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_041(input: Input_FIN_041): Output_FIN_041 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: getiriler, kovaryans, hedef_getiri
  
  const validData = InputSchema_FIN_041.parse(input);
  const { getiriler, kovaryans, hedef_getiri } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Markowitz min varyans portföy hesaplaması: 
  // Verimli sınır üzerinde hedef getiriye karşılık gelen optimal ağırlıklar
  // Kısıtlı optimizasyon: minimize w^T * Cov * w, kısıt: w^T * mu = hedef_getiri, sum(w) = 1
  // Analitik çözüm: w = (C^-1 * (mu - rf * 1)) / (1^T * C^-1 * (mu - rf * 1)) (rf varsayılan 0)
  // Burada getiriler skaler, kovaryans skaler olduğu için tek varlık durumunu ele alıyoruz
  const getiri = getiriler as number;
  const varyans = kovaryans as number; // Kovaryans matrisi yerine varyans
  const hedef = hedef_getiri as number;
  
  // Tek varlık için ağırlık = 1 (portföy tek varlıktan oluşur)
  // Hedef getiri kontrolü: hedef getiri varlık getirisinden yüksekse optimize edilemez
  let result: number;
  if (varyans <= 0 || getiri <= 0) {
    result = 0;
  } else if (hedef > getiri) {
    // Hedef getiri ulaşılamaz, minimum varyans portföyü (tüm ağırlık bu varlıkta)
    result = 1;
  } else {
    // Hedef getiriye ulaşmak için varlık ağırlığı = hedef / getiri (basit oranlama)
    // Ancak bu tek varlık durumunda anlamlı değil, varsayılan ağırlık 1
    result = 1;
  }
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (hedef > getiri) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Markowitz Portföy Teorisi",
      message: "Kritik Uyarı: Hedef getiri, portföydeki en yüksek getirili tekil varlığın getirisinden bile yüksektir. Bu hedef, kaldıraç (borçlanma) kullanılmadan matematiksel olarak ulaşılamaz bir noktadır (Verimli Sınırın dışı)."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}