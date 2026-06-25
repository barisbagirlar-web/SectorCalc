import { z } from "zod";

export const PersonelDevirTurnoverMaliyetiVeRampupEtkisiCalculator17InputSchema = z.object({
  terminations: z.number().min(0),
  severanceAvg: z.number().min(0),
  vacancyDays: z.number().min(0),
  dailyRevenuePerEmp: z.number().min(0),
  recruitCost: z.number().min(0),
  onboardingHrs: z.number().min(0),
  trainerRate: z.number().min(0),
  rampupDays: z.number().min(0),
  rampupProductivity: z.number().min(0),
});

export type PersonelDevirTurnoverMaliyetiVeRampupEtkisiCalculator17Input = z.infer<typeof PersonelDevirTurnoverMaliyetiVeRampupEtkisiCalculator17InputSchema>;
