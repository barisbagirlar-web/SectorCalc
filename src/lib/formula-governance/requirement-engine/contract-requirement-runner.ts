export type ContractRequirementRunResult = { readonly missing: readonly string[] };

export function runContractRequirementEngine(): ContractRequirementRunResult {
  return { missing: [] };
}

export function auditContractRequirements(): { readonly ok: true } {
  return { ok: true };
}

export function runContractRequirementRunner(): ContractRequirementRunResult {
  return { missing: [] };
}

export function runRequirementEngineForContract(): ContractRequirementRunResult {
  return { missing: [] };
}
