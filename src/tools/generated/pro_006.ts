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
 * ID: PRO_006
 * Name: Otomotiv Tamir Geri Dönüş (Comeback) Derin Analizi
 */

export const InputSchema_PRO_006 = z.object({
  total_ro: z.number(),
  comeback_ro: z.number(),
  avg_diag_time: z.number(),
  avg_repair_time: z.number(),
  labor_rate: z.number(),
  bay_opp_cost: z.number(),
  wasted_parts: z.number(),
  warranty_claim: z.number(),
  churn_prob: z.number(),
  customer_ltv: z.number(),
});

export type Input_PRO_006 = z.infer<typeof InputSchema_PRO_006>;

export interface Output_PRO_006 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_006(input: Input_PRO_006): Output_PRO_006 {
  const validData = InputSchema_PRO_006.parse(input);
  const { total_ro, comeback_ro, avg_diag_time, avg_repair_time, labor_rate, bay_opp_cost, wasted_parts, warranty_claim, churn_prob, customer_ltv } = validData as any;
  
  const ComebackRate = (comeback_ro / total_ro) * 100;
  const LaborCost = comeback_ro * (avg_diag_time + avg_repair_time) * labor_rate;
  const PartsCost = comeback_ro * wasted_parts;
  const OpportunityCost = comeback_ro * (avg_diag_time + avg_repair_time) * bay_opp_cost;
  const LTVLoss = comeback_ro * (churn_prob / 100) * customer_ltv;
  const WarrantyCost = comeback_ro * warranty_claim;
  const TotalCost = LaborCost + PartsCost + OpportunityCost + LTVLoss + WarrantyCost;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (OpportunityCost > LaborCost) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kapasite Planlama",
        message: "Lift işgali kaynaklı gelir kaybı, teknisyene ödediğiniz paradan daha fazla kâr eritiyor."
      });
    }
  
  return {
    result: TotalCost,
    smartWarnings
  };
}
