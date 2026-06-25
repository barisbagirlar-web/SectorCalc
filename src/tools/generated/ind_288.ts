/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: IND_288
 * Name: Rulman Gresi Yenileme Aralığı (Relubrication Interval)
 */

export const InputSchema_IND_288 = z.object({
  rulman_ic_cap: z.number(),
  rulman_dis_cap: z.number(),
  calisma_devri: z.number(),
  ortam_sicakligi: z.number(),
});

export type Input_IND_288 = z.infer<typeof InputSchema_IND_288>;

export interface Output_IND_288 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_288(input: Input_IND_288): Output_IND_288 {
  const validData = InputSchema_IND_288.parse(input);
  const { rulman_ic_cap, rulman_dis_cap, calisma_devri, ortam_sicakligi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((((rulman_ic_cap + rulman_dis_cap) / 2) * calisma_devri) > 500000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Triboloji ve Hız Faktörü (ndm)",
        message: "Uyarı: Rulman hız faktörü (ndm) 500.000 sınırını aşmıştır. Bu santrifüj hızında standart lityum sabunlu gresler rulman içinde duramaz (Yağ kusma). Özel yüksek devir sentetik gresi (Poliglikol vb.) kullanılmalıdır."
      });
    }

    if (ortam_sicakligi > 70) {
      smartWarnings.push({
        severity: "INFO",
        source: "SKF Gres Ömrü Kuralı",
        message: "Not: 70°C'nin üzerindeki her 15°C'lik sıcaklık artışında, gres baz yağının oksitlenme hızı iki katına çıkar ve yağlama periyodu yarı yarıya kısalır (Arrhenius Kuralı)."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
