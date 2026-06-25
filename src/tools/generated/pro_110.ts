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
 * ID: PRO_110
 * Name: DSO ve Erken Ödeme İskonto (Trade Credit) Optimizasyonu
 */

export const InputSchema_PRO_110 = z.object({
  annual_revenue: z.number(),
  avg_ar_balance: z.number(),
  wacc: z.number(),
  discount_pct: z.number(),
  discount_term: z.number(),
  normal_term: z.number(),
  expected_take_rate: z.number(),
  default_rate: z.number(),
  collection_fee_pct: z.number(),
});

export type Input_PRO_110 = z.infer<typeof InputSchema_PRO_110>;

export interface Output_PRO_110 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_110(input: Input_PRO_110): Output_PRO_110 {
  const validData = InputSchema_PRO_110.parse(input);
  const { annual_revenue, avg_ar_balance, wacc, discount_pct, discount_term, normal_term, expected_take_rate, default_rate, collection_fee_pct } = validData as any;
  
  const DSO_Current = (avg_ar_balance / annual_revenue) * 365;
  const Cost_Of_Carrying_AR = avg_ar_balance * (wacc / 100);
  const Bad_Debt_Cost = annual_revenue * (default_rate / 100);
  const Collection_Cost = annual_revenue * (default_rate / 100) * (collection_fee_pct / 100);
  const Cost_Of_Discount_Offered = annual_revenue * (expected_take_rate / 100) * (discount_pct / 100);
  const New_Avg_AR_Balance = annual_revenue * (((expected_take_rate / 100) * discount_term) + ((1 - (expected_take_rate / 100)) * DSO_Current)) / 365;
  const New_Carrying_Cost = New_Avg_AR_Balance * (wacc / 100);
  const Net_Financial_Impact_Of_Policy = Cost_Of_Carrying_AR - New_Carrying_Cost - Cost_Of_Discount_Offered;
  const Annualized_Discount_Rate_Cost = (discount_pct / (100 - discount_pct)) * (365 / (normal_term - discount_term)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (Annualized_Discount_Rate_Cost > wacc) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Hazine ve Nakit Yönetimi",
        message: "Pahalı Finansman Uyarısı: Müşterilere sunduğunuz erken ödeme iskontosunun yıllıklandırılmış efektif maliyeti (Örn: 2/10 Net 30 için %36.7), şirketinizin dışarıdan borçlanma maliyetini (WACC) aşmaktadır. Nakde sıkışık değilseniz bu iskontoyu sunmak şirkete zarar yazar."
      });
    }
  
  return {
    result: Annualized_Discount_Rate_Cost,
    smartWarnings
  };
}
