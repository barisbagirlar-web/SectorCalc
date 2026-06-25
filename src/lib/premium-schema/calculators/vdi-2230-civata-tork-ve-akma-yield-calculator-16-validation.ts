import { z } from "zod";

export const Vdi2230CivataTorkVeAkmaYieldCalculator16InputSchema = z.object({
  dNom: z.number().min(0),
  pitch: z.number().min(0),
  muT: z.number().min(0),
  muB: z.number().min(0),
  dW: z.number().min(0),
  yieldStrength: z.number().min(0),
  targetPreload: z.number().min(0),
});

export type Vdi2230CivataTorkVeAkmaYieldCalculator16Input = z.infer<typeof Vdi2230CivataTorkVeAkmaYieldCalculator16InputSchema>;
