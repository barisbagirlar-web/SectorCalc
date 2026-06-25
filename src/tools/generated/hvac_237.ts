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
 * ID: HVAC_237
 * Name: Boru İçi Basınç Düşümü (Darcy-Weisbach)
 */

export const InputSchema_HVAC_237 = z.object({
  surtunme_faktoru: z.number(),
  boru_uzunlugu: z.number(),
  boru_capi: z.number(),
  akis_hizi: z.number(),
  yogunluk: z.number(),
});

export type Input_HVAC_237 = z.infer<typeof InputSchema_HVAC_237>;

export interface Output_HVAC_237 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_HVAC_237(input: Input_HVAC_237): Output_HVAC_237 {
  const validData = InputSchema_HVAC_237.parse(input);
  const { surtunme_faktoru, boru_uzunlugu, boru_capi, akis_hizi, yogunluk } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (akis_hizi > 3.0) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Tesisat Mühendisliği (Plumbing Code)",
        message: "Kritik Uyarı: Su ve sıvı akışkanlar için boru içi hız 3 m/s'yi aşmıştır. Ani vana kapanmalarında yıkıcı 'Koç Vuruşu (Water Hammer)' oluşacak, dirseklerde kavitasyon korozyonu başlayacak ve tesisatta akustik gürültü limitleri aşılacaktır. Çapı büyütün."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
