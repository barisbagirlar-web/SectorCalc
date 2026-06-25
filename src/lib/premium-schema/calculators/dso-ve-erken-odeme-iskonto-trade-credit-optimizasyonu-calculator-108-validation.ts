import { z } from "zod";

export const DsoVeErkenOdemeIskontoTradeCreditOptimizasyonuCalculator108InputSchema = z.object({
  annualRevenue: z.number().min(0),
  avgArBalance: z.number().min(0),
  wacc: z.number().min(0),
  discountPct: z.number().min(0),
  discountTerm: z.number().min(0),
  normalTerm: z.number().min(0),
  expectedTakeRate: z.number().min(0),
  defaultRate: z.number().min(0),
  collectionFeePct: z.number().min(0),
});

export type DsoVeErkenOdemeIskontoTradeCreditOptimizasyonuCalculator108Input = z.infer<typeof DsoVeErkenOdemeIskontoTradeCreditOptimizasyonuCalculator108InputSchema>;
