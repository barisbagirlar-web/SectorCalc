import { z } from "zod";

export const Iso142531MetrolojikDecisionKurallariVeKorumaliBantCalculator177InputSchema = z.object({
  nominalDimension: z.number().min(0),
  upperSpecLimitUsl: z.number().min(0),
  lowerSpecLimitLsl: z.number().min(0),
  measuredValue: z.number().min(0),
  expandedUncertaintyU: z.number().min(0),
});

export type Iso142531MetrolojikDecisionKurallariVeKorumaliBantCalculator177Input = z.infer<typeof Iso142531MetrolojikDecisionKurallariVeKorumaliBantCalculator177InputSchema>;
