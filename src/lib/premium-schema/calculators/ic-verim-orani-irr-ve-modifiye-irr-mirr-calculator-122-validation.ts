import { z } from "zod";

export const IcVerimOraniIrrVeModifiyeIrrMirrCalculator122InputSchema = z.object({
  initialInvestment: z.number().min(0),
  cashFlows: z.number().min(0),
  financeRate: z.number().min(0),
  reinvestRate: z.number().min(0),
  wacc: z.number().min(0),
});

export type IcVerimOraniIrrVeModifiyeIrrMirrCalculator122Input = z.infer<typeof IcVerimOraniIrrVeModifiyeIrrMirrCalculator122InputSchema>;
