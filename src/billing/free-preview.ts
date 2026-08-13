/**
 * Free result preview — ENABLE_FREE_RESULT_PREVIEW.
 *
 * When ON, a non-entitled Tier-A user can edit inputs, calculate and read the
 * numeric outputs (worst-case / RSS / Monte Carlo). The report layer — sealed
 * PDF export, A1-A5 audit trail, report save/share — stays behind the credit
 * gate. Flag OFF restores the previous fully-locked behavior (rollback).
 */
export function freeResultPreviewEnabled(): boolean {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return String(env?.VITE_ENABLE_FREE_RESULT_PREVIEW || '').toLowerCase() === 'true';
}
