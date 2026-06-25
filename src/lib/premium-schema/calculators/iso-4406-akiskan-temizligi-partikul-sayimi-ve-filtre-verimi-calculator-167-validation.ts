import { z } from "zod";

export const Iso4406AkiskanTemizligiPartikulSayimiVeFiltreVerimiCalculator167InputSchema = z.object({
  particles4um: z.number().min(0),
  particles6um: z.number().min(0),
  particles14um: z.number().min(0),
  filterBetaX: z.number().min(0),
  targetIsoCode: z.number().min(0),
});

export type Iso4406AkiskanTemizligiPartikulSayimiVeFiltreVerimiCalculator167Input = z.infer<typeof Iso4406AkiskanTemizligiPartikulSayimiVeFiltreVerimiCalculator167InputSchema>;
