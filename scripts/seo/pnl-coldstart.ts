import { readFileSync } from 'node:fs';
import { coldStartContract, structuralBreakJoinAllowed, validateArtifactEnvelope, validateMoneyMinor } from '../../seo/v6-conformance.mjs';

type PnlArtifact = {
  meta: { coldStart: boolean; confidence: string; inputWindow: { observedDays: number }; structuralBreaksApplied: string[] };
  measurementAvailable: boolean;
  incrementality: { status: string; claimPublished: boolean };
  generativeAi: { includedInRevenueFormula: boolean };
};

export function validateColdStartPnl(artifact: PnlArtifact, requiredWindowDays: number): string[] {
  const errors = [
    ...validateArtifactEnvelope(artifact),
    ...validateMoneyMinor(artifact),
  ];
  if (!coldStartContract(artifact.meta.inputWindow.observedDays, artifact.meta, requiredWindowDays)) errors.push('cold-start-contract');
  if (!artifact.measurementAvailable && artifact.incrementality.claimPublished) errors.push('incrementality-without-data');
  if (artifact.generativeAi.includedInRevenueFormula) errors.push('generative-ai-in-revenue-formula');
  return errors;
}

export function assertStructuralBreakSafe(artifact: unknown, rows: Array<{ date: string }>, breakDate: string): void {
  if (!structuralBreakJoinAllowed(artifact, rows, breakDate)) throw new Error(`STRUCTURAL_BREAK_JOIN_BLOCK ${breakDate}`);
}

if (process.argv[1]?.endsWith('pnl-coldstart.ts')) {
  const config = JSON.parse(readFileSync('sites/sectorcalc/seo.config.json', 'utf8')) as { measurement: { defaultWindowDays: number } };
  const artifact = JSON.parse(readFileSync('data/seo/pnl.json', 'utf8')) as PnlArtifact;
  const errors = validateColdStartPnl(artifact, config.measurement.defaultWindowDays);
  if (errors.length) {
    console.error(`[FAIL] pnl cold-start: ${errors.join(', ')}`);
    process.exit(1);
  }
  console.log('[PASS] pnl cold-start: partial=true confidence=low; no unsupported effect/revenue claims');
}
