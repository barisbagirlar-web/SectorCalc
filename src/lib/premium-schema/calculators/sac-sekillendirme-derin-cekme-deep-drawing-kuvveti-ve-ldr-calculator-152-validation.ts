import { z } from "zod";

export const SacSekillendirmeDerinCekmeDeepDrawingKuvvetiVeLdrCalculator152InputSchema = z.object({
  blankDia: z.number().min(0),
  punchDia: z.number().min(0),
  sheetThickness: z.number().min(0),
  uts: z.number().min(0),
  frictionCoeff: z.number().min(0),
  clearance: z.number().min(0),
});

export type SacSekillendirmeDerinCekmeDeepDrawingKuvvetiVeLdrCalculator152Input = z.infer<typeof SacSekillendirmeDerinCekmeDeepDrawingKuvvetiVeLdrCalculator152InputSchema>;
