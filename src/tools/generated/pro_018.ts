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
 * ID: PRO_018
 * Name: Bulut API Aşım, Kısıtlama (Throttling) ve SLA Maliyetleri
 */

export const InputSchema_PRO_018 = z.object({
  total_reqs: z.number(),
  included_reqs: z.number(),
  overage_rate: z.number(),
  throttle_rate: z.number(),
  retry_cost: z.number(),
  egress_gb: z.number(),
  egress_rate: z.number(),
  sla_target: z.number(),
  actual_uptime: z.number(),
  monthly_fee: z.number(),
});

export type Input_PRO_018 = z.infer<typeof InputSchema_PRO_018>;

export interface Output_PRO_018 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_PRO_018(input: Input_PRO_018): Output_PRO_018 {
  const validData = InputSchema_PRO_018.parse(input);
  const { total_reqs, included_reqs, overage_rate, throttle_rate, retry_cost, egress_gb, egress_rate, sla_target, actual_uptime, monthly_fee } = validData as any;
  
  const OverrunReqs = Math.max(0, total_reqs - included_reqs);
  const OverageCost = OverrunReqs * overage_rate;
  const ThrottledReqs = total_reqs * (throttle_rate / 100);
  const ThrottlingCost = ThrottledReqs * retry_cost * 2.5;
  const EgressCost = egress_gb * egress_rate;
  const SLAPenalty = ((actual_uptime < sla_target) ? (monthly_fee * 0.10) : (0));
  const TotalCloudPenalty = OverageCost + ThrottlingCost + EgressCost - SLAPenalty;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ThrottlingCost > OverageCost) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Mimari Zafiyet",
        message: "Sistem Mimari Uyarısı: API sınırlarına takılarak harcadığınız yeniden deneme (Retry) maliyetleri, basitçe kotayı aşıp faturayı ödemekten daha pahalıya geliyor. Üst pakete geçin veya kuyruk (Queue) yapısı kurun."
      });
    }
  
  return {
    result: TotalCloudPenalty,
    smartWarnings
  };
}
