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
 * ID: PRO_156
 * Name: B2B SaaS Fiyat Esnekliği, Net MRR Retention ve Büyüme Hızı
 */

export const InputSchema_PRO_156 = z.object({
  starting_mrr: z.number(),
  new_mrr: z.number(),
  expansion_mrr: z.number(),
  churn_mrr: z.number(),
  contraction_mrr: z.number(),
  price_increase_pct: z.number(),
  price_elasticity: z.number(),
});

export type Input_PRO_156 = z.infer<typeof InputSchema_PRO_156>;

export interface Output_PRO_156 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_156(input: Input_PRO_156): Output_PRO_156 {
  const validData = InputSchema_PRO_156.parse(input);
  const { starting_mrr, new_mrr, expansion_mrr, churn_mrr, contraction_mrr, price_increase_pct, price_elasticity } = validData as any;
  
  const Gross_MRR_Churn_Rate = ((churn_mrr + contraction_mrr) / starting_mrr) * 100;
  const Net_MRR_Churn_Rate = ((churn_mrr + contraction_mrr - expansion_mrr) / starting_mrr) * 100;
  const Net_MRR_Retention_NDR = 100 - Net_MRR_Churn_Rate;
  const Ending_MRR = starting_mrr + new_mrr + expansion_mrr - churn_mrr - contraction_mrr;
  const Churn_Impact_Due_To_Price = (price_increase_pct / 100) * Math.abs(price_elasticity);
  const Projected_MRR_After_Price_Hike = Ending_MRR * (1 + (price_increase_pct / 100)) * (1 - Churn_Impact_Due_To_Price);
  const Price_Hike_Net_Benefit = Projected_MRR_After_Price_Hike - Ending_MRR;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Net_MRR_Retention_NDR < 100) {
      smartWarnings.push({
        severity: "WARNING",
        source: "SaaS Büyüme Metrikleri",
        message: "Leaky Bucket (Delik Kova) Sendromu: Net MRR Elde Tutma (NDR) oranınız %100'ün altındadır. Yeni müşteri kazanımını (Acquisition) durdurursanız şirketiniz aydan aya küçülecektir. Expansion MRR artırılmadan (Upsell) uzun vadeli B2B başarısı imkansızdır."
      });
    }

    if (Price_Hike_Net_Benefit < 0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Mikroekonomi Analizi",
        message: "Fiyatlama Hatası: Fiyat esnekliği (Elasticity) çok yüksek. Yapmayı planladığınız fiyat artışı, iptal (Churn) edecek müşteriler yüzünden geliri artırmak yerine düşürecektir. Fiyat artışını iptal edin."
      });
    }
  
  return {
    result: Price_Hike_Net_Benefit,
    smartWarnings
  };
}
