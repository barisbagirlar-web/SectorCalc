import { z } from "zod";

export const B2bSaasFiyatEsnekligiNetMrrRetentionVeBuyumeHiziCalculator154InputSchema = z.object({
  startingMrr: z.number().min(0),
  newMrr: z.number().min(0),
  expansionMrr: z.number().min(0),
  churnMrr: z.number().min(0),
  contractionMrr: z.number().min(0),
  priceIncreasePct: z.number().min(0),
  priceElasticity: z.number().min(0),
});

export type B2bSaasFiyatEsnekligiNetMrrRetentionVeBuyumeHiziCalculator154Input = z.infer<typeof B2bSaasFiyatEsnekligiNetMrrRetentionVeBuyumeHiziCalculator154InputSchema>;
