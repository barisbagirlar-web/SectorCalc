import { z } from "zod";

export const LcoeBazliEndustriyelEnerjiDepolamaBessCostProjeksiyonuCalculator173InputSchema = z.object({
  bessCapex: z.number().min(0),
  annualOpex: z.number().min(0),
  batteryCapacityMwh: z.number().min(0),
  dodPct: z.number().min(0),
  roundTripEffPct: z.number().min(0),
  annualCycles: z.number().min(0),
  chargingCostMwh: z.number().min(0),
  batteryLifeYrs: z.number().min(0),
  wacc: z.number().min(0),
});

export type LcoeBazliEndustriyelEnerjiDepolamaBessCostProjeksiyonuCalculator173Input = z.infer<typeof LcoeBazliEndustriyelEnerjiDepolamaBessCostProjeksiyonuCalculator173InputSchema>;
