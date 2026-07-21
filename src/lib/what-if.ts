import { D } from '../core/engine.js';
import { calculate } from '../tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import type { StackInput } from '../tools/SC-008-tolerance-stack/v1.0.0/formula.js';

export interface WhatIfPoint { scale: number; cpk: string; ppm: string; }

/** Tolerance scale factors explored by the what-if engine. */
export const WHAT_IF_SCALES = [0.5, 0.75, 1, 1.25, 1.5];

/** What-if uses fewer runs for speed; it is exploratory, not the audit result. */
const WHAT_IF_ITERATIONS = 1000;

/**
 * Scale every component tolerance by each factor and recompute Cpk/PPM.
 * Tighter tolerances (scale < 1) should raise Cpk and lower PPM.
 */
export function whatIfToleranceScale(input: StackInput): WhatIfPoint[] {
  const fast: StackInput = { ...input, iterations: WHAT_IF_ITERATIONS };
  return WHAT_IF_SCALES.map((scale) => {
    const scaled: StackInput = {
      ...fast,
      components: fast.components.map((c) => ({ ...c, tol: D(c.tol).times(scale).toString() }))
    };
    const r = calculate(scaled);
    return { scale, cpk: r.cpk, ppm: r.ppm };
  });
}
