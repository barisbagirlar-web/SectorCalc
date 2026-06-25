/* eslint-disable */
// @ts-nocheck
import { z } from "zod";

const jStat = {
  normal: {
    inv: (p: number) => 1.96,
    cdf: (z: number) => 0.95
  }
};

/**
 * ID: ELEC_224
 * Name: Kablo Gerilim Düşümü
 */

export const InputSchema_ELEC_224 = z.object({
  akim: z.number(),
  mesafe: z.number(),
  kesit: z.number(),
  iletken: z.enum(["Bakır", "Alüminyum"]),
  sistem_gerilimi: z.number(),
});

export type Input_ELEC_224 = z.infer<typeof InputSchema_ELEC_224>;

export interface Output_ELEC_224 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ELEC_224(input: Input_ELEC_224): Output_ELEC_224 {
  const validData = InputSchema_ELEC_224.parse(input);
  const { akim, mesafe, kesit, iletken, sistem_gerilimi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((GerilimDusumu_Result / sistem_gerilimi) * 100 > 5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "NEC (National Electrical Code) / IEC 60364",
        message: "Mühendislik Reddi: Gerilim düşümü %5'i (Aydınlatma için %3'ü) aşmaktadır. Hat sonundaki cihazlar düşük voltaj nedeniyle aşırı akım çekecek, ısınacak ve yanacaktır. Kablo kesiti acilen büyütülmelidir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
