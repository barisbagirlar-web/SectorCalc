import { z } from "zod";

export const KonteynerYukBinPackingVeNavlunOptimizasyonuCalculator72InputSchema = z.object({
  containerL: z.number().min(0),
  containerW: z.number().min(0),
  containerH: z.number().min(0),
  maxPayload: z.number().min(0),
  palletL: z.number().min(0),
  palletW: z.number().min(0),
  palletH: z.number().min(0),
  palletWeight: z.number().min(0),
  maxStackLayers: z.number().min(0),
  freightCost: z.number().min(0),
});

export type KonteynerYukBinPackingVeNavlunOptimizasyonuCalculator72Input = z.infer<typeof KonteynerYukBinPackingVeNavlunOptimizasyonuCalculator72InputSchema>;
