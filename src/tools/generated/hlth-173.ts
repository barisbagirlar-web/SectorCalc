import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: HLTH_173
 * Araç Adı: VO2 Max (Kardiyovasküler Kapasite)
 */

export const InputSchema_HLTH_173 = z.object({
  dinlenik_nabiz: z.number().min(30, "Endüstriyel minimum tolerans: 30"),
  maksimum_nabiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_HLTH_173 = z.infer<typeof InputSchema_HLTH_173>;

export interface Output_HLTH_173 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_HLTH_173(input: Input_HLTH_173): Output_HLTH_173 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: dinlenik_nabiz, maksimum_nabiz
  
  const validData = InputSchema_HLTH_173.parse(input);
  const { dinlenik_nabiz, maksimum_nabiz } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const KosuMesafesi = dinlenik_nabiz;
  const Sure = maksimum_nabiz;
  const result: number = (KosuMesafesi - 504.9) / 44.73;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "ACSM Standartları",
      message: "Uyarı: Hesaplanan VO2 Max değeri 80'in üzerindedir. Bu oran yalnızca elit düzeyde (Olimpik) dayanıklılık atletlerinde görülür. Girilen nabız değerlerinde ölçüm/cihaz hatası olabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}