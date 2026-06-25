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
 * ID: WELD_316
 * Name: Karbon Eşdeğeri (CEV) ve Ön Isıtma
 */

export const InputSchema_WELD_316 = z.object({
  karbon: z.number(),
  mangan: z.number(),
  krom_molibden_vanadyum: z.number(),
  nikel_bakir: z.number(),
});

export type Input_WELD_316 = z.infer<typeof InputSchema_WELD_316>;

export interface Output_WELD_316 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_WELD_316(input: Input_WELD_316): Output_WELD_316 {
  const validData = InputSchema_WELD_316.parse(input);
  const { karbon, mangan, krom_molibden_vanadyum, nikel_bakir } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((karbon + (mangan/6) + (krom_molibden_vanadyum/5) + (nikel_bakir/15)) > 0.45) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "AWS D1.1 / IIW Karbon Eşdeğeri",
        message: "Kritik Kaynak Reddi: CEV değeri 0.45'i aşmıştır. Çeliğin kaynaklanabilirliği zayıftır. Ön ısıtma (Pre-heat) ve kontrollü soğutma (PWHT) KESİNLİKLE zorunludur; aksi halde Isıdan Etkilenen Bölgede (HAZ) Martenzit oluşur ve hidrojen çatlağı (Soğuk Çatlak) garanti edilir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
