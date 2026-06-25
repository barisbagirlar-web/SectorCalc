import { BulutApiAsimKisitlamaThrottlingVeSlaMaliyetleriCalculator18InputSchema, type BulutApiAsimKisitlamaThrottlingVeSlaMaliyetleriCalculator18Input } from "./bulut-api-asim-kisitlama-throttling-ve-sla-maliyetleri-calculator-18-validation";

export const calculateBulutApiAsimKisitlamaThrottlingVeSlaMaliyetleriCalculator18Contract: any = {
  id: "bulut-api-asim-kisitlama-throttling-ve-sla-maliyetleri-calculator-18",
  version: "1.0.0",
  category: "cost",
  inputSchema: BulutApiAsimKisitlamaThrottlingVeSlaMaliyetleriCalculator18InputSchema,
  
  execute: async (input: any) => {
    try {
      // Destructure input with defaults to handle missing values
      const {
        totalReqs = 0,
        includedReqs = 0,
        overageRate = 0,
        throttleRate = 0,
        retryCost = 0,
        egressGb = 0,
        egressRate = 0,
        slaTarget = 0,
        actualUptime = 0,
        monthlyFee = 0
      } = input;

      // Formula: OverrunReqs = MAX(0, total_reqs - included_reqs)
      const overrunReqs = Math.max(0, totalReqs - includedReqs);

      // Formula: OverageCost = OverrunReqs * overage_rate
      const overageCost = overrunReqs * overageRate;

      // Formula: ThrottledReqs = total_reqs * (throttle_rate / 100)
      const throttledReqs = totalReqs * (throttleRate / 100);

      // Formula: ThrottlingCost = ThrottledReqs * retry_cost * 2.5
      // Factor 2.5 accounts for exponential backoff retry overhead
      const throttlingCost = throttledReqs * retryCost * 2.5;

      // Formula: EgressCost = egress_gb * egress_rate
      const egressCost = egressGb * egressRate;

      // Formula: SLAPenalty = IF(actual_uptime < sla_target, monthly_fee * 0.10, 0)
      // Standard industry SLA penalty: 10% of monthly fee per 1% below target
      const sLAPenalty = actualUptime < slaTarget ? monthlyFee * 0.10 : 0;

      // Formula: TotalCloudPenalty = OverageCost + ThrottlingCost + EgressCost - SLAPenalty
      const totalCloudPenalty = overageCost + throttlingCost + egressCost - sLAPenalty;

      return {
        overrunReqs: Math.round(overrunReqs * 100) / 100,
        overageCost: Math.round(overageCost * 100) / 100,
        throttledReqs: Math.round(throttledReqs * 100) / 100,
        throttlingCost: Math.round(throttlingCost * 100) / 100,
        egressCost: Math.round(egressCost * 100) / 100,
        sLAPenalty: Math.round(sLAPenalty * 100) / 100,
        totalCloudPenalty: Math.round(totalCloudPenalty * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};