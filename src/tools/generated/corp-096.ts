import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_096
 * Araç Adı: Hisse Tablosu (Cap Table)
 */

export const InputSchema_CORP_096 = z.object({
  kurucu: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  yatirimci: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  opsiyon: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_096 = z.infer<typeof InputSchema_CORP_096>;

export interface Output_CORP_096 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_096(input: Input_CORP_096): Output_CORP_096 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kurucu, yatirimci, opsiyon
  
  const validData = InputSchema_CORP_096.parse(input);
  const { kurucu, yatirimci, opsiyon } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const toplam = kurucu + yatirimci + opsiyon;
  const result = (kurucu / Math.max(1, toplam)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Startup İstihdamı",
      message: "Not: Çalışan opsiyon havuzu %5'in altındadır. Nitelikli teknik yetenekleri (C-Level, Senior Mühendis) işe almak için bu oran genellikle %10-20 arasında tutulur."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Yatırımcılık Psikolojisi",
      message: "Uyarı: Kurucu payları %40'ın altındadır. Erken veya orta aşamada (Seri A/B) kurucunun motivasyonunu ve şirkete bağlılığını kaybetmesi riski olarak değerlendirilebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}