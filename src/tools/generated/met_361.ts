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
 * ID: MET_361
 * Name: Düzlemsellik Toleransı (Flatness - GD&T)
 */

export const InputSchema_MET_361 = z.object({
  maks_tepe: z.number(),
  maks_vadi: z.number(),
  tolerans_limiti: z.number(),
});

export type Input_MET_361 = z.infer<typeof InputSchema_MET_361>;

export interface Output_MET_361 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MET_361(input: Input_MET_361): Output_MET_361 {
  const validData = InputSchema_MET_361.parse(input);
  const { maks_tepe, maks_vadi, tolerans_limiti } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((maks_tepe + maks_vadi) > tolerans_limiti) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ASME Y14.5 Düzlemsellik Şartı",
        message: "Kritik Kalite Reddi: Toplam sapma (En yüksek tepe ile en derin vadi arası mesafe) düzlemsellik toleransını aşıyor. İki paralel düzlem arasına sığmayan bu parça, sızdırmazlık yüzeyiyse yağ kaçıracak; montaj yüzeyiyse cıvata sıkıldığında kasılarak çatlayacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
