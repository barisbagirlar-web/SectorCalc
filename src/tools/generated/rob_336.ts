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
 * ID: ROB_336
 * Name: Robotik TCP (Tool Center Point) Hızı
 */

export const InputSchema_ROB_336 = z.object({
  eksen_hizlari: z.number(),
  jacobiyen: z.number(),
});

export type Input_ROB_336 = z.infer<typeof InputSchema_ROB_336>;

export interface Output_ROB_336 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ROB_336(input: Input_ROB_336): Output_ROB_336 {
  const validData = InputSchema_ROB_336.parse(input);
  const { eksen_hizlari, jacobiyen } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (TCP_Hiz_Result > 250) {
      smartWarnings.push({
        severity: "WARNING",
        source: "ISO 10218-1 / ISO/TS 15066 (Cobot)",
        message: "İSG Uyarısı: TCP hızı 250 mm/s'yi aşmıştır. Bu sistem kafessiz (Fenceless) çalışan işbirlikçi bir robot (Cobot) ise, bu hız insan-robot çarpışmasında yasal biyo-mekanik acı sınırlarını aşar. Lazer alan tarayıcı (Safety Scanner) ile hız kesme zonu oluşturulmalıdır."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
