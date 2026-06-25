import { z } from "zod";

export const ColebrookwhiteIteratifBoruBasincKaybiDarcyweisbachCalculator130InputSchema = z.object({
  flowRate: z.number().min(0),
  pipeDia: z.number().min(0),
  pipeLen: z.number().min(0),
  roughnessEpsilon: z.number().min(0),
  fluidDensity: z.number().min(0),
  dynamicViscosity: z.number().min(0),
  sumMinorK: z.number().min(0),
  pumpEff: z.number().min(0),
});

export type ColebrookwhiteIteratifBoruBasincKaybiDarcyweisbachCalculator130Input = z.infer<typeof ColebrookwhiteIteratifBoruBasincKaybiDarcyweisbachCalculator130InputSchema>;
