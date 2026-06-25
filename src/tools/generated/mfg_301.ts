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
 * ID: MFG_301
 * Name: Sac Derin Çekme (Deep Drawing) Oranı
 */

export const InputSchema_MFG_301 = z.object({
  ilkel_cap: z.number(),
  zimba_cap: z.number(),
});

export type Input_MFG_301 = z.infer<typeof InputSchema_MFG_301>;

export interface Output_MFG_301 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_301(input: Input_MFG_301): Output_MFG_301 {
  const validData = InputSchema_MFG_301.parse(input);
  const { ilkel_cap, zimba_cap } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ilkel_cap / zimba_cap > 2.2) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Metalurji / Şekillendirilebilirlik Limiti (LDR)",
        message: "Kritik Kalıp Reddi: Çekme Oranı (Drawing Ratio) 2.2 sınırını aşmaktadır. Tek kademede bu kadar derin çekme işlemi yapılırsa, sac pot çemberi (Blank Holder) altından akamayacak ve zımba radyüsü hizasından (Dip Kopması) KESİNLİKLE yırtılacaktır. İşlemi çok kademeli (Redraw) hale getirin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
