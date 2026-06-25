import { z } from "zod";

export const TalaslamaTitresimChatterVeYuzeyPuruzluluguCalculator15InputSchema = z.object({
  vc: z.number().min(0),
  dTool: z.number().min(0),
  fz: z.number().min(0),
  z: z.number().min(0),
  rEpsilon: z.number().min(0),
  ap: z.number().min(0),
  chatterFactor: z.number().min(0),
  raLimit: z.number().min(0),
});

export type TalaslamaTitresimChatterVeYuzeyPuruzluluguCalculator15Input = z.infer<typeof TalaslamaTitresimChatterVeYuzeyPuruzluluguCalculator15InputSchema>;
