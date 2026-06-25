import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_030
 * Araç Adı: EBITDA
 */

export const InputSchema_FIN_030 = z.object({
  NetKar: z.number(),
  Faiz: z.number(),
  Vergi: z.number(),
  Amortisman: z.number(),
});

export type Input_FIN_030 = z.infer<typeof InputSchema_FIN_030>;

export interface Output_FIN_030 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_030(input: Input_FIN_030): Output_FIN_030 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: NetKar, Faiz, Vergi, Amortisman
  
  const validData = InputSchema_FIN_030.parse(input);
  
  // EBITDA = NetKar + Faiz + Vergi + Amortisman
  const result = validData.NetKar + validData.Faiz + validData.Vergi + validData.Amortisman; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  

  
  return {
    result,
    smartWarnings
  };
}