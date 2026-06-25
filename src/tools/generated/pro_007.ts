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
 * ID: PRO_007
 * Name: Teklif Tutarlılık ve Gizli Sızıntı Analizi
 */

export const InputSchema_PRO_007 = z.object({
  total_quotes: z.number(),
  won_quotes: z.number(),
  quoted_part: z.number(),
  market_part: z.number(),
  quoted_labor: z.number(),
  flat_rate: z.number(),
  annual_vol: z.number(),
});

export type Input_PRO_007 = z.infer<typeof InputSchema_PRO_007>;

export interface Output_PRO_007 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_007(input: Input_PRO_007): Output_PRO_007 {
  const validData = InputSchema_PRO_007.parse(input);
  const { total_quotes, won_quotes, quoted_part, market_part, quoted_labor, flat_rate, annual_vol } = validData as any;
  
  const PartDeviation = (quoted_part - market_part) / market_part;
  const LaborDeviation = (quoted_labor - flat_rate) / flat_rate;
  const MarginLeak_Job = ((market_part - quoted_part) + ((flat_rate - quoted_labor) * 50));
  const AnnualLeakage = MarginLeak_Job * annual_vol;
  const WinRate = (won_quotes / total_quotes) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (LaborDeviation < 0) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Zaman Etüdü",
        message: "Teklif edilen süre Flat Rate'in altındadır. Bu durum 'Görünmez Fazla Mesai' yaratır."
      });
    }
  
  return {
    result: WinRate,
    smartWarnings
  };
}
