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
 * ID: MECH_351
 * Name: Kaplin ve Şaft Hizalama Toleransları
 */

export const InputSchema_MECH_351 = z.object({
  aci_kafikligi: z.number(),
  paralel_kaciklik: z.number(),
  motor_devri: z.number(),
});

export type Input_MECH_351 = z.infer<typeof InputSchema_MECH_351>;

export interface Output_MECH_351 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_351(input: Input_MECH_351): Output_MECH_351 {
  const validData = InputSchema_MECH_351.parse(input);
  const { aci_kafikligi, paralel_kaciklik, motor_devri } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (motor_devri > 1500 && paralel_kaciklik > 0.08) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "ISO 10816 Mekanik Titreşim Standartları",
        message: "Kritik Şaft Hizalama İhlali: 1500 RPM üzeri yüksek devirli millerde 0.08 mm üzerindeki paralel kaçıklık, kaplin üzerinde aşırı dinamik yüklere (Geri yük) neden olur. Sistemde yüksek vibrasyon üreterek rulmanları ve motor millerini kıracaktır; lazerli hizalama (Laser Alignment) ile kaçıklığı 0.04 mm altına indirin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
