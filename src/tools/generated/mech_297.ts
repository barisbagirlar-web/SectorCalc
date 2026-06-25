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
 * ID: MECH_297
 * Name: Rulman Minimum Yük (Skidding) Kontrolü
 */

export const InputSchema_MECH_297 = z.object({
  dinamik_kapasite: z.number(),
  esdeger_yuk: z.number(),
  rulman_tipi: z.enum(["Bilyalı (Ball)", "Makaralı (Roller)"]),
});

export type Input_MECH_297 = z.infer<typeof InputSchema_MECH_297>;

export interface Output_MECH_297 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_297(input: Input_MECH_297): Output_MECH_297 {
  const validData = InputSchema_MECH_297.parse(input);
  const { dinamik_kapasite, esdeger_yuk, rulman_tipi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (rulman_tipi === 'Bilyalı (Ball)' && (esdeger_yuk / dinamik_kapasite) < 0.01) {
      smartWarnings.push({
        severity: "WARNING",
        source: "SKF Minimum Yük Kriteri",
        message: "Uyarı: Yük oranı çok düşük (< %1 C). Bilyeler iç/dış bilezik arasında yuvarlanmak yerine kızaklamaya (Skidding/Smearing) başlayacaktır. Rulmanda titreşim ve erken aşınma kaçınılmazdır."
      });
    }

    if (rulman_tipi === 'Makaralı (Roller)' && (esdeger_yuk / dinamik_kapasite) < 0.02) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "SKF Minimum Yük Kriteri",
        message: "Kritik Uyarı: Makaralı rulmanlar için minimum yük sınırı aşıldı (< %2 C). Makaralar kafes içinde kayarak yağ filmini yırtacak ve yatak yüzeyini anında bozacaktır. Rulmana ön yük (Preload) uygulayın."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
