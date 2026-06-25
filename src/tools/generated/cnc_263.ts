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
 * ID: CNC_263
 * Name: Freze ile Diş Çekme (Thread Milling) İlerlemesi
 */

export const InputSchema_CNC_263 = z.object({
  delik_capi: z.number(),
  takim_capi: z.number(),
  cevre_ilerlemesi: z.number(),
});

export type Input_CNC_263 = z.infer<typeof InputSchema_CNC_263>;

export interface Output_CNC_263 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_263(input: Input_CNC_263): Output_CNC_263 {
  const validData = InputSchema_CNC_263.parse(input);
  const { delik_capi, takim_capi, cevre_ilerlemesi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((takim_capi / delik_capi) > 0.7) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Sandvik Coromant Kesme Verileri",
        message: "Uyarı: Takım çapı delik çapının %70'inden büyüktür. Talaş tahliyesi (Chip Evacuation) çok zorlaşır ve takımda sıkışma riski artar. Merkez ilerlemesinin (Vf_merkez) tezgâh G-Koduna doğru kompanze edilerek yazıldığından emin olun."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
