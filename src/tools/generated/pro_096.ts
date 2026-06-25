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
 * ID: PRO_096
 * Name: Sözleşme Teşvik Paylaşımı ve Maliyet Hedef Optimizasyonu
 */

export const InputSchema_PRO_096 = z.object({
  target_cost: z.number(),
  target_fee: z.number(),
  contractor_share: z.number(),
  max_fee: z.number(),
  min_fee: z.number(),
  actual_cost: z.number(),
});

export type Input_PRO_096 = z.infer<typeof InputSchema_PRO_096>;

export interface Output_PRO_096 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_096(input: Input_PRO_096): Output_PRO_096 {
  const validData = InputSchema_PRO_096.parse(input);
  const { target_cost, target_fee, contractor_share, max_fee, min_fee, actual_cost } = validData as any;
  
  const Cost_Deviation = target_cost - actual_cost;
  const Contractor_Incentive = Cost_Deviation * contractor_share;
  const Adjusted_Fee = target_fee + Contractor_Incentive;
  const Final_Fee = Math.min(Math.max(Adjusted_Fee, min_fee), max_fee);
  const Final_Price_To_Client = actual_cost + Final_Fee;
  const Effective_Margin_Pct = (Final_Fee / actual_cost) * 100;
  const Point_Of_Total_Assumption_PTA = target_cost + ((target_fee - min_fee) / contractor_share);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (actual_cost > Point_Of_Total_Assumption_PTA) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "PMBOK Tedarik Yönetimi",
        message: "Zarar Eşiği İhlali: Toplam Sorumluluk Noktası (PTA) aşılmıştır. Bu noktadan sonra oluşacak tüm ek maliyetlerin %100'ü yüklenicinin (Sizin) kârından düşülecektir. Proje kârlılığı asgari garanti sınırına kilitlenmiştir."
      });
    }
  
  return {
    result: Point_Of_Total_Assumption_PTA,
    smartWarnings
  };
}
