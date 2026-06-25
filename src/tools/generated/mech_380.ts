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
 * ID: MECH_380
 * Name: Hidrolik Hortum Patlama Basıncı (Burst Pressure)
 */

export const InputSchema_MECH_380 = z.object({
  calisma_basinci: z.number(),
  hortum_patlama: z.number(),
  darbe_turu: z.enum(["Statik (Sabit Basınç)", "Dinamik (Ani Valf Aç/Kapa, Şok)"]),
});

export type Input_MECH_380 = z.infer<typeof InputSchema_MECH_380>;

export interface Output_MECH_380 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_380(input: Input_MECH_380): Output_MECH_380 {
  const validData = InputSchema_MECH_380.parse(input);
  const { calisma_basinci, hortum_patlama, darbe_turu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (darbe_turu === 'Dinamik (Ani Valf Aç/Kapa, Şok)' && (hortum_patlama / calisma_basinci) < 4) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SAE J517 Hidrolik Hortum Standartları",
        message: "Kritik İSG Uyarısı: Dinamik şoklar içeren sistemler (Örn: İş makineleri, presler) için Emniyet Katsayısı (Burst/Çalışma oranı) 4'ün altına inemez. Valflerin ani kapanması esnasında oluşan pik basınç (Surge/Spike) hortumu patlatarak ölümcül yağ enjeksiyonu yaralanmalarına yol açar."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
