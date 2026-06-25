import { z } from "zod";

export const KompresorHavaTankiReceiverBoyutlandirmaCalculator71InputSchema = z.object({
  compressorFlow: z.number().min(0),
  pMax: z.number().min(0),
  pMin: z.number().min(0),
  maxMotorStarts: z.number().min(0),
  surgeDemand: z.number().min(0),
  surgeDuration: z.number().min(0),
});

export type KompresorHavaTankiReceiverBoyutlandirmaCalculator71Input = z.infer<typeof KompresorHavaTankiReceiverBoyutlandirmaCalculator71InputSchema>;
