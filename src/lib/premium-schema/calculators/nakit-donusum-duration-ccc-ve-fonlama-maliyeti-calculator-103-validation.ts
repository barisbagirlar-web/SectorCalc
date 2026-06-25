import { z } from "zod";

export const NakitDonusumDurationCccVeFonlamaMaliyetiCalculator103InputSchema = z.object({
  avgAr: z.number().min(0),
  avgAp: z.number().min(0),
  avgInv: z.number().min(0),
  cogs: z.number().min(0),
  annualRevenue: z.number().min(0),
  waccDaily: z.number().min(0),
  cashReserve: z.number().min(0),
});

export type NakitDonusumDurationCccVeFonlamaMaliyetiCalculator103Input = z.infer<typeof NakitDonusumDurationCccVeFonlamaMaliyetiCalculator103InputSchema>;
