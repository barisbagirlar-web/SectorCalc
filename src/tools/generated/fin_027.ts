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
 * ID: FIN_027
 * Name: Öz Sermaye Maliyeti (CAPM)
 */

export const InputSchema_FIN_027 = z.object({
  risksiz_faiz: z.number(),
  beta: z.number(),
  piyasa_primi: z.number(),
});

export type Input_FIN_027 = z.infer<typeof InputSchema_FIN_027>;

export interface Output_FIN_027 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_027(input: Input_FIN_027): Output_FIN_027 {
  const validData = InputSchema_FIN_027.parse(input);
  const { risksiz_faiz, beta, piyasa_primi } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (beta < 0) {
      smartWarnings.push({
        severity: "INFO",
        source: "Portföy Yönetimi",
        message: "Not: Negatif Beta, hissenin/varlığın genel piyasa ile ters yönde hareket ettiği (örn: Altın madeni şirketleri) anlamına gelir. Çok nadir görülen bir durumdur."
      });
    }

    if (beta > 2) {
      smartWarnings.push({
        severity: "WARNING",
        source: "Piyasa Volatilitesi",
        message: "Uyarı: Beta > 2. Hisse, piyasa ortalamasından %100 daha fazla değişkendir; agresif büyüme hissesi (örn: teknoloji start-upları) profiline uyar."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
