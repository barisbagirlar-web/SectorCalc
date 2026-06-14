export type DebtRegisterEntry = {
  readonly id: string;
  readonly category: string;
  readonly severity: string;
  readonly description: string;
};

export function buildDebtRegister(): readonly DebtRegisterEntry[] {
  return [];
}
