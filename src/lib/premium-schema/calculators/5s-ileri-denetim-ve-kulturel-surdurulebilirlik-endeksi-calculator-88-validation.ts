import { z } from "zod";

export const ProTool5sIleriDenetimVeKulturelSurdurulebilirlikEndeksiCalculator88InputSchema = z.object({
  seiriSort: z.number().min(0),
  seitonSet: z.number().min(0),
  seisoShine: z.number().min(0),
  seiketsuStandardize: z.number().min(0),
  shitsukeSustain: z.number().min(0),
  prevTotalScore: z.number().min(0),
});

export type ProTool5sIleriDenetimVeKulturelSurdurulebilirlikEndeksiCalculator88Input = z.infer<typeof ProTool5sIleriDenetimVeKulturelSurdurulebilirlikEndeksiCalculator88InputSchema>;
