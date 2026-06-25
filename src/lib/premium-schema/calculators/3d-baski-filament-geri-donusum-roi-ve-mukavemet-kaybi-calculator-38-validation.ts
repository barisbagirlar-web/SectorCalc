import { z } from "zod";

export const ProTool3dBaskiFilamentGeriDonusumRoiVeMukavemetKaybiCalculator38InputSchema = z.object({
  virginPriceKg: z.number().min(0),
  scrapVolumeKg: z.number().min(0),
  recycleYieldPct: z.number().min(0),
  recycleCapex: z.number().min(0),
  processCostKg: z.number().min(0),
  tensileLossPct: z.number().min(0),
  qualityPenaltyRate: z.number().min(0),
  carbonCreditKg: z.number().min(0),
});

export type ProTool3dBaskiFilamentGeriDonusumRoiVeMukavemetKaybiCalculator38Input = z.infer<typeof ProTool3dBaskiFilamentGeriDonusumRoiVeMukavemetKaybiCalculator38InputSchema>;
