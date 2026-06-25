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
 * ID: ELEC_231
 * Name: Eşdeğer Direnç (Seri/Paralel)
 */

export const InputSchema_ELEC_231 = z.object({
  direncler: z.number(),
  baglanti_tipi: z.enum(["Seri", "Paralel"]),
});

export type Input_ELEC_231 = z.infer<typeof InputSchema_ELEC_231>;

export interface Output_ELEC_231 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ELEC_231(input: Input_ELEC_231): Output_ELEC_231 {
  const validData = InputSchema_ELEC_231.parse(input);
  const { direncler, baglanti_tipi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (baglanti_tipi === 'Paralel' && (MAX(direncler) / MIN(direncler)) > 1000) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Devre Tasarım Mantığı",
        message: "Uyarı: Paralel bağlı dirençler arasında 1000 kattan fazla fark var. Elektrik akımı her zaman en düşük dirençli yolu seçeceği için, büyük olan direncin devreye hiçbir etkisi kalmayacaktır (Açık devre gibi davranır). Tasarımı gözden geçirin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
