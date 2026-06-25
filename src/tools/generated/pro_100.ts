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
 * ID: PRO_100
 * Name: Makine Ekonomik Ömrü ve Sermaye Yıkımı (EUAC) Analizi
 */

export const InputSchema_PRO_100 = z.object({
  current_euac: z.number(),
  challenger_euac: z.number(),
  marginal_cost: z.number(),
  salvage: z.number(),
});

export type Input_PRO_100 = z.infer<typeof InputSchema_PRO_100>;

export interface Output_PRO_100 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_100(input: Input_PRO_100): Output_PRO_100 {
  const validData = InputSchema_PRO_100.parse(input);
  const { current_euac, challenger_euac, marginal_cost, salvage } = validData as any;
  
  const EUAC_Difference = current_euac - challenger_euac;
  const Marginal_Vs_Challenger = marginal_cost - challenger_euac;
  const Capital_Destruction_Value = Math.max(0, EUAC_Difference);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (current_euac > challenger_euac) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Mühendislik Ekonomisi",
        message: "Batık Maliyet Yanılgısı (Sunk Cost Fallacy): Mevcut makinenizi elinizde tuttuğunuz her yıl, yeni ve verimli bir makine almaya kıyasla şirketin sermayesini (Capital Destruction Value) yakmaktadır. Makine amorte olmamış (Defter değeri var) olsa dahi ACİLEN değiştirilmelidir."
      });
    }
  
  return {
    result: Capital_Destruction_Value,
    smartWarnings
  };
}
