import { z } from "zod";

export const MtbfMttrFinansalEtkiVeKestirimciBakimRoiCalculator101InputSchema = z.object({
  failureCount: z.number().min(0),
  opHours: z.number().min(0),
  totalRepairHrs: z.number().min(0),
  downtimeCostHr: z.number().min(0),
  avgPartsCost: z.number().min(0),
  repairLaborRate: z.number().min(0),
  pmInvestment: z.number().min(0),
  failureReductionPct: z.number().min(0),
});

export type MtbfMttrFinansalEtkiVeKestirimciBakimRoiCalculator101Input = z.infer<typeof MtbfMttrFinansalEtkiVeKestirimciBakimRoiCalculator101InputSchema>;
