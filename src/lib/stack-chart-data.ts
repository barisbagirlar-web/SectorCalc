/**
 * Pure chart-data builders for SC-008. Return Number arrays: Chart.js canvas
 * rendering requires Number points. All upstream computation is Decimal; only
 * these pixel-bound values are Number (visualization, not audit precision).
 */
export interface HistBin { label: string; count: number; }

export function histogramBins(samples: number[], bins = 30): HistBin[] {
  if (samples.length === 0) return [];
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const width = (max - min) / bins || 1;
  const out: HistBin[] = Array.from({ length: bins }, (_, i) => ({
    label: (min + width * (i + 0.5)).toFixed(3), count: 0
  }));
  for (const s of samples) {
    let idx = Math.floor((s - min) / width);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    out[idx]!.count++;
  }
  return out;
}

export function paretoData(pareto: Array<{ name: string; pct: string }>): { labels: string[]; values: number[] } {
  return { labels: pareto.map((p) => p.name), values: pareto.map((p) => Number(p.pct)) };
}

export function compareData(worst: string, rss: string, mc: string): { labels: string[]; values: number[] } {
  return { labels: ['Worst-case', 'RSS', 'Monte Carlo'], values: [Number(worst), Number(rss), Number(mc)] };
}
