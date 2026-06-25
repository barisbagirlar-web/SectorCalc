import { z } from "zod";

export const CevreselAtikEsgVeDongusellikCostAnalysisCalculator33InputSchema = z.object({
  nonHazWasteT: z.number().min(0),
  hazWasteT: z.number().min(0),
  recycledWasteT: z.number().min(0),
  disposalFeeNonhaz: z.number().min(0),
  disposalFeeHaz: z.number().min(0),
  recycleRevenue: z.number().min(0),
  regulatoryFine: z.number().min(0),
  violationProb: z.number().min(0),
});

export type CevreselAtikEsgVeDongusellikCostAnalysisCalculator33Input = z.infer<typeof CevreselAtikEsgVeDongusellikCostAnalysisCalculator33InputSchema>;
