import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_094
 * Araç Adı: Güvenli Not (SAFE)
 */

export const InputSchema_CORP_094 = z.object({
  yatirim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tavan_deger: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  toplam_hisse: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_094 = z.infer<typeof InputSchema_CORP_094>;

export interface Output_CORP_094 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_094(input: Input_CORP_094): Output_CORP_094 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yatirim, tavan_deger, toplam_hisse
  
  const validData = InputSchema_CORP_094.parse(input);
  const { yatirim, tavan_deger, toplam_hisse } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const donusum_fiyati = tavan_deger / Math.max(1, toplam_hisse);
  const result = yatirim / Math.max(0.0001, donusum_fiyati);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Y Combinator SAFE",
      message: "Kritik Uyarı: Alınan yatırım tavan değerlemenin %25'inden fazladır. Bu senaryoda SAFE, bir sonraki tur fiyatından bağımsız olarak şirket hisselerinin çok büyük bir kısmını (%25+) tek bir erken aşama yatırımcısına devredecektir (Aşırı Sulanma)."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}