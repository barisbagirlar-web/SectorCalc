import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: STAT_165
 * Araç Adı: Ortalama, Medyan, Mod
 */

export const InputSchema_STAT_165 = z.object({
  veri_seti: z.array(z.number()).min(1, "Veri seti en az bir eleman içermelidir"),
});

export type Input_STAT_165 = z.infer<typeof InputSchema_STAT_165>;

export interface Output_STAT_165 {
  result: {
    ortalama: number;
    medyan: number;
    mod: number;
  };
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_STAT_165(input: Input_STAT_165): Output_STAT_165 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: veri_seti
  
  const validData = InputSchema_STAT_165.parse(input);
  const { veri_seti } = validData;
  
  // Ortalama hesaplama
  const n = veri_seti.length;
  const toplam = veri_seti.reduce((sum, val) => sum + val, 0);
  const ortalama = toplam / Math.max(1, n);
  
  // Medyan hesaplama
  const sorted = [...veri_seti].sort((a, b) => a - b);
  let medyan: number;
  const ortaIndex = Math.floor(n / 2);
  if (n % 2 === 0) {
    medyan = (sorted[ortaIndex - 1] + sorted[ortaIndex]) / 2;
  } else {
    medyan = sorted[ortaIndex];
  }
  
  // Mod hesaplama (en sık tekrar eden değer)
  const frekans = new Map<number, number>();
  for (const val of veri_seti) {
    frekans.set(val, (frekans.get(val) || 0) + 1);
  }
  let maxFrekans = 0;
  let mod: number = veri_seti[0];
  for (const [val, count] of frekans) {
    if (count > maxFrekans) {
      maxFrekans = count;
      mod = val;
    }
  }
  
  const result = {
    ortalama,
    medyan,
    mod
  };
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  // Çarpıklık kontrolü: ortalama ile medyan arasındaki fark %20'yi aşıyorsa
  const farkYuzde = Math.abs(ortalama - medyan) / Math.max(Math.abs(ortalama), Math.abs(medyan), 1);
  if (farkYuzde > 0.2) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Veri Dağılımı (Skewness)",
      message: "Uyarı: Ortalama ile Medyan arasındaki fark %20'yi aşıyor. Verinizde ciddi bir çarpıklık (Skewness) veya aşırı uç değerler (Outliers) var. Veriyi tanımlarken Ortalama yerine Medyan kullanmak daha sağlıklı kararlar almanızı sağlar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}