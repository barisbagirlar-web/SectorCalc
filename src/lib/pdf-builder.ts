/**
 * Pure PDF line builder. No jsPDF import — tested in node with full determinism.
 * The thin sc-pdf-button shell feeds these lines into jsPDF in the browser only.
 */
export interface PdfInput {
  toolCode: string;
  trueMonthlyCost: string;
  currency: string;
  costMultiplier: string;
  hiddenCostPct: string;
  breakdown: Array<{ item: string; amount: string; pct: string }>;
  warnings: Array<{ severity: string; message: string }>;
  steps: Array<{ step: number; description: string; result: string; formula?: string }>;
}

export interface PdfLine {
  text: string;
  style: 'title' | 'hero' | 'head' | 'body';
}

export function buildReportLines(input: PdfInput): PdfLine[] {
  const lines: PdfLine[] = [];
  lines.push({ style: 'title', text: `SectorCalc ${input.toolCode} — True Labor Cost Report` });
  lines.push({ style: 'hero', text: `${input.trueMonthlyCost} ${input.currency}` });
  lines.push({
    style: 'body',
    text: `Multiplier ${input.costMultiplier}x net · Hidden ${input.hiddenCostPct}%`
  });
  lines.push({ style: 'head', text: 'Breakdown' });
  for (const row of input.breakdown) {
    lines.push({ style: 'body', text: `${row.item}: ${row.amount} (${row.pct}%)` });
  }
  if (input.warnings.length > 0) {
    lines.push({ style: 'head', text: 'Warnings' });
    for (const w of input.warnings) {
      lines.push({ style: 'body', text: `[${w.severity}] ${w.message}` });
    }
  }
  lines.push({ style: 'head', text: 'Steps' });
  for (const s of input.steps) {
    lines.push({ style: 'body', text: `${s.step}. ${s.description} = ${s.result}` });
  }
  return lines;
}
