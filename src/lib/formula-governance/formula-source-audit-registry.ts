export type FormulaSourceAuditStatus = {
  readonly standardReference: string;
  readonly checks: {
    readonly hasValidation: boolean;
    readonly hasTests: boolean;
  };
};

export function getFormulaSourceAuditStatus(_slug: string): FormulaSourceAuditStatus | null {
  return null;
}

export function hasFormulaSourceAudit(_slug: string): boolean {
  return false;
}
