import { D } from '../core/engine.js';
import type { StackResult } from '../tools/SC-008-tolerance-stack/v1.0.0/formula.js';

export type RiskLevel = 'CRITICAL' | 'WARNING' | 'PASS';
export interface RiskItem { level: RiskLevel; code: string; message: string; recommendation: string; }
export interface ReportData { verdict: string; cpk: string; ppm: string; riskAnalysis: RiskItem[]; insights: string[]; standards: string[]; }

/** Pure 360-degree report builder: risk analysis, actionable insights, standards. */
export function buildReportData(result: StackResult): ReportData {
  const cpk = D(result.cpk);
  const riskAnalysis: RiskItem[] = [];

  if (cpk.lt(1)) {
    riskAnalysis.push({ level: 'CRITICAL', code: 'CPK_CRITICAL', message: `Cpk = ${result.cpk} (< 1.0). Expected ~${result.ppm} PPM defect rate.`, recommendation: 'Tighten the dominant contributor (see contribution pareto) or widen the assembly spec.' });
  } else if (cpk.lt('1.33')) {
    riskAnalysis.push({ level: 'WARNING', code: 'CPK_MARGINAL', message: `Cpk = ${result.cpk} (< 1.33 target). ~${result.ppm} PPM expected.`, recommendation: 'Improve process capability; target Cpk >= 1.33 for normal production.' });
  } else {
    riskAnalysis.push({ level: 'PASS', code: 'CPK_CAPABLE', message: `Cpk = ${result.cpk} (>= 1.33). Process capable.`, recommendation: 'Maintain tolerances and monitor with SPC.' });
  }

  const worst = D(result.worstPlus);
  const rss = D(result.rssPlus);
  if (worst.gt(rss.times('1.5'))) {
    riskAnalysis.push({ level: 'WARNING', code: 'WORST_VS_RSS', message: `Worst-case (+/-${result.worstPlus}) is far wider than RSS (+/-${result.rssPlus}).`, recommendation: 'If contributors are independent, RSS/Monte Carlo is realistic; worst-case is conservative.' });
  }

  const insights: string[] = [];
  const top = result.pareto[0];
  if (top) insights.push(`Top contributor "${top.name}" drives ${top.pct}% of RSS variation — focus tolerance improvement there first.`);
  insights.push(`Monte Carlo (seed ${result.seed}, ${result.iterations} runs) estimates ${result.ppm} PPM; deterministic and reproducible for audit.`);
  if (cpk.lt('1.33')) insights.push('Consider SPC control charts on dimensions with Cpk < 1.33.');

  const standards: string[] = ['ASME Y14.5 — GD&T', 'ISO 286 — ISO tolerances', 'AIAG SPC — process capability (Cp/Cpk)'];

  return { verdict: cpk.gte('1.33') ? 'CAPABLE' : 'NOT CAPABLE', cpk: result.cpk, ppm: result.ppm, riskAnalysis, insights, standards };
}
