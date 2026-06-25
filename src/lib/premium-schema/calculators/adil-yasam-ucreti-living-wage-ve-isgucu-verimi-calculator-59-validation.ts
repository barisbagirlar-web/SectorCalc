import { z } from "zod";

export const AdilYasamUcretiLivingWageVeIsgucuVerimiCalculator59InputSchema = z.object({
  rentCost: z.number().min(0),
  foodCost: z.number().min(0),
  transportCost: z.number().min(0),
  healthEduCost: z.number().min(0),
  utilitiesMisc: z.number().min(0),
  adults: z.number().min(0),
  children: z.number().min(0),
  taxRate: z.number().min(0),
  workHoursWk: z.number().min(0),
  currentWage: z.number().min(0),
});

export type AdilYasamUcretiLivingWageVeIsgucuVerimiCalculator59Input = z.infer<typeof AdilYasamUcretiLivingWageVeIsgucuVerimiCalculator59InputSchema>;
