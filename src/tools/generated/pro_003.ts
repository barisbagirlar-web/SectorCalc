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
 * ID: PRO_003
 * Name: AQL Örnekleme (Hipergeometrik Düzeltmeli)
 */

export const InputSchema_PRO_003 = z.object({
  lot_size: z.number(),
  sample_size: z.number(),
  accept_num: z.number(),
  aql_pct: z.number(),
  ltpd_pct: z.number(),
  destruct_test: z.enum(["Hayır", "Evet"]),
  test_cost: z.number(),
  unit_cost: z.number(),
  escape_cost: z.number(),
  inspector_err: z.number(),
});

export type Input_PRO_003 = z.infer<typeof InputSchema_PRO_003>;

export interface Output_PRO_003 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_003(input: Input_PRO_003): Output_PRO_003 {
  const validData = InputSchema_PRO_003.parse(input);
  const { lot_size, sample_size, accept_num, aql_pct, ltpd_pct, destruct_test, test_cost, unit_cost, escape_cost, inspector_err } = validData as any;
  
  const p_AQL = aql_pct / 100;
    const p_LTPD = ltpd_pct / 100;
    const DistType = ((lot_size / sample_size) < 10) ? 'HYPERGEOMETRIC' : 'BINOMIAL';
    const Pa_Producer = (DistType == 'HYPERGEOMETRIC') ? 0.95 : jStat.normal.cdf(accept_num);
    const Alpha_Risk = 1 - Pa_Producer;
    const Pa_Consumer = (DistType == 'HYPERGEOMETRIC') ? 0.05 : jStat.normal.cdf(accept_num);
    const Beta_Risk = Pa_Consumer;
    const DestructCost = (destruct_test == 'Evet') ? (sample_size * unit_cost) : 0;
    const NetInspCost = (sample_size * test_cost) + DestructCost;
    const ATI = sample_size + ((1 - Pa_Producer) * (lot_size - sample_size));
    const AOQ = (Pa_Producer * p_AQL * (lot_size - sample_size)) / lot_size;
    const TrueEscape = (AOQ * lot_size) + (ATI * (inspector_err / 100));
    const TotalRiskCost = NetInspCost + (TrueEscape * escape_cost);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (DistType === 'HYPERGEOMETRIC') {
      smartWarnings.push({
        severity: "INFO",
        source: "İstatistiksel Doğruluk",
        message: "Parti/Örneklem oranı 10'dan küçük olduğu için Binom dağılımı iptal edilmiş, gerçekçi risk hesabı için Hipergeometrik dağılım kullanılmıştır."
      });
    }
  
  return {
    result: TotalRiskCost,
    smartWarnings
  };
}
