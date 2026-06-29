import { RULE_ENGINE_DB } from './mock-db';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface RuleAlert {
  severity: AlertSeverity;
  message: string;
  source: string;
}

export function evaluateCuttingParameters(inputs: Record<string, any>): RuleAlert[] {
  const alerts: RuleAlert[] = [];
  
  const material = inputs['material'] || inputs['Material'];
  const vc = inputs['vc'] || inputs['cutting_speed'] || inputs['Cutting_Speed'];
  const f = inputs['f'] || inputs['feed_rate'] || inputs['Feed_Rate'];
  
  if (material && (vc !== undefined || f !== undefined)) {
    // Attempt to match material with our DB
    let matchedMat: string | null = null;
    for (const mat of Object.keys(RULE_ENGINE_DB.cutting_parameters.sandvik_recommendations)) {
      if (typeof material === 'string' && material.toLowerCase().includes(mat.toLowerCase())) {
        matchedMat = mat;
        break;
      }
    }

    if (matchedMat) {
      const recs = (RULE_ENGINE_DB.cutting_parameters.sandvik_recommendations as any)[matchedMat];
      
      // Check Cutting Speed
      if (vc !== undefined) {
        if (vc > recs.vc_max * 1.2) {
          alerts.push({
            severity: 'CRITICAL',
            message: `vc = ${vc} m/min is well above Sandvik recommendation (${recs.vc_min}-${recs.vc_max}). TOOL BREAKAGE RISK.`,
            source: `Sandvik catalog for ${matchedMat}`
          });
        } else if (vc > recs.vc_max) {
          alerts.push({
            severity: 'WARNING',
            message: `vc = ${vc} m/min is near upper limit. Tool life may decrease.`,
            source: `Sandvik catalog for ${matchedMat}`
          });
        } else if (vc >= recs.vc_min && vc <= recs.vc_max) {
          alerts.push({
            severity: 'INFO',
            message: `vc = ${vc} m/min is optimal.`,
            source: `Sandvik catalog for ${matchedMat}`
          });
        }
      }

      // Check Feed Rate
      if (f !== undefined) {
        if (f > recs.f_max * 1.2) {
          alerts.push({
            severity: 'CRITICAL',
            message: `f = ${f} mm/rev exceeds recommended limit (${recs.f_min}-${recs.f_max}). Surface finish violation risk.`,
            source: `Sandvik catalog for ${matchedMat}`
          });
        }
      }
    }
  }

  return alerts;
}
