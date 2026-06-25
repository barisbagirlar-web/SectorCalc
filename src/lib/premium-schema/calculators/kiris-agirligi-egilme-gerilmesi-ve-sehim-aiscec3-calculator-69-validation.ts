import { z } from "zod";

export const KirisAgirligiEgilmeGerilmesiVeSehimAiscec3Calculator69InputSchema = z.object({
  profileArea: z.number().min(0),
  inertiaIx: z.number().min(0),
  sectionModulus: z.number().min(0),
  length: z.number().min(0),
  yieldStrength: z.number().min(0),
  distLoad: z.number().min(0),
  elasticModulus: z.number().min(0),
  density: z.number().min(0),
});

export type KirisAgirligiEgilmeGerilmesiVeSehimAiscec3Calculator69Input = z.infer<typeof KirisAgirligiEgilmeGerilmesiVeSehimAiscec3Calculator69InputSchema>;
