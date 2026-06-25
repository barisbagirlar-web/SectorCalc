import { z } from "zod";

export const DupontRoiAyristirmasiVeEkonomikKatmaDegerEvaCalculator134InputSchema = z.object({
  revenue: z.number().min(0),
  netIncome: z.number().min(0),
  ebit: z.number().min(0),
  totalAssets: z.number().min(0),
  totalEquity: z.number().min(0),
  taxRate: z.number().min(0),
  wacc: z.number().min(0),
});

export type DupontRoiAyristirmasiVeEkonomikKatmaDegerEvaCalculator134Input = z.infer<typeof DupontRoiAyristirmasiVeEkonomikKatmaDegerEvaCalculator134InputSchema>;
