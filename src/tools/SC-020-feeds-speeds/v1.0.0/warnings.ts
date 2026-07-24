import type { MachiningInputs, MachiningResult } from './formula.js';
import { D } from '../../../core/engine.js';

export type Severity = 'blocking' | 'warning' | 'note';
export interface Warning {
  code: string;
  severity: Severity;
  message: string;
  action: string;
}

export function evaluateWarnings(inputs: MachiningInputs, result: MachiningResult): Warning[] {
  const out: Warning[] = [];
  const pUtil = D(result.powerUtilPct);
  const tUtil = D(result.torqueUtilPct);
  const defl = D(result.deflectionUm);
  const life = D(result.toolLifeMin);
  const hm = D(result.hmMm);

  if (pUtil.gt(100) || tUtil.gt(100)) {
    out.push({
      code: 'SPINDLE_OVERLOAD',
      severity: 'blocking',
      message: `Predicted spindle load exceeds capacity (power ${result.powerUtilPct}%, torque ${result.torqueUtilPct}%).`,
      action: 'Reduce Vc, ae, or ap; or select a higher-power machine.'
    });
  } else if (pUtil.gt(85) || tUtil.gt(85)) {
    out.push({
      code: 'SPINDLE_NEAR_LIMIT',
      severity: 'warning',
      message: `Spindle utilization is high (power ${result.powerUtilPct}%, torque ${result.torqueUtilPct}%).`,
      action: 'Leave headroom for transient spikes; verify actual load meter on first cut.'
    });
  }

  if (defl.gt(100)) {
    out.push({
      code: 'DEFLECTION_CRITICAL',
      severity: 'blocking',
      message: `Predicted tool deflection ${result.deflectionUm} um exceeds 100 um.`,
      action: 'Shorten stick-out, increase diameter, or reduce radial engagement.'
    });
  } else if (defl.gt(50)) {
    out.push({
      code: 'DEFLECTION_HIGH',
      severity: 'warning',
      message: `Predicted tool deflection ${result.deflectionUm} um is above 50 um.`,
      action: 'Check wall thickness and finish tolerance; consider stub length tooling.'
    });
  }

  if (life.lt(1)) {
    out.push({
      code: 'TOOL_LIFE_CRITICAL',
      severity: 'blocking',
      message: `Predicted tool life ${result.toolLifeMin} min is below 1 minute.`,
      action: 'Lower Vc or improve coolant / reduce interruption severity.'
    });
  } else if (life.lt(5)) {
    out.push({
      code: 'TOOL_LIFE_SHORT',
      severity: 'warning',
      message: `Predicted tool life ${result.toolLifeMin} min is short for production.`,
      action: 'Revisit grade/coating or reduce cutting speed toward Gilbert optimum.'
    });
  }

  if (hm.lt('0.01')) {
    out.push({
      code: 'CHIP_TOO_THIN',
      severity: 'warning',
      message: `Mean chip thickness ${result.hmMm} mm is very thin — risk of rubbing.`,
      action: 'Increase fz or use chip-thinning compensation (already applied to Vf_comp).'
    });
  }

  out.push({
    code: 'REFERENCE_CONSTANTS',
    severity: 'note',
    message: 'ISO 513 kc1/mc and Taylor C/n are mid-band reference values, not measured data.',
    action: 'Calibrate against tooling-supplier datasheets before contract or production approval.'
  });

  out.push({
    code: 'ENGINEERING_PREVIEW',
    severity: 'note',
    message: 'Outputs are predicted from stated assumptions.',
    action: 'Not for production approval; not a substitute for measured data or a licensed engineer.'
  });

  void inputs;
  return out;
}
