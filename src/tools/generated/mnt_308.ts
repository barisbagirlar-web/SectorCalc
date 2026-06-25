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
 * ID: MNT_308
 * Name: MTTR (Ortalama Tamir Süresi)
 */

export const InputSchema_MNT_308 = z.object({
  toplam_durus_suresi: z.number(),
  ariza_sayisi: z.number(),
});

export type Input_MNT_308 = z.infer<typeof InputSchema_MNT_308>;

export interface Output_MNT_308 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MNT_308(input: Input_MNT_308): Output_MNT_308 {
  const validData = InputSchema_MNT_308.parse(input);
  const { toplam_durus_suresi, ariza_sayisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((toplam_durus_suresi / ariza_sayisi) > 4) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Yalın Bakım Yönetimi",
        message: "Uyarı: Bir arızanın ortalama onarımı 4 saati geçmektedir. Bakım ekibinin müdahale hızında, yedek parça bulunabilirliğinde veya arıza teşhis (Troubleshooting) yeteneğinde ciddi organizasyonel zafiyetler vardır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
