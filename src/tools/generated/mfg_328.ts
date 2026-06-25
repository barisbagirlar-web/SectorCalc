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
 * ID: MFG_328
 * Name: Sac Büküm Geri Yaylanma (Springback) Tahmini
 */

export const InputSchema_MFG_328 = z.object({
  akma_dayanimi: z.number(),
  bukum_radyusu: z.number(),
  sac_kalinlik: z.number(),
  elastisite_modulu: z.number(),
});

export type Input_MFG_328 = z.infer<typeof InputSchema_MFG_328>;

export interface Output_MFG_328 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_328(input: Input_MFG_328): Output_MFG_328 {
  const validData = InputSchema_MFG_328.parse(input);
  const { akma_dayanimi, bukum_radyusu, sac_kalinlik, elastisite_modulu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((bukum_radyusu / sac_kalinlik) > 5) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sac Şekillendirme Metalurjisi",
        message: "Uyarı: Radyüs/Kalınlık (R/t) oranı 5'in üzerindedir. Geniş radyüslü bükümlerde plastik deformasyon zayıftır (Elastik bölge baskındır). Çok yüksek derecede geri yaylanma (Springback) oluşacaktır; kalıbın (Punch) büküm açısını (Overbending) kompanze edecek şekilde daraltılması şarttır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
