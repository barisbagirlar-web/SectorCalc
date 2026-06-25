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
 * ID: MECH_400
 * Name: Titreşim İzolasyonu Transmisbilite (Geçirgenlik)
 */

export const InputSchema_MECH_400 = z.object({
  zorlama_frekansi: z.number(),
  dogal_frekans: z.number(),
  sonum_orani: z.number(),
});

export type Input_MECH_400 = z.infer<typeof InputSchema_MECH_400>;

export interface Output_MECH_400 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_400(input: Input_MECH_400): Output_MECH_400 {
  const validData = InputSchema_MECH_400.parse(input);
  const { zorlama_frekansi, dogal_frekans, sonum_orani } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((zorlama_frekansi / dogal_frekans) > 0.8 && (zorlama_frekansi / dogal_frekans) < 1.414) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Titreşim İzolasyon Teorisi",
        message: "Kritik Rezonans Riski: Frekans oranı (r) Amplifikasyon (Büyütme) bölgesindedir (r < √2). Makine altına koyduğunuz kauçuk takoz/yay, titreşimi sönümlemek yerine zemine KATLAYARAK iletecektir. İzolatör seçiminiz tamamen yanlıştır, daha yumuşak bir izolatör seçin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
