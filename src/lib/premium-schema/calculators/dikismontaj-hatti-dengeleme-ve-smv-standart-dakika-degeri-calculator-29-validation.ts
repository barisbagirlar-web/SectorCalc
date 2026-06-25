import { z } from "zod";

export const DikismontajHattiDengelemeVeSmvStandartDakikaDegeriCalculator29InputSchema = z.object({
  taskSmvArray: z.number().min(0),
  shiftDurationMin: z.number().min(0),
  dailyTargetQty: z.number().min(0),
  actualOperators: z.number().min(0),
  laborRateHr: z.number().min(0),
});

export type DikismontajHattiDengelemeVeSmvStandartDakikaDegeriCalculator29Input = z.infer<typeof DikismontajHattiDengelemeVeSmvStandartDakikaDegeriCalculator29InputSchema>;
