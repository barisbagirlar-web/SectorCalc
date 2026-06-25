import { z } from "zod";

export const TemizOdaCleanroomIsoSinifiHavaDegisimiVeHepaOmruCalculator151InputSchema = z.object({
  roomVolume: z.number().min(0),
  isoClass: z.number().min(0),
  hepaFlowRate: z.number().min(0),
  pressureDropInitial: z.number().min(0),
  pressureDropFinal: z.number().min(0),
  dailyDustLoad: z.number().min(0),
  filterDustCapacity: z.number().min(0),
});

export type TemizOdaCleanroomIsoSinifiHavaDegisimiVeHepaOmruCalculator151Input = z.infer<typeof TemizOdaCleanroomIsoSinifiHavaDegisimiVeHepaOmruCalculator151InputSchema>;
