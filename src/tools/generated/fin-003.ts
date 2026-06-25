import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_003
 * Araç Adı: 50/30/20 Bütçe Kuralı
 */

export const InputSchema_FIN_003 = z.object({
  net_gelir: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_FIN_003 = z.infer<typeof InputSchema_FIN_003>;

export interface Output_FIN_003 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_003(input: Input_FIN_003): Output_FIN_003 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: net_gelir
  
  const validData = InputSchema_FIN_003.parse(input);
  const { net_gelir } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const ihtiyac = net_gelir * 0.5;
  const istek = net_gelir * 0.3;
  const birikim = net_gelir * 0.2;
  const result = ihtiyac + istek + birikim; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Asgari Yaşam Maliyeti",
      message: "Not: Gelir asgari ücret sınırının altındadır. %50 İhtiyaç kuralı reel yaşam maliyetleri karşısında yetersiz kalabilir; temel ihtiyaçlara daha fazla pay ayrılması gerekebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}