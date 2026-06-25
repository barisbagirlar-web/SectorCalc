import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_027
 * Araç Adı: Öz Sermaye Maliyeti (CAPM)
 */

export const InputSchema_FIN_027 = z.object({
  risksiz_faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  beta: z.number().min(-5, "Endüstriyel minimum tolerans: -5"),
  piyasa_primi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_027 = z.infer<typeof InputSchema_FIN_027>;

export interface Output_FIN_027 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_027(input: Input_FIN_027): Output_FIN_027 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: risksiz_faiz, beta, piyasa_primi
  
  const validData = InputSchema_FIN_027.parse(input);
  const { risksiz_faiz, beta, piyasa_primi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = risksiz_faiz + beta * piyasa_primi;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Portföy Yönetimi",
      message: "Not: Negatif Beta, hissenin/varlığın genel piyasa ile ters yönde hareket ettiği (örn: Altın madeni şirketleri) anlamına gelir. Çok nadir görülen bir durumdur."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Piyasa Volatilitesi",
      message: "Uyarı: Beta > 2. Hisse, piyasa ortalamasından %100 daha fazla değişkendir; agresif büyüme hissesi (örn: teknoloji start-upları) profiline uyar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}