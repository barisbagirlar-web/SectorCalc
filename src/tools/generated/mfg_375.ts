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
 * ID: MFG_375
 * Name: Plastik Enjeksiyon Yolluk (Runner) Çaplandırma
 */

export const InputSchema_MFG_375 = z.object({
  parca_hacmi: z.number(),
  yolluk_uzunlugu: z.number(),
  yolluk_capi: z.number(),
});

export type Input_MFG_375 = z.infer<typeof InputSchema_MFG_375>;

export interface Output_MFG_375 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_375(input: Input_MFG_375): Output_MFG_375 {
  const validData = InputSchema_MFG_375.parse(input);
  const { parca_hacmi, yolluk_uzunlugu, yolluk_capi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (yolluk_capi < (SQRT(parca_hacmi) + 1.5)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Reoloji ve Akış Analizi",
        message: "Uyarı: Tasarlanan yolluk çapı parça hacmine oranla çok dar. Eriyik plastik yüksek hızda dar kanaldan geçerken aşırı 'Kayma Isınması (Shear Heating)' yaşayacak, polimer zincirleri parçalanacak (Degradation) ve parça üzerinde yanık izleri / mekanik zafiyet oluşacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
