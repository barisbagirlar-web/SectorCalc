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
 * ID: MECH_383
 * Name: Tel Halat (Wire Rope) Güvenlik Katsayısı
 */

export const InputSchema_MECH_383 = z.object({
  kopma_yuku: z.number(),
  maks_calisma_yuku: z.number(),
  kaldirma_tipi: z.enum(["Genel Yük Kaldırma", "Personel Taşıma (Asansör)"]),
});

export type Input_MECH_383 = z.infer<typeof InputSchema_MECH_383>;

export interface Output_MECH_383 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_383(input: Input_MECH_383): Output_MECH_383 {
  const validData = InputSchema_MECH_383.parse(input);
  const { kopma_yuku, maks_calisma_yuku, kaldirma_tipi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (kaldirma_tipi === 'Genel Yük Kaldırma' && (kopma_yuku / maks_calisma_yuku) < 5) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 4309 Vinç Halatları",
        message: "Kritik Güvenlik İhlali: Genel vinç uygulamalarında tel halat güvenlik katsayısı (FoS) 5'in altına inemez. Halatın dinamik şok yüklerinde veya hafif aşınmalarda aniden kopma riski vardır."
      });
    }

    if (kaldirma_tipi === 'Personel Taşıma (Asansör)' && (kopma_yuku / maks_calisma_yuku) < 10) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "EN 81 / OSHA",
        message: "Ölümcül İSG İhlali: İnsan taşıyan asansör/sepet uygulamalarında güvenlik katsayısı MİNİMUM 10 olmalıdır. Daha düşük bir oran yasal olarak suç teşkil eder ve halat kullanımına KESİNLİKLE izin verilemez."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
