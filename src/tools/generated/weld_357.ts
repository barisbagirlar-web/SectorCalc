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
 * ID: WELD_357
 * Name: Paslanmaz Çelik Kaynağı Ferrit Numarası (FN)
 */

export const InputSchema_WELD_357 = z.object({
  cr_eq: z.number(),
  ni_eq: z.number(),
});

export type Input_WELD_357 = z.infer<typeof InputSchema_WELD_357>;

export interface Output_WELD_357 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_WELD_357(input: Input_WELD_357): Output_WELD_357 {
  const validData = InputSchema_WELD_357.parse(input);
  const { cr_eq, ni_eq } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (FN_Result < 4.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Schaeffler/DeLong Diyagramları (WRC)",
        message: "Kritik Metalurjik Risk: Ferrit numarası (FN) 4'ün altına inmiştir (Tamamen Ostenitik Yapı). Kaynak dikişi katılaşırken büzülme gerilmelerini karşılayamayacak ve dikiş merkezinde KESİNLİKLE 'Sıcak Çatlak (Hot Cracking)' oluşacaktır. Kaynak telini (Filler) Ferrit yapıcı elemanlarca zenginleştirin."
      });
    }

    if (FN_Result > 10.0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Korozyon Mühendisliği",
        message: "Uyarı: Yüksek ferrit içeriği sıcak çatlağı önler ancak, sistem klorürlü veya asidik bir ortamda çalışacaksa, ferrit/ostenit faz sınırlarında galvanik pil etkisi yaratarak korozyon direncini zayıflatabilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
