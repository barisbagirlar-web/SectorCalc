import { z } from "zod";

export const Iso50001EnerjiReferansCizgisiEnbModeliCalculator121InputSchema = z.object({
  rSquared: z.number().min(0),
  pValue: z.number().min(0),
  actualEnergy: z.number().min(0),
  modeledEnergy: z.number().min(0),
  reductionTarget: z.number().min(0),
  energyTariff: z.number().min(0),
});

export type Iso50001EnerjiReferansCizgisiEnbModeliCalculator121Input = z.infer<typeof Iso50001EnerjiReferansCizgisiEnbModeliCalculator121InputSchema>;
