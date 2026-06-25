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
 * ID: CNC_293
 * Name: Gagalamalı Delme (Peck Drilling - G83)
 */

export const InputSchema_CNC_293 = z.object({
  matkap_cap: z.number(),
  toplam_derinlik: z.number(),
  gagalama_derinligi: z.number(),
});

export type Input_CNC_293 = z.infer<typeof InputSchema_CNC_293>;

export interface Output_CNC_293 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_293(input: Input_CNC_293): Output_CNC_293 {
  const validData = InputSchema_CNC_293.parse(input);
  const { matkap_cap, toplam_derinlik, gagalama_derinligi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (gagalama_derinligi > (matkap_cap * 3)) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Guhring / Sandvik Delme Standartları",
        message: "Kritik İmalat Reddi: Gagalama adımı matkap çapının 3 katından büyüktür. Derin delik delmede talaşlar helis kanallarında sıkışacak (Chip Packing), soğutma sıvısı uca ulaşamayacak ve matkap parça içinde kesinlikle kırılacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
