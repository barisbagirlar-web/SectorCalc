import { z } from "zod";

export const KiralamaVsSatinAlmaNetAvantajiNalCalculator124InputSchema = z.object({
  purchasePrice: z.number().min(0),
  loanInterestRate: z.number().min(0),
  assetLife: z.number().min(0),
  salvageValue: z.number().min(0),
  taxRate: z.number().min(0),
  annualLeasePayment: z.number().min(0),
  maintenanceSaved: z.number().min(0),
});

export type KiralamaVsSatinAlmaNetAvantajiNalCalculator124Input = z.infer<typeof KiralamaVsSatinAlmaNetAvantajiNalCalculator124InputSchema>;
