/**
 * SectorCalc Assistant — guardrails (P10).
 *
 * Hard limits enforced before any topic matching. The assistant must never
 * calculate, never reveal private data, and never bypass gates.
 */

export type GuardrailHit = "blockedFormula" | "blockedPrivate" | null;

const FORMULA_PATTERNS: readonly RegExp[] = [
  /\bformula\b/,
  /\bcalculate (it|this|that|for me|my)\b/,
  /\b(do|run|perform) (the )?(calculation|math)\b/,
  /\bcompute\b/,
  /\bsolve\b/,
  /\bwhat('?s| is) the (answer|result) (for|of)\b.*\d/,
  /\bcoefficient\b/,
];

const PRIVATE_PATTERNS: readonly RegExp[] = [
  /\b(api[ -]?key|secret|password|token|credential)\b/,
  /\b(other|another|someone else'?s) (user|account|report)\b/,
  /\b(database|firestore|admin panel|service account)\b/,
  /\bbypass (the )?(paywall|gate|subscription|pro)\b/,
  /\b(private|internal) (data|field)\b/,
];

export function checkGuardrails(message: string): GuardrailHit {
  const lower = message.toLowerCase();

  for (const pattern of PRIVATE_PATTERNS) {
    if (pattern.test(lower)) {
      return "blockedPrivate";
    }
  }

  for (const pattern of FORMULA_PATTERNS) {
    if (pattern.test(lower)) {
      return "blockedFormula";
    }
  }

  return null;
}
