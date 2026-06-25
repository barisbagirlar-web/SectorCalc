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
 * ID: MECH_343
 * Name: Millerde Kritik Devir ve Eksenel Burkulma
 */

export const InputSchema_MECH_343 = z.object({
  mil_uzunlugu: z.number(),
  mil_capi: z.number(),
  eksenel_yuk: z.number(),
  elastisite_modulu: z.number(),
});

export type Input_MECH_343 = z.infer<typeof InputSchema_MECH_343>;

export interface Output_MECH_343 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_343(input: Input_MECH_343): Output_MECH_343 {
  const validData = InputSchema_MECH_343.parse(input);
  const { mil_uzunlugu, mil_capi, eksenel_yuk, elastisite_modulu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (eksenel_yuk > (3.14159 * 3.14159 * elastisite_modulu * (3.14159 * (mil_capi/2)*(mil_capi/2)*(mil_capi/2)*(mil_capi/2) / 4) / (mil_uzunlugu * mil_uzunlugu))) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Euler Burkulma Kriteri",
        message: "Kritik Yapısal Risk: Mile etki eden eksenel yük, elastik burkulma sınırını (Critical Buckling Load) aşmıştır. Mil çalışma esnasında bel verecek ve kalıcı olarak bükülerek sistemi kilitleyecektir."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
