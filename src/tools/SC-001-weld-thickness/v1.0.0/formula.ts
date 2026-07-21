/**
 * SC-001 Weld Thickness Calculator — built ON the universal engine.
 * Version 1.0.0. Deterministic, Decimal-only, pure.
 * This is the first tool that exercises Quantity + unit-converter + interpolate:
 * the leg is wrapped as a dimensional quantity and converted mm -> in, and the
 * minimum leg comes from a step-interpolated AWS D1.1 table. No conservation
 * law here (single-result tool); locked instead by monotonicity + dimensions.
 */
import { D, Decimal } from '../../../core/engine.js';
import { CalcError, requirePositive } from '../../../core/guards.js';
import { roundHalfUp } from '../../../core/rounding.js';
import { qty, qconvert } from '../../../core/quantity.js';
import { stepInterpolate } from '../../../core/interpolate.js';
import { FILLET_FACTOR, BUTT_FACTOR, MIN_FILLET_LEG_XS, MIN_FILLET_LEG_YS } from './reference.js';

const PLACES = 2;
function mm(d: Decimal): string { return roundHalfUp(d, PLACES).toFixed(PLACES); }

export interface WeldInputs {
  designLoadN: Decimal.Value;
  weldLengthMm: Decimal.Value;
  weldStrengthMpa: Decimal.Value;
  safetyFactor: Decimal.Value;
  materialThicknessMm: Decimal.Value;
  jointType?: 'fillet' | 'butt';
}

export interface Step { step: number; description: string; formula: string; result: string; }
export interface WeldResult {
  finalLegMm: string;
  finalLegIn: string;
  requiredThroatMm: string;
  minLegMm: string;
  legFromLoadMm: string;
  utilization: string;
  jointType: 'fillet' | 'butt';
  steps: Step[];
}

export function calculate(inputs: WeldInputs): WeldResult {
  const steps: Step[] = [];
  let n = 0;
  const joint: 'fillet' | 'butt' = inputs.jointType ?? 'fillet';
  const factor = D(joint === 'fillet' ? FILLET_FACTOR : BUTT_FACTOR);

  // designLoad may legitimately be 0 (degenerate); allow it but keep guards on the divisors.
  const loadD = D(inputs.designLoadN);
  if (loadD.lt(0)) throw new CalcError('E_NEGATIVE', 'designLoadN must be >= 0');
  const length = requirePositive(inputs.weldLengthMm, 'weldLengthMm');
  const strength = requirePositive(inputs.weldStrengthMpa, 'weldStrengthMpa');
  const sf = requirePositive(inputs.safetyFactor, 'safetyFactor');
  const thickness = requirePositive(inputs.materialThicknessMm, 'materialThicknessMm');

  // 1. allowable shear
  const allowable = strength.div(sf);
  steps.push({ step: ++n, description: 'Allowable shear stress', formula: `weldStrength / safetyFactor = ${strength.toString()} / ${sf.toString()}`, result: mm(allowable) });

  // 2. required throat (degenerate-safe: load 0 -> throat 0, no divide-by-zero)
  const requiredThroat = loadD.div(length.times(allowable));
  steps.push({ step: ++n, description: 'Required throat from load', formula: 'designLoad / (weldLength * allowable)', result: mm(requiredThroat) });

  // 3. leg from load
  const legFromLoad = requiredThroat.div(factor);
  steps.push({ step: ++n, description: `Leg from load (${joint})`, formula: `requiredThroat / ${factor.toString()}`, result: mm(legFromLoad) });

  // 4. minimum leg from AWS D1.1 table (step interpolation)
  const minLeg = stepInterpolate(MIN_FILLET_LEG_XS, MIN_FILLET_LEG_YS, thickness);
  steps.push({ step: ++n, description: 'Minimum leg from table', formula: 'stepInterpolate(AWS D1.1, thickness)', result: mm(minLeg) });

  // 5. final leg = governing of the two
  const finalLeg = legFromLoad.gt(minLeg) ? legFromLoad : minLeg;
  steps.push({ step: ++n, description: 'Final leg (governing)', formula: 'max(legFromLoad, minLeg)', result: mm(finalLeg) });

  // 6. dimensional output: wrap as Quantity and convert mm -> in (exercises engine)
  const legQty = qty(finalLeg, 'mm', 'length');
  const legInQty = qconvert(legQty, 'in');
  // finalLeg > 0 is guaranteed by the table (min leg >= 3), so no zero-guard needed.
  const utilization = requiredThroat.div(finalLeg.times(factor));

  return {
    finalLegMm: mm(finalLeg),
    finalLegIn: mm(legInQty.value),
    requiredThroatMm: mm(requiredThroat),
    minLegMm: mm(minLeg),
    legFromLoadMm: mm(legFromLoad),
    utilization: roundHalfUp(utilization, 3).toFixed(3),
    jointType: joint,
    steps
  };
}
