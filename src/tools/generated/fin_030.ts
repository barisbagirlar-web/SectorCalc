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
 * ID: FIN_030
 * Name: EBITDA
 */

export const InputSchema_FIN_030 = z.object({
  net_kar: z.number(),
  faiz: z.number(),
});

export type Input_FIN_030 = z.infer<typeof InputSchema_FIN_030>;

export interface Output_FIN_030 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_030(input: Input_FIN_030): Output_FIN_030 {
  const validData = InputSchema_FIN_030.parse(input);
  const { net_kar, faiz } = validData as any;
  

  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];

  
  return {
    result: 0,
    smartWarnings
  };
}
