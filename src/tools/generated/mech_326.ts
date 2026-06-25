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
 * ID: MECH_326
 * Name: Oransal Valf (Proportional) Akış Kapasitesi (Cv)
 */

export const InputSchema_MECH_326 = z.object({
  debi: z.number(),
  basinc_dusumu: z.number(),
  yogunluk: z.number(),
});

export type Input_MECH_326 = z.infer<typeof InputSchema_MECH_326>;

export interface Output_MECH_326 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_326(input: Input_MECH_326): Output_MECH_326 {
  const validData = InputSchema_MECH_326.parse(input);
  const { debi, basinc_dusumu, yogunluk } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (basinc_dusumu > 500 && yogunluk < 1.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Hidrolik Kavitasyon Teorisi",
        message: "Kritik Aşınma Riski: Valf üzerindeki basınç düşümü çok yüksek (Örn: 35 Bar üzeri). Daralan kesitte (Orifis) sıvı hızı o kadar artar ki lokal basınç buharlaşma sınırının altına düşer. Şiddetli sıvı kavitasyonu oluşacak ve valf mili (Spool) parçalanacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
