import { D } from '../core/engine.js';

export type RiskLevel = 'CRITICAL' | 'WARNING' | 'PASS';
export interface RiskItem { level: RiskLevel; message: string; recommendation: string; }
export interface ToolReport {
  verdict: string;
  metricName: string;
  metricValue: number;
  gaugeMax: number;
  direction: 'high' | 'low'; // high = higher is better (Cpk); low = lower is better (cost multiplier)
  warn: number;
  crit: number;
  riskAnalysis: RiskItem[];
  insights: string[];
  standards: string[];
}

export interface ReportConfig {
  metricName: string;
  metricValue: string;
  gaugeMax: number;
  direction: 'high' | 'low';
  warn: string; // warn threshold
  crit: string; // critical threshold
  insights: string[];
  standards: string[];
}

/** Generic 360-degree report builder. Direction-aware risk classification. */
export function buildToolReport(cfg: ReportConfig): ToolReport {
  const v = D(cfg.metricValue);
  const warn = D(cfg.warn);
  const crit = D(cfg.crit);
  const riskAnalysis: RiskItem[] = [];
  let verdict = 'PASS';

  const bad = cfg.direction === 'high' ? v.lt(warn) : v.gt(warn);
  const critical = cfg.direction === 'high' ? v.lt(crit) : v.gt(crit);

  if (critical) {
    riskAnalysis.push({ level: 'CRITICAL', message: `${cfg.metricName} = ${cfg.metricValue} is outside the safe envelope (${cfg.direction === 'high' ? '< ' + cfg.crit : '> ' + cfg.crit}).`, recommendation: 'Immediate correction required before release.' });
    verdict = 'NOT CAPABLE';
  } else if (bad) {
    riskAnalysis.push({ level: 'WARNING', message: `${cfg.metricName} = ${cfg.metricValue} is marginal (target ${cfg.direction === 'high' ? '>= ' + cfg.warn : '<= ' + cfg.warn}).`, recommendation: 'Monitor closely and improve the driving input.' });
    verdict = 'MARGINAL';
  } else {
    riskAnalysis.push({ level: 'PASS', message: `${cfg.metricName} = ${cfg.metricValue} is within specification.`, recommendation: 'No action required.' });
  }

  return {
    verdict,
    metricName: cfg.metricName,
    metricValue: Number(cfg.metricValue),
    gaugeMax: cfg.gaugeMax,
    direction: cfg.direction,
    warn: Number(cfg.warn),
    crit: Number(cfg.crit),
    riskAnalysis,
    insights: cfg.insights,
    standards: cfg.standards
  };
}
