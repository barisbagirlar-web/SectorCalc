import { D } from '../core/engine.js';
import { calculateTool } from '../engine-api/client.js';
import type { StackInput } from '../engine-api/types.js';

export interface WhatIfPoint {
  scale: number;
  cpk: string;
  ppm: string;
}

/** Tolerance scale factors explored by the what-if engine. */
export const WHAT_IF_SCALES = [0.5, 0.75, 1, 1.25, 1.5];

/** What-if uses fewer runs for speed; it is exploratory, not the audit result. */
const WHAT_IF_ITERATIONS = 1000;

/**
 * Scale every component tolerance by each factor and recompute Cpk/PPM via the private engine API.
 * Tighter tolerances (scale < 1) should raise Cpk and lower PPM.
 */
export async function whatIfToleranceScale(input: StackInput): Promise<WhatIfPoint[]> {
  const fast: StackInput = { ...input, iterations: WHAT_IF_ITERATIONS };
  const points: WhatIfPoint[] = [];
  for (const scale of WHAT_IF_SCALES) {
    const scaled: StackInput = {
      ...fast,
      components: fast.components.map((c) => ({
        ...c,
        tol: D(c.tol).times(scale).toString()
      }))
    };
    const response = await calculateTool('SC-008', scaled);
    points.push({ scale, cpk: response.result.cpk, ppm: response.result.ppm });
  }
  return points;
}
