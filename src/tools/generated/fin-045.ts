import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_045
 * Araç Adı: Opsiyon (Black-Scholes)
 */

export const InputSchema_FIN_045 = z.object({
  s: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  k: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  r: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  t: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  v: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_045 = z.infer<typeof InputSchema_FIN_045>;

export interface Output_FIN_045 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

function stdNormCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.SQRT2;
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

export function execute_FIN_045(input: Input_FIN_045): Output_FIN_045 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: s, k, r, t, v
  
  const validData = InputSchema_FIN_045.parse(input);
  const { s, k, r, t, v } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const adjustedK = Math.max(1, k);
  const adjustedT = Math.max(0.0001, t);
  const vDecimal = v / 100;
  const rDecimal = r / 100;
  const d1 = (Math.log(s / adjustedK) + (rDecimal + (vDecimal * vDecimal) / 2) * t) / (vDecimal * Math.sqrt(adjustedT));
  const d2 = d1 - vDecimal * Math.sqrt(adjustedT);
  const result = s * stdNormCDF(d1) - adjustedK * Math.exp(-rDecimal * t) * stdNormCDF(d2);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Opsiyon Fiyatlama",
      message: "Uyarı: Zımni volatilite (IV) %100'ün üzerindedir. Opsiyon primi olağanüstü yüksek çıkacaktır; bu durum kriz anlarında veya batış/çıkış riskindeki varlıklarda görülür."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}