import { z } from "zod";

export const SarfofisMalzemesiEoqVeTopluIskontoOptimizasyonuCalculator106InputSchema = z.object({
  monthlyQty: z.number().min(0),
  unitPrice: z.number().min(0),
  bulkDiscountPct: z.number().min(0),
  bulkMinQty: z.number().min(0),
  orderCost: z.number().min(0),
  holdingRate: z.number().min(0),
});

export type SarfofisMalzemesiEoqVeTopluIskontoOptimizasyonuCalculator106Input = z.infer<typeof SarfofisMalzemesiEoqVeTopluIskontoOptimizasyonuCalculator106InputSchema>;
