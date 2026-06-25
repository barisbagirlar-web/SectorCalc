import { z } from "zod";

export const CncKilavuzCekmeTappingTorkuVeSenkronizasyonVdi3321Calculator113InputSchema = z.object({
  tapDia: z.number().min(0),
  pitch: z.number().min(0),
  kc: z.number().min(0),
  rpm: z.number().min(0),
  chuckTorqueLimit: z.number().min(0),
});

export type CncKilavuzCekmeTappingTorkuVeSenkronizasyonVdi3321Calculator113Input = z.infer<typeof CncKilavuzCekmeTappingTorkuVeSenkronizasyonVdi3321Calculator113InputSchema>;
