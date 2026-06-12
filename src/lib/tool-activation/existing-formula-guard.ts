import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { BUSINESS_OPERATIONS_PRODUCTION_FORMULA_LOCATORS } from "@/lib/formula-governance/oracle/production-formula-locator";
import type { FormulaAction } from "./activation-types";

export type ExistingFormulaDetection = {
  hasFormulaContract: boolean;
  hasExistingFormulaExpression: boolean;
  formulaAction: FormulaAction;
  productionEntry?: string;
};

export function detectExistingFormula(slug: string): ExistingFormulaDetection {
  const contract = getFormulaContractBySlug(slug);
  const locator = BUSINESS_OPERATIONS_PRODUCTION_FORMULA_LOCATORS.find(
    (entry) => entry.slug === slug,
  );

  const hasFormulaContract = Boolean(contract);
  const hasExistingFormulaExpression = Boolean(
    locator?.productionEntry || contract?.requiredInputs.length,
  );

  if (hasFormulaContract || hasExistingFormulaExpression) {
    return {
      hasFormulaContract,
      hasExistingFormulaExpression,
      formulaAction: "preserve-existing",
      productionEntry: locator?.productionEntry,
    };
  }

  return {
    hasFormulaContract: false,
    hasExistingFormulaExpression: false,
    formulaAction: "create-new",
  };
}

export function assertFormulaDraftPolicy(
  slug: string,
  draft: { formulaAction: FormulaAction; formulaExpression?: string },
): string[] {
  const existing = detectExistingFormula(slug);
  const violations: string[] = [];

  if (existing.formulaAction === "preserve-existing") {
    if (draft.formulaAction !== "preserve-existing") {
      violations.push(
        `${slug}: existing FormulaContract/production formula detected; draft must set formulaAction to preserve-existing.`,
      );
    }

    if (draft.formulaExpression && draft.formulaExpression.trim()) {
      violations.push(
        `${slug}: AI cannot overwrite an existing formula expression in the first activation lock.`,
      );
    }
  }

  return violations;
}
