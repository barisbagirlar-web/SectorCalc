/**
 * SC-001 reference data. AWS D1.1 Table 2.1 minimum fillet weld leg sizes
 * are APPROXIMATE reference estimates for v1.0.0 (verify with the code edition
 * in force). stepInterpolate nodes: xs = material thickness breakpoints (mm),
 * ys = minimum fillet leg (mm). xs[0]=0 so any positive thickness resolves.
 */
import { Decimal } from '../../../core/engine.js';

export const FILLET_FACTOR = '0.707'; // cos(45deg): throat = leg * 0.707
export const BUTT_FACTOR = '1';

export const MIN_FILLET_LEG_XS: Decimal.Value[] = [0, 6, 12, 20];
export const MIN_FILLET_LEG_YS: Decimal.Value[] = [3, 5, 6, 8];

export const LOW_SAFETY_FACTOR = '1.5';
