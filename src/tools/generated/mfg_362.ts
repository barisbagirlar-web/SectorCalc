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
 * ID: MFG_362
 * Name: Döküm Akışkanlığı (Superheat Toleransı)
 */

export const InputSchema_MFG_362 = z.object({
  dokum_sicakligi: z.number(),
  likidus_sicakligi: z.number(),
  kalip_kesit: z.number(),
});

export type Input_MFG_362 = z.infer<typeof InputSchema_MFG_362>;

export interface Output_MFG_362 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_362(input: Input_MFG_362): Output_MFG_362 {
  const validData = InputSchema_MFG_362.parse(input);
  const { dokum_sicakligi, likidus_sicakligi, kalip_kesit } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((dokum_sicakligi - likidus_sicakligi) < 50 && kalip_kesit < 5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Döküm Hataları Analizi",
        message: "Kritik İmalat Riski: Aşırı ısınma (Superheat) payı ince kesitli bir kalıp için (<5mm) çok yetersiz. Metal kalıbı tamamen dolduramadan donacak, parçada 'Soğuk Birleşme (Cold Shut)' ve 'Eksik Dolum (Misrun)' hurda hataları KESİNLİKLE oluşacaktır. Döküm sıcaklığını artırın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
