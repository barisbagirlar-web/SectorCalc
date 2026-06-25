import { z } from "zod";

export const PnomatikSilindirHavaTuketimiIso4414Calculator115InputSchema = z.object({
  boreDia: z.number().min(0),
  stroke: z.number().min(0),
  cyclesPerMin: z.number().min(0),
  workingPressure: z.number().min(0),
  deadVolumePct: z.number().min(0),
  specificPower: z.number().min(0),
  elecRate: z.number().min(0),
  annualHours: z.number().min(0),
});

export type PnomatikSilindirHavaTuketimiIso4414Calculator115Input = z.infer<typeof PnomatikSilindirHavaTuketimiIso4414Calculator115InputSchema>;
