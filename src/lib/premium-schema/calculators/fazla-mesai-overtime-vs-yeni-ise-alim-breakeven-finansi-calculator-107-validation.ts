import { z } from "zod";

export const FazlaMesaiOvertimeVsYeniIseAlimBreakevenFinansiCalculator107InputSchema = z.object({
  normalHourlyRate: z.number().min(0),
  otMultiplier: z.number().min(0),
  burdenRate: z.number().min(0),
  recruitmentCost: z.number().min(0),
  trainingWeeks: z.number().min(0),
  trainingProductivity: z.number().min(0),
  expectedMonthlyOt: z.number().min(0),
  fatigueDefectRate: z.number().min(0),
  costPerDefect: z.number().min(0),
  productionVolumePerHr: z.number().min(0),
});

export type FazlaMesaiOvertimeVsYeniIseAlimBreakevenFinansiCalculator107Input = z.infer<typeof FazlaMesaiOvertimeVsYeniIseAlimBreakevenFinansiCalculator107InputSchema>;
