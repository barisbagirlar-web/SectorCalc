/**
 * Strict number parse for calculator UIs.
 * Rejects decimal-comma locales ("10,5") and empty/NaN/Infinity.
 */
export function parseLocaleNumber(raw: unknown, label = 'value'): number {
  if (raw === null || raw === undefined) {
    throw new Error(`${label} is empty`);
  }
  const s = String(raw).trim();
  if (s === '') throw new Error(`${label} is empty`);
  if (s.includes(',')) {
    throw new Error(`${label} uses a decimal comma — enter with a point (e.g. 10.5)`);
  }
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(s)) {
    throw new Error(`${label} is not a number`);
  }
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error(`${label} is not finite`);
  return n;
}

/** Soft parse for controlled inputs: empty → NaN (caller validates). Rejects commas. */
export function parseInputNumber(raw: unknown): number {
  if (raw === null || raw === undefined) return NaN;
  const s = String(raw).trim();
  if (s === '') return NaN;
  if (s.includes(',')) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}
