import { z } from "zod";

export const Iec60364UcFazKabloKesitVeGerilimDusumuVoltageDropCalculator144InputSchema = z.object({
  loadKw: z.number().min(0),
  voltage: z.number().min(0),
  powerFactor: z.number().min(0),
  cableLength: z.number().min(0),
  crossSection: z.number().min(0),
  cableMaterial: z.number().min(0),
});

export type Iec60364UcFazKabloKesitVeGerilimDusumuVoltageDropCalculator144Input = z.infer<typeof Iec60364UcFazKabloKesitVeGerilimDusumuVoltageDropCalculator144InputSchema>;
