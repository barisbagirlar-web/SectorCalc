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
 * ID: ELEC_228
 * Name: Kondansatörde Depolanan Enerji
 */

export const InputSchema_ELEC_228 = z.object({
  kapasite: z.number(),
  gerilim: z.number(),
});

export type Input_ELEC_228 = z.infer<typeof InputSchema_ELEC_228>;

export interface Output_ELEC_228 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ELEC_228(input: Input_ELEC_228): Output_ELEC_228 {
  const validData = InputSchema_ELEC_228.parse(input);
  const { kapasite, gerilim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((0.5 * kapasite * (gerilim * gerilim)) > 10) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "İş Sağlığı ve Güvenliği (İSG)",
        message: "Kritik Uyarı: Kondansatörde depolanan enerji 10 Joule'ün üzerindedir. Sistem kapatıldıktan sonra bile terminallere dokunmak ÖLÜMCÜL ŞOK yaratır. Devreye mutlaka Bleeder (Deşarj) direnci eklenmeli ve çalışmadan önce topraklanmalıdır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
