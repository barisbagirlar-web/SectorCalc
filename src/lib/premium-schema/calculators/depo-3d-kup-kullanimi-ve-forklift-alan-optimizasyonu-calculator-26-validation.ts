import { z } from "zod";

export const Depo3dKupKullanimiVeForkliftAlanOptimizasyonuCalculator26InputSchema = z.object({
  bldgAreaM2: z.number().min(0),
  storageRatio: z.number().min(0),
  netHeightM: z.number().min(0),
  palletL: z.number().min(0),
  palletW: z.number().min(0),
  palletH: z.number().min(0),
  aisleWidth: z.number().min(0),
  rackLevels: z.number().min(0),
  clearanceH: z.number().min(0),
});

export type Depo3dKupKullanimiVeForkliftAlanOptimizasyonuCalculator26Input = z.infer<typeof Depo3dKupKullanimiVeForkliftAlanOptimizasyonuCalculator26InputSchema>;
