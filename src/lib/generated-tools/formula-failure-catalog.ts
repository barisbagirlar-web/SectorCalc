export const FORMULA_FAILURE_CATEGORIES = [
  "DOUBLE_MATH_PREFIX",
  "UNBALANCED_PARENS",
  "PARSE_FAILURE",
  "MALFORMED_FUNCTION",
  "UNSUPPORTED",
  "UNKNOWN_IDENTIFIER",
  "INVALID_SEQUENCE",
  "STUB_SUM",
  "MALFORMED_CONDITIONAL",
  "TYPE_MISMATCH",
  "DIVISION_BY_ZERO_RISK",
] as const;

export type FormulaFailureCategory = (typeof FORMULA_FAILURE_CATEGORIES)[number];

export type CatalogedFailure = {
  readonly schemaSlug: string;
  readonly formulaKey: string;
  readonly category: FormulaFailureCategory | "UNKNOWN";
  readonly rawExpression: string;
  readonly detail: string;
};

export type FailureCatalog = {
  readonly entries: readonly CatalogedFailure[];
  readonly counts: Readonly<Record<string, number>>;
  readonly total: number;
};

/**
 * Thread-safe accumulator for formula compile failures across batch operations.
 */
export class FormulaFailureAccumulator {
  private failures: CatalogedFailure[] = [];

  add(
    schemaSlug: string,
    formulaKey: string,
    category: FormulaFailureCategory | "UNKNOWN",
    rawExpression: string,
    detail: string,
  ): void {
    this.failures.push({
      schemaSlug,
      formulaKey,
      category,
      rawExpression: rawExpression.slice(0, 200),
      detail,
    });
  }

  /**
   * Merge failures from another accumulator (for parallel processing).
   */
  merge(other: FormulaFailureAccumulator): void {
    this.failures.push(...other.failures);
  }

  snapshot(): FailureCatalog {
    const counts: Record<string, number> = {};
    for (const cat of FORMULA_FAILURE_CATEGORIES) {
      counts[cat] = 0;
    }
    counts["UNKNOWN"] = 0;

    for (const f of this.failures) {
      const key = f.category;
      counts[key] = (counts[key] ?? 0) + 1;
    }

    return {
      entries: [...this.failures],
      counts,
      total: this.failures.length,
    };
  }

  clear(): void {
    this.failures = [];
  }

  get length(): number {
    return this.failures.length;
  }

  /**
   * Export as JSON string for logging.
   */
  toJson(indent = 0): string {
    const snapshot = this.snapshot();
    return JSON.stringify(
      {
        total: snapshot.total,
        counts: snapshot.counts,
        entries: snapshot.entries,
      },
      null,
      indent,
    );
  }
}

export function createFailureAccumulator(): FormulaFailureAccumulator {
  return new FormulaFailureAccumulator();
}
