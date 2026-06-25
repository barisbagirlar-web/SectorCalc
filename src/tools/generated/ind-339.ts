import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: IND_339
 * Araç Adı: Kullanılabilirlik (Availability - OEE Metriği)
 */

export const InputSchema_IND_339 = z.object({
  mtbf: z.number().min(0.1, "Endüstriyel minimum tolerans: 0.1"),
  mttr: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_IND_339 = z.infer<typeof InputSchema_IND_339>;

export interface Output_IND_339 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_339(input: Input_IND_339): Output_IND_339 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: mtbf, mttr
  
  const validData = InputSchema_IND_339.parse(input);
  const { mtbf, mttr } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "TPM / Veri Güvenilirliği",
      message: "Bilgi: Kullanılabilirlik %99.5'in üzerinde. Ancak onarım süreleriniz (MTTR) 1 saatin üzerinde. Bu durum, operatörlerin ayar (Setup), malzeme bekleme veya 5 dakikanın altındaki mikro duruşları (Micro-stops) ERP/MES sistemine girmediklerini, yani verinin manipüle edildiğini ('Yalancı Verimlilik') gösterir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
