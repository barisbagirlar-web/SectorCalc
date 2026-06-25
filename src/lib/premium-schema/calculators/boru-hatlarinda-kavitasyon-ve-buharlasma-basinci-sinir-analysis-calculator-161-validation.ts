import { z } from "zod";

export const BoruHatlarindaKavitasyonVeBuharlasmaBasinciSinirAnalysisCalculator161InputSchema = z.object({
  staticPressureBar: z.number().min(0),
  fluidVelocityMS: z.number().min(0),
  fluidTempC: z.number().min(0),
  densityKgM3: z.number().min(0),
  vaporPressureBar: z.number().min(0),
});

export type BoruHatlarindaKavitasyonVeBuharlasmaBasinciSinirAnalysisCalculator161Input = z.infer<typeof BoruHatlarindaKavitasyonVeBuharlasmaBasinciSinirAnalysisCalculator161InputSchema>;
