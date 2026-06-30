import { verifyFormulaSemantics } from "./semantic-formula-verifier";

/* ── Helpers ───────────────────────────────────────── */

function extractFormulaVariables(
  expression: string,
  inputIds: readonly string[],
): string[] {
  return inputIds.filter((id) => {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`).test(expression);
  });
}

/* ── FormulaRuntimeValidator ──────────────────────── */

type ValidationResult = "PASS" | "WARN" | "FAIL";

export class FormulaRuntimeValidator {
  private readonly cache = new Map<string, Set<string>>();

  addKnownGood(slug: string, formulaKey: string, inputIds: string[]): void {
    this.cache.set(`${slug}::${formulaKey}`, new Set(inputIds));
  }

  validateAtRuntime(
    slug: string,
    formulaKey: string,
    actualInputs: string[],
  ): ValidationResult {
    const knownGood = this.cache.get(`${slug}::${formulaKey}`);
    if (!knownGood) return "WARN";

    if (actualInputs.length === 0) return "FAIL";
    if (!actualInputs.every((id) => knownGood.has(id))) return "WARN";

    return "PASS";
  }
}

/* ── RuntimeGuard interface ───────────────────────── */

export interface RuntimeGuard {
  validate(input: Record<string, unknown>): { valid: boolean; warnings: string[] };
  sanitize(input: Record<string, unknown>): Record<string, unknown>;
  wrapCalculate(
    calculate: (input: Record<string, unknown>) => unknown,
    slug: string,
  ): (input: Record<string, unknown>) => unknown;
}

/* ── createRuntimeFormulaGuard ────────────────────── */

export function createRuntimeFormulaGuard(
  slug: string,
  formulas: Record<string, string>,
  inputIds: string[],
): RuntimeGuard {
  const expectedVars = new Set<string>();
  for (const expr of Object.values(formulas)) {
    for (const v of extractFormulaVariables(expr, inputIds)) {
      expectedVars.add(v);
    }
  }

  const isDev = process.env.NODE_ENV !== "production";

  return {
    validate(input: Record<string, unknown>): { valid: boolean; warnings: string[] } {
      const warnings: string[] = [];
      for (const name of expectedVars) {
        const val = input[name];
        if (val === undefined || val === null) {
          warnings.push(`Missing input "${name}"`);
        } else if (typeof val !== "number" || isNaN(val as number)) {
          warnings.push(`Non-numeric value for "${name}": ${JSON.stringify(val)}`);
        }
      }
      return { valid: warnings.length === 0, warnings };
    },

    sanitize(input: Record<string, unknown>): Record<string, unknown> {
      const safe: Record<string, unknown> = { ...input };
      for (const id of inputIds) {
        const val = safe[id];
        if (val === undefined || val === null || (typeof val === "number" && isNaN(val))) {
          safe[id] = 0;
        }
      }
      return safe;
    },

    wrapCalculate(
      calculate: (input: Record<string, unknown>) => unknown,
      calcSlug: string,
    ): (input: Record<string, unknown>) => unknown {
      return (input: Record<string, unknown>): unknown => {
        if (isDev) {
          const { warnings } = this.validate(input);
          if (warnings.length > 0) {
            console.warn(
              `[RuntimeGuard:${calcSlug}] ${warnings.length} validation warning(s):`,
              warnings,
            );
          }

          for (const [key, expr] of Object.entries(formulas)) {
            const issues = verifyFormulaSemantics(key, expr, inputIds);
            for (const issue of issues) {
              console.warn(
                `[RuntimeGuard:${calcSlug}] Semantic ${issue.severity}: ${issue.message}`,
              );
            }
          }
        }

        return calculate(input);
      };
    },
  };
}
