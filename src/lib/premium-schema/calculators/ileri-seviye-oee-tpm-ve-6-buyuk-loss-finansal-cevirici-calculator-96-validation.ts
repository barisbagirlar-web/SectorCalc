import { z } from "zod";

export const IleriSeviyeOeeTpmVe6BuyukLossFinansalCeviriciCalculator96InputSchema = z.object({
  plannedTime: z.number().min(0),
  downtime: z.number().min(0),
  setupTime: z.number().min(0),
  idealCt: z.number().min(0),
  totalParts: z.number().min(0),
  goodParts: z.number().min(0),
  margin: z.number().min(0),
});

export type IleriSeviyeOeeTpmVe6BuyukLossFinansalCeviriciCalculator96Input = z.infer<typeof IleriSeviyeOeeTpmVe6BuyukLossFinansalCeviriciCalculator96InputSchema>;
