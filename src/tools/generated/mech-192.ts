import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_192
 * Araç Adı: Rezonans Frekansı
 */

export const InputSchema_MECH_192 = z.object({
  kutle: z.number().min(0.0001, "Endüstriyel minimum tolerans: 0.0001"),
  yay_katsayisi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_192 = z.infer<typeof InputSchema_MECH_192>;

export interface Output_MECH_192 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_192(input: Input_MECH_192): Output_MECH_192 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kutle, yay_katsayisi
  
  const validData = InputSchema_MECH_192.parse(input);
  const { kutle, yay_katsayisi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = 1 / Math.max(0.0001, (2 * Math.PI * Math.sqrt(Math.max(0.0001, kutle * yay_katsayisi))));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 48 && result < 52) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Makine Dinamiği",
      message: "Kritik Uyarı: Sistemin doğal frekansı ~50 Hz civarındadır. Endüstriyel AC motorlar (3000 RPM) veya şebeke frekansı ile tahrik edilen sistemlerde doğrudan rezonans çakışması yaşanarak yapısal parçalanmaya (Catastrophic Failure) neden olabilir."
    });
  }

  if (result > 58 && result < 62) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Makine Dinamiği",
      message: "Kritik Uyarı: Sistemin doğal frekansı ~60 Hz civarındadır (3600 RPM motor çakışma riski). Rijitliği (k) veya kütleyi (m) değiştirerek frekansı izole edin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}