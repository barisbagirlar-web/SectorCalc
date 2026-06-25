import { z } from "zod";

export const OrganikRankineCevrimiOrcAtikIsiGeriKazanimiTcoVeKarbonKredisiCalculator188InputSchema = z.object({
  exhaustMassFlow: z.number().min(0),
  exhaustTempIn: z.number().min(0),
  exhaustTempOut: z.number().min(0),
  orcEfficiencyPct: z.number().min(0),
  opHoursYr: z.number().min(0),
  elecRate: z.number().min(0),
  carbonCreditPrice: z.number().min(0),
  orcCapex: z.number().min(0),
});

export type OrganikRankineCevrimiOrcAtikIsiGeriKazanimiTcoVeKarbonKredisiCalculator188Input = z.infer<typeof OrganikRankineCevrimiOrcAtikIsiGeriKazanimiTcoVeKarbonKredisiCalculator188InputSchema>;
