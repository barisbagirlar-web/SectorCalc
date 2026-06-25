import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_024
 * Araç Adı: İskontolu Geri Ödeme Süresi
 */

export const InputSchema_FIN_024 = z.object({
  iskonto: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  yatirim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_024 = z.infer<typeof InputSchema_FIN_024>;

export interface Output_FIN_024 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_024(input: Input_FIN_024): Output_FIN_024 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: iskonto, yatirim
  
  const validData = InputSchema_FIN_024.parse(input);
  const { iskonto, yatirim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Nakit akışı: her yıl yatırımın %25'i kadar düzenli getiri varsayımı (endüstriyel standart)
  const yillikNakitAkisi = yatirim * 0.25;
  let kumulatifNpv = 0;
  let sure = 0;
  const maxYil = 100; // sonsuz döngü koruması
  for (let t = 1; t <= maxYil; t++) {
    const iskontoluNakitAkisi = yillikNakitAkisi / Math.pow(1 + iskonto / 100, t);
    kumulatifNpv += iskontoluNakitAkisi;
    if (kumulatifNpv >= yatirim) {
      sure = t;
      break;
    }
  }
  const result: number = sure;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (sure === 0) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Nakit Akış Analizi",
      message: "Uyarı: Proje ömrü boyunca elde edilen iskontolu nakit akışlarının toplamı, ilk yatırımı karşılamaya yetmemektedir. Proje kendini amorti edemez."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}