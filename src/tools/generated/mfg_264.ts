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
 * ID: MFG_264
 * Name: Kaynak Teli/Elektrot Tüketimi
 */

export const InputSchema_MFG_264 = z.object({
  kaynak_boyu: z.number(),
  kesit_alani: z.number(),
  verim: z.number(),
});

export type Input_MFG_264 = z.infer<typeof InputSchema_MFG_264>;

export interface Output_MFG_264 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MFG_264(input: Input_MFG_264): Output_MFG_264 {
  const validData = InputSchema_MFG_264.parse(input);
  const { kaynak_boyu, kesit_alani, verim } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (verim < 60) {
      smartWarnings.push({
        severity: "INFO",
        source: "AWS D1.1 Kaynak Ekonomisi",
        message: "Bilgi: Yığma verimi %60'ın altındadır (Muhtemelen Örtülü Elektrot / SMAW kullanıyorsunuz). Kaynak cürufu, sıçrantı ve elektrot dip izmariti nedeniyle satın aldığınız sarf malzemenin %40'ından fazlası israf olacaktır; tel sürmeli (MIG/MAG) yöntemleri değerlendirin."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
