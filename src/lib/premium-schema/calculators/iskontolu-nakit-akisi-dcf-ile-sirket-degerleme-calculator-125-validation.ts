import { z } from "zod";

export const IskontoluNakitAkisiDcfIleSirketDegerlemeCalculator125InputSchema = z.object({
  ebitArray: z.number().min(0),
  taxRate: z.number().min(0),
  daArray: z.number().min(0),
  capexArray: z.number().min(0),
  nwcChangeArray: z.number().min(0),
  wacc: z.number().min(0),
  terminalGrowthRate: z.number().min(0),
  netDebt: z.number().min(0),
  dilutedShares: z.number().min(0),
});

export type IskontoluNakitAkisiDcfIleSirketDegerlemeCalculator125Input = z.infer<typeof IskontoluNakitAkisiDcfIleSirketDegerlemeCalculator125InputSchema>;
