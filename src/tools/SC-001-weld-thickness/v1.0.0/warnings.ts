import { D } from '../../../core/engine.js';
import type { WeldInputs, WeldResult } from './formula.js';
import { LOW_SAFETY_FACTOR } from './reference.js';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO' | 'TIP';
export interface Warning { code: string; severity: Severity; message: string; action: string; reference: string | null; }

export function evaluateWarnings(inputs: WeldInputs, result: WeldResult): Warning[] {
  const out: Warning[] = [];
  const throat = D(result.requiredThroatMm);
  const thickness = D(inputs.materialThicknessMm);
  const sf = D(inputs.safetyFactor);
  const joint: 'fillet' | 'butt' = inputs.jointType ?? 'fillet';

  if (throat.gt(thickness)) {
    out.push({
      code: 'THROAT_EXCEEDS_THICKNESS', severity: 'CRITICAL',
      message: `Required throat ${result.requiredThroatMm} mm exceeds material thickness ${thickness.toString()} mm — the weld cannot be stronger than the base metal.`,
      action: 'Increase material thickness, add weld length, or split the load across more welds.',
      reference: 'AWS D1.1 §2.4'
    });
  }

  if (sf.lt(LOW_SAFETY_FACTOR)) {
    out.push({
      code: 'LOW_SAFETY_FACTOR', severity: 'WARNING',
      message: `Safety factor ${sf.toString()} is below the ${LOW_SAFETY_FACTOR} common minimum for structural welds.`,
      action: 'Raise the safety factor unless a code-specific lower value is justified.',
      reference: 'AWS D1.1'
    });
  }

  if (joint === 'fillet') {
    out.push({
      code: 'FILLET_FACTOR_NOTE', severity: 'INFO',
      message: 'Fillet weld: throat = leg x 0.707 (45 deg). The reported leg already includes this factor.',
      action: 'Confirm the weld is a true 45 deg equal-leg fillet; skew fillets need a different factor.',
      reference: 'AWS D1.1 §2.3'
    });
  }

  out.push({
    code: 'WELD_INSIGHT', severity: 'TIP',
    message: `Use leg ${result.finalLegMm} mm (${result.finalLegIn} in); utilization ${result.utilization}. Governing: ${D(result.legFromLoadMm).gt(result.minLegMm) ? 'load' : 'code table'}.`,
    action: 'Feed weldStrength from the electrode data sheet (e.g. E7018 ~ 480 MPa).',
    reference: 'AWS A5.1'
  });

  return out;
}
