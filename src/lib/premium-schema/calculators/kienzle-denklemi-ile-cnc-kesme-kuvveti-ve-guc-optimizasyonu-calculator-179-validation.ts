import { z } from "zod";

export const KienzleDenklemiIleCncKesmeKuvvetiVeGucOptimizasyonuCalculator179InputSchema = z.object({
  feedF: z.number().min(0),
  depthAp: z.number().min(0),
  kc11Force: z.number().min(0),
  mcExponent: z.number().min(0),
  cuttingSpeedVc: z.number().min(0),
  efficiencyEta: z.number().min(0),
  spindlePowerLimit: z.number().min(0),
});

export type KienzleDenklemiIleCncKesmeKuvvetiVeGucOptimizasyonuCalculator179Input = z.infer<typeof KienzleDenklemiIleCncKesmeKuvvetiVeGucOptimizasyonuCalculator179InputSchema>;
