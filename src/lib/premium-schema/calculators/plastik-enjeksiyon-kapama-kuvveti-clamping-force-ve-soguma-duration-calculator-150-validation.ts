import { z } from "zod";

export const PlastikEnjeksiyonKapamaKuvvetiClampingForceVeSogumaDurationCalculator150InputSchema = z.object({
  projectedArea: z.number().min(0),
  cavityPressure: z.number().min(0),
  wallThickness: z.number().min(0),
  meltTemp: z.number().min(0),
  moldTemp: z.number().min(0),
  ejectionTemp: z.number().min(0),
  thermalDiffusivity: z.number().min(0),
  machineClampLimit: z.number().min(0),
});

export type PlastikEnjeksiyonKapamaKuvvetiClampingForceVeSogumaDurationCalculator150Input = z.infer<typeof PlastikEnjeksiyonKapamaKuvvetiClampingForceVeSogumaDurationCalculator150InputSchema>;
