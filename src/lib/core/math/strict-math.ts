/**
 * SectorCalc — StrictMath Domain Safety Utilities
 *
 * Replaces all silent `return 0` on division-by-singularity patterns.
 * Instead of hiding the error, returns NaN so calling code is forced
 * to handle domain violations explicitly via isFiniteNumber checks.
 *
 * CFO sign-off requirement: every mathematical operation must be
 * auditable and failure-transparent. Silent zero hiding is forbidden.
 */

// ── Domain Error ──────────────────────────────────────────────────────────

export class MathDomainError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly operand: number,
  ) {
    super(`MathDomainError [${operation}]: ${message} (operand=${operand})`);
    this.name = "MathDomainError";
  }
}

// ── Type guard ────────────────────────────────────────────────────────────

export function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ── Strict division (never silently returns 0) ────────────────────────────

/**
 * Strict division — returns NaN instead of silently zeroing singularities.
 *
 * Policy:
 *   - If divisor is within epsilon of zero → returns NaN (domain violation).
 *   - If dividend or divisor is non-finite → returns NaN.
 *   - Never silently returns 0.
 *
 * This ensures that callers are forced to check results via isFiniteNumber(),
 * making every numeric failure visible in the audit log.
 */
export function strictDiv(n: number, d: number, epsilon: number = 1e-12): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(d)) return NaN;
  if (Math.abs(d) < epsilon) return NaN;
  return n / d;
}

// ── Strict multiplication (overflow guard) ────────────────────────────────

export function strictMul(n: number, m: number): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(m)) return NaN;
  const result = n * m;
  if (!isFiniteNumber(result)) return NaN;
  return result;
}

// ── Strict addition (overflow guard) ──────────────────────────────────────

export function strictAdd(n: number, m: number): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(m)) return NaN;
  const result = n + m;
  if (!isFiniteNumber(result)) return NaN;
  return result;
}

// ── Strict subtraction (overflow guard) ───────────────────────────────────

export function strictSub(n: number, m: number): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(m)) return NaN;
  const result = n - m;
  if (!isFiniteNumber(result)) return NaN;
  return result;
}

// ── Strict power ──────────────────────────────────────────────────────────

export function strictPow(base: number, exp: number): number {
  if (!isFiniteNumber(base) || !isFiniteNumber(exp)) return NaN;
  const result = Math.pow(base, exp);
  if (!isFiniteNumber(result)) return NaN;
  return result;
}
