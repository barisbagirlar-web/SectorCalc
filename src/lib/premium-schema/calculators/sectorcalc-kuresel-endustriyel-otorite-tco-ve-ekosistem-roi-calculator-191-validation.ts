import { z } from "zod";

export const SectorcalcKureselEndustriyelOtoriteTcoVeEkosistemRoiCalculator191InputSchema = z.object({
  legacySoftwareLicUsd: z.number().min(0),
  engineeringHoursSaved: z.number().min(0),
  hourlyEngineeringRate: z.number().min(0),
  scrapReductionValueYr: z.number().min(0),
  sectorcalcSubCostYr: z.number().min(0),
  implementationCapex: z.number().min(0),
  waccDiscountRate: z.number().min(0),
  evaluationHorizonYrs: z.number().min(0),
});

export type SectorcalcKureselEndustriyelOtoriteTcoVeEkosistemRoiCalculator191Input = z.infer<typeof SectorcalcKureselEndustriyelOtoriteTcoVeEkosistemRoiCalculator191InputSchema>;
