import { z } from "zod";

export const MultiProductBreakevenBreakevenVeDolAnalysisCalculator11InputSchema = z.object({
  fixedCosts: z.number().min(0),
  targetProfit: z.number().min(0),
  taxRate: z.number().min(0),
  productPrices: z.number().min(0),
  productVcosts: z.number().min(0),
  productMix: z.number().min(0),
  actualVolume: z.number().min(0),
});

export type MultiProductBreakevenBreakevenVeDolAnalysisCalculator11Input = z.infer<typeof MultiProductBreakevenBreakevenVeDolAnalysisCalculator11InputSchema>;
