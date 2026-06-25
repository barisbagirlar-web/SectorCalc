import { z } from "zod";

export const SmedDarbogazKapasiteAcigaCikarmaCapacityReleaseRoiCalculator143InputSchema = z.object({
  currentSetupMin: z.number().min(0),
  targetSetupMin: z.number().min(0),
  setupsPerWeek: z.number().min(0),
  cycleTimeSec: z.number().min(0),
  unitMargin: z.number().min(0),
  isBottleneck: z.number().min(0),
});

export type SmedDarbogazKapasiteAcigaCikarmaCapacityReleaseRoiCalculator143Input = z.infer<typeof SmedDarbogazKapasiteAcigaCikarmaCapacityReleaseRoiCalculator143InputSchema>;
