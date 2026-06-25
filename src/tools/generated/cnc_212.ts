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
 * ID: CNC_212
 * Name: Yüzey Pürüzlülüğü (Ra) Beklentisi
 */

export const InputSchema_CNC_212 = z.object({
  ilerleme: z.number(),
  uc_radyusu: z.number(),
});

export type Input_CNC_212 = z.infer<typeof InputSchema_CNC_212>;

export interface Output_CNC_212 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CNC_212(input: Input_CNC_212): Output_CNC_212 {
  const validData = InputSchema_CNC_212.parse(input);
  const { ilerleme, uc_radyusu } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

    if (ilerleme > uc_radyusu) {
      smartWarnings.push({
        severity: "CRITICAL",
        source: "Sandvik Coromant Talaşlı İmalat",
        message: "Kritik Uyarı: İlerleme hızı uç radyüsünden büyüktür. Kesici uç yüzeyi taramak yerine parçaya gömülecek ve yüzeyde adeta bir 'vida dişi' (Threading) formu oluşacaktır. İlerlemeyi düşürün veya radyüsü büyütün."
      });
    }

    if (ilerleme < (uc_radyusu * 0.05)) {
      smartWarnings.push({
        severity: "INFO",
        source: "Yüzey Baskısı (Wiper Etkisi)",
        message: "Not: İlerleme değeri uç radyüsüne göre çok düşük. Çeliği kesmekten ziyade 'ezmeye/sürtmeye' (Rubbing) başlayabilirsiniz; bu durum yüzey sertleşmesine ve takım ucunda aşırı ısınmaya yol açar."
      });
    }
  
  return {
    result: 0,
    smartWarnings
  };
}
