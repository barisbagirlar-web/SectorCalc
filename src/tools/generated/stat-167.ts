import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: STAT_167
 * Araç Adı: Güven Aralığı (Confidence Interval)
 */

export const InputSchema_STAT_167 = z.object({
  ortalama: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  std_hata: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  guven_seviyesi: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_STAT_167 = z.infer<typeof InputSchema_STAT_167>;

export interface Output_STAT_167 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_STAT_167(input: Input_STAT_167): Output_STAT_167 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ortalama, std_hata, guven_seviyesi
  
  const validData = InputSchema_STAT_167.parse(input);
  const { ortalama, std_hata, guven_seviyesi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Z = NORMSINV(GuvenSeviyesi); Alt = Ortalama - Z*StdHata; Ust = Ortalama + Z*StdHata
  // NORMSINV approximate using rational approximation (Peter Acklam)
  const p = guven_seviyesi / 100;
  const a1 = -3.969683028665376e+00;
  const a2 =  2.209460984245205e+00;
  const a3 = -2.759285104469687e-01;
  const a4 =  1.383577518672690e-02;
  const a5 = -3.066479806614716e-01;
  const a6 =  2.506628277459239e+00;
  const b1 = -5.447609879822406e+01;
  const b2 =  1.615858368580409e+02;
  const b3 = -1.556989798598866e+02;
  const b4 =  6.680131188771972e+01;
  const b5 = -1.328068155288572e+01;
  const c1 = -7.784894002430293e-03;
  const c2 = -3.223964580411365e-01;
  const c3 = -2.400758277161838e+00;
  const c4 = -2.549732539343734e+00;
  const c5 =  4.374664141464968e+00;
  const c6 =  2.938163982698783e+00;
  const d1 =  7.784695709041462e-03;
  const d2 =  3.224671290700398e-01;
  const d3 =  2.445134137142996e+00;
  const d4 =  3.754408661907416e+00;
  let z: number;
  if (p < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p));
    z = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= 0.97575) {
    const q = p - 0.5;
    const r = q * q;
    z = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    z = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  const alt = ortalama - z * std_hata;
  const ust = ortalama + z * std_hata;
  
  const result = alt; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "İstatistiksel Kesinlik",
      message: "Not: %99 üzeri bir güven seviyesi seçtiniz. Aralık çok genişleyeceği için (Kesinlik düşer) parametrenin nerede olduğunu belirlemek zorlaşır; endüstride genellikle %95 (Z=1.96) tercih edilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}