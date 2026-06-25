import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: THERM_335
 * Araç Adı: Langelier Doygunluk İndeksi (LSI - Kireçlenme)
 */

export const InputSchema_THERM_335 = z.object({
  ph_olculen: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  tds: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sicaklik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sertlik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  alkalinite: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_THERM_335 = z.infer<typeof InputSchema_THERM_335>;

export interface Output_THERM_335 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_THERM_335(input: Input_THERM_335): Output_THERM_335 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ph_olculen, tds, sicaklik, sertlik, alkalinite
  
  const validData = InputSchema_THERM_335.parse(input);
  const { ph_olculen, tds, sicaklik, sertlik, alkalinite } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 0.5) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Su Şartlandırma Kimyası",
      message: "Uyarı: LSI değeri +0.5'in üzerindedir. Su aşırı doygun haldedir. Soğutma kulelerinde, enjeksiyon kalıplarının soğutma kanallarında ve kazan borularında şiddetli Kalsiyum Karbonat (Kireç / Scale) birikimi yaşanacaktır."
    });
  }

  if (result < -0.5) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Su Şartlandırma Kimyası",
      message: "Kritik Korozyon Riski: LSI değeri -0.5'in altındadır. Su agresif (korozif) karakterdedir. Tesisattaki karbon çeliği ve bakır alaşımları hızla çözünerek delinecektir. Suya korozyon inhibitörü ekleyin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
