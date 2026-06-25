import { z } from "zod";

export const StokastikMoqVeRafOmruDengeOptimizasyonuCalculator100InputSchema = z.object({
  annualDemand: z.number().min(0),
  orderCost: z.number().min(0),
  holdingRate: z.number().min(0),
  stdPrice: z.number().min(0),
  moqQty: z.number().min(0),
  moqPrice: z.number().min(0),
  shelfLifeDays: z.number().min(0),
  dailyDemand: z.number().min(0),
});

export type StokastikMoqVeRafOmruDengeOptimizasyonuCalculator100Input = z.infer<typeof StokastikMoqVeRafOmruDengeOptimizasyonuCalculator100InputSchema>;
