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
 * ID: MECH_341
 * Name: Rulman Gres Dolum Miktarı (SKF)
 */

export const InputSchema_MECH_341 = z.object({
  rulman_dis_cap: z.number(),
  rulman_genislik: z.number(),
  uygulanan_gres: z.number(),
});

export type Input_MECH_341 = z.infer<typeof InputSchema_MECH_341>;

export interface Output_MECH_341 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_341(input: Input_MECH_341): Output_MECH_341 {
  const validData = InputSchema_MECH_341.parse(input);
  const { rulman_dis_cap, rulman_genislik, uygulanan_gres } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (uygulanan_gres > (rulman_dis_cap * rulman_genislik * 0.005) * 1.5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SKF / FAG Yağlama Standartları",
        message: "Kritik Arıza Riski: Uyguladığınız gres miktarı, rulmanın optimum dolum hacminin (Gres = D x B x 0.005) %50 üzerindedir. Aşırı yağlama nedeniyle yüksek devirde gres ezilecek (Churning), sıcaklık hızla yükselecek (Thermal Runaway) ve rulman keçeleri patlayarak yağı dışarı kusacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
