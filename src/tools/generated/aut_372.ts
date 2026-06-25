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
 * ID: AUT_372
 * Name: Pnömatik Silindir Dinamik Yanıt Süresi
 */

export const InputSchema_AUT_372 = z.object({
  silindir_hacmi: z.number(),
  hortum_uzunlugu: z.number(),
  hortum_capi: z.number(),
  valf_debisi: z.number(),
});

export type Input_AUT_372 = z.infer<typeof InputSchema_AUT_372>;

export interface Output_AUT_372 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_AUT_372(input: Input_AUT_372): Output_AUT_372 {
  const validData = InputSchema_AUT_372.parse(input);
  const { silindir_hacmi, hortum_uzunlugu, hortum_capi, valf_debisi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (((3.14159 * (hortum_capi/20) * (hortum_capi/20)) * (hortum_uzunlugu * 10)) > (silindir_hacmi * 0.5)) {
      smartWarnings.push({
        severity: "WARNING",
        source: "FESTO Pnömatik Tasarım",
        message: "Uyarı: Valf ile silindir arasındaki hortumun iç (Ölü) hacmi, silindir hacminin %50'sini aşıyor. Kompresör havası silindiri hareket ettirmeden önce sadece hortumu şişirmekle vakit kaybedecek; PLC yanıt süresi (Response Time) dramatik şekilde uzayacak. Valfi silindire yaklaştırın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
