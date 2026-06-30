/**
 * Decision language guard — prevents over-confident claims vs formula strength.
 */

import type { AuditFinding, FormulaContract } from "@/lib/features/formula-governance/types";

const OVERCONFIDENT_PHRASES = [
  "guaranteed",
  "always buy",
  "always rent",
  "you should buy",
  "you should rent",
  "definitely",
  "certain profit",
  "risk-free",
  "approved",
  "certified verdict",
] as const;

export function auditDecisionLanguage(contract: FormulaContract): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const blob = [contract.purpose, contract.userDecision, contract.formulaSummary]
    .join(" ")
    .toLowerCase();

  for (const phrase of OVERCONFIDENT_PHRASES) {
    if (blob.includes(phrase)) {
      findings.push({
        code: "LANG_OVERCONFIDENT",
        severity: "blocker",
        message: `Decision language contains over-confident phrase: "${phrase}"`,
      });
    }
  }

  for (const rule of contract.decisionLanguageRules) {
    for (const forbidden of rule.forbiddenPhrases ?? []) {
      if (blob.includes(forbidden.toLowerCase())) {
        findings.push({
          code: "LANG_FORBIDDEN",
          severity: "blocker",
          message: `Forbidden claim detected: "${forbidden}"`,
        });
      }
    }
  }

  const requiresDisclaimer = contract.decisionLanguageRules.some((r) => r.requiredDisclaimer);
  if (requiresDisclaimer) {
    const hasDisclaimerAssumption = contract.assumptions.some((a) =>
      /not financial|simulation|verify|advice|estimate/i.test(a),
    );
    if (!hasDisclaimerAssumption) {
      findings.push({
        code: "LANG_NO_DISCLAIMER",
        severity: "blocker",
        message: "Decision-language rules require a disclaimer in contract assumptions.",
      });
    }
  }

  return findings;
}

export function hasDecisionDisclaimer(contract: FormulaContract): boolean {
  const fromRules = contract.decisionLanguageRules.some((r) => r.requiredDisclaimer);
  const fromAssumptions = contract.assumptions.some((a) =>
    /not financial|simulation|verify|advice|estimate/i.test(a),
  );
  return fromRules && fromAssumptions;
}

export function auditPurposeFormulaAlignment(contract: FormulaContract): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const purpose = contract.purpose.toLowerCase();
  const summary = contract.formulaSummary.toLowerCase();

  if (purpose.includes("rent") && purpose.includes("buy")) {
    const hasMortgage = /mortgage|interest/i.test(summary);
    const hasAppreciation = /appreciation|equity/i.test(summary);
    const mentionsRentCost = /(total|cumulative)\s+rent|rent paid/i.test(summary);
    const mentionsHomePrice = /home price|purchase price|home purchase/i.test(summary);
    const onlySimpleCompare =
      mentionsRentCost && mentionsHomePrice && !hasMortgage && !hasAppreciation;

    if (onlySimpleCompare) {
      findings.push({
        code: "PURPOSE_MISMATCH",
        severity: "blocker",
        message:
          "Tool claims rent vs buy decision, but formula compares only cumulative rent vs purchase price.",
      });
    }
  }

  return findings;
}
