import { z } from "zod";

export const SantrifujPompaKavitasyonVeNpshAnalysisApi610Calculator117InputSchema = z.object({
  atmPressure: z.number().min(0),
  vaporPressure: z.number().min(0),
  density: z.number().min(0),
  suctionHead: z.number().min(0),
  frictionLoss: z.number().min(0),
  npshR: z.number().min(0),
});

export type SantrifujPompaKavitasyonVeNpshAnalysisApi610Calculator117Input = z.infer<typeof SantrifujPompaKavitasyonVeNpshAnalysisApi610Calculator117InputSchema>;
