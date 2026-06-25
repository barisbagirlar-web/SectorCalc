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
 * ID: MFG_279
 * Name: Sac Kesme Boşluğu (Punch/Die Clearance)
 */

export const InputSchema_MFG_279 = z.object({
  sac_kalinlik: z.number(),
  bosluk_miktari: z.number(),
  malzeme_tipi: z.enum(["Yumuşak (Alüminyum vb.)", "Orta (St37 vb.)", "Sert (Paslanmaz vb.)"]),
});

export type Input_MFG_279 = z.infer<typeof InputSchema_MFG_279>;

export interface Output_MFG_279 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_279(input: Input_MFG_279): Output_MFG_279 {
  const validData = InputSchema_MFG_279.parse(input);
  const { sac_kalinlik, bosluk_miktari, malzeme_tipi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if ((bosluk_miktari / sac_kalinlik) * 100 > 15) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Kesme Kalıbı Teorisi",
        message: "Uyarı: Kesme boşluğu sac kalınlığının %15'ini aşıyor. Parça kesilmekten ziyade yırtılacak, kenarlarda tehlikeli çapaklar (Burr) ve yüksek yuvarlatma (Rollover) oluşacaktır."
      });
    }

    if ((bosluk_miktari / sac_kalinlik) * 100 < 5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Kesme Kalıbı Teorisi",
        message: "Kritik Uyarı: Kesme boşluğu çok sıkı (%5'in altı). Kesme işlemi ikincil yırtılmalara (Secondary Shearing) neden olacak ve zımbada çok hızlı körelmeye (Tool Wear) yol açacaktır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
