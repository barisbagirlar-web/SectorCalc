import { z } from "zod";

export const RulmanOmruL10hVeGelistirilmisModifiyeOmurIso281Calculator109InputSchema = z.object({
  dynamicLoadC: z.number().min(0),
  equivLoadP: z.number().min(0),
  rpm: z.number().min(0),
  bearingType: z.number().min(0),
  reliabilityA1: z.number().min(0),
  viscosityRatioKappa: z.number().min(0),
  contaminationEc: z.number().min(0),
  fatigueLimitPu: z.number().min(0),
});

export type RulmanOmruL10hVeGelistirilmisModifiyeOmurIso281Calculator109Input = z.infer<typeof RulmanOmruL10hVeGelistirilmisModifiyeOmurIso281Calculator109InputSchema>;
