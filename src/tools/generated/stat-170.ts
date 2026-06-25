import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: STAT_170
 * Araç Adı: Varyans Analizi (ANOVA)
 */

export const InputSchema_STAT_170 = z.object({
  gruplar: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_STAT_170 = z.infer<typeof InputSchema_STAT_170>;

export interface Output_STAT_170 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_STAT_170(input: Input_STAT_170): Output_STAT_170 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: gruplar
  
  const validData = InputSchema_STAT_170.parse(input);
  const { gruplar } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // gruplar: her satırı bir grubu temsil eden sayısal değerler matrisi (sayı dizileri dizisi)
  const numGroups = gruplar.length;
  const allValues = gruplar.flat();
  const grandMean = allValues.reduce((a: number, b: number) => a + b, 0) / Math.max(1, allValues.length);

  let ssBetween = 0;
  let ssWithin = 0;
  for (let i = 0; i < numGroups; i++) {
    const group = gruplar[i];
    const groupMean = group.reduce((a: number, b: number) => a + b, 0) / Math.max(1, group.length);
    ssBetween += group.length * ((groupMean - grandMean) ** 2);
    for (let j = 0; j < group.length; j++) {
      ssWithin += (group[j] - groupMean) ** 2;
    }
  }

  const dfBetween = numGroups - 1;
  const dfWithin = allValues.length - numGroups;

  const meanSquareBetween = ssBetween / Math.max(1, dfBetween);
  const meanSquareWithin = ssWithin / Math.max(1, dfWithin);

  const result: number = meanSquareBetween / Math.max(0.0001, meanSquareWithin);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "İstatistiksel Varsayımlar",
      message: "Uyarı: ANOVA testi; verilerin normal dağıldığı, varyansların homojen olduğu (Levene/Bartlett testi) varsayımlarına dayanır. Bu varsayımlar sağlanmıyorsa çıkan F-değeri sizi Tip 1 hatasına (Yanlış Pozitif) düşürebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}