/**
 * Premium 152 batch 1 — manual seed until quality-scan PASS rows exist.
 * Regenerated target: npm run audit:formula-registry
 */

export type FormulaSourceAuditStatus = {
  slug: string;
  status: "verified";
  auditGate: "Formula Source-of-Truth Audit Gate";
  auditVersion: "v1";
  verifiedAtSource: "quality-scan-report";
  standardReference: "7 Muda quality standard";
  checks: {
    upgradeDecisionPass: boolean;
    hasFormulaContract: boolean;
    hasValidation: boolean;
    hasTests: boolean;
    hasQuickResult: boolean;
    hasDeepReport: boolean;
    hasI18n: boolean;
  };
};

const FORMULA_SOURCE_AUDIT_REGISTRY: Readonly<Record<string, FormulaSourceAuditStatus>> = {
  "7-israf-muda-avcisi-parasal-karsilik-calculator": {
    slug: "7-israf-muda-avcisi-parasal-karsilik-calculator",
    status: "verified",
    auditGate: "Formula Source-of-Truth Audit Gate",
    auditVersion: "v1",
    verifiedAtSource: "quality-scan-report",
    standardReference: "7 Muda quality standard",
    checks: {
      upgradeDecisionPass: true,
      hasFormulaContract: true,
      hasValidation: true,
      hasTests: true,
      hasQuickResult: true,
      hasDeepReport: true,
      hasI18n: true,
    },
  },
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator": {
    slug: "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
    status: "verified",
    auditGate: "Formula Source-of-Truth Audit Gate",
    auditVersion: "v1",
    verifiedAtSource: "quality-scan-report",
    standardReference: "7 Muda quality standard",
    checks: {
      upgradeDecisionPass: true,
      hasFormulaContract: true,
      hasValidation: true,
      hasTests: true,
      hasQuickResult: true,
      hasDeepReport: true,
      hasI18n: true,
    },
  },
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator": {
    slug: "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
    status: "verified",
    auditGate: "Formula Source-of-Truth Audit Gate",
    auditVersion: "v1",
    verifiedAtSource: "quality-scan-report",
    standardReference: "7 Muda quality standard",
    checks: {
      upgradeDecisionPass: true,
      hasFormulaContract: true,
      hasValidation: true,
      hasTests: true,
      hasQuickResult: true,
      hasDeepReport: true,
      hasI18n: true,
    },
  },
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator": {
    slug: "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
    status: "verified",
    auditGate: "Formula Source-of-Truth Audit Gate",
    auditVersion: "v1",
    verifiedAtSource: "quality-scan-report",
    standardReference: "7 Muda quality standard",
    checks: {
      upgradeDecisionPass: true,
      hasFormulaContract: true,
      hasValidation: true,
      hasTests: true,
      hasQuickResult: true,
      hasDeepReport: true,
      hasI18n: true,
    },
  },
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator": {
    slug: "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator",
    status: "verified",
    auditGate: "Formula Source-of-Truth Audit Gate",
    auditVersion: "v1",
    verifiedAtSource: "quality-scan-report",
    standardReference: "7 Muda quality standard",
    checks: {
      upgradeDecisionPass: true,
      hasFormulaContract: true,
      hasValidation: true,
      hasTests: true,
      hasQuickResult: true,
      hasDeepReport: true,
      hasI18n: true,
    },
  },
};

export function getFormulaSourceAuditStatus(slug: string): FormulaSourceAuditStatus | null {
  return FORMULA_SOURCE_AUDIT_REGISTRY[slug.trim()] ?? null;
}

export function hasFormulaSourceAudit(slug: string): boolean {
  return Boolean(getFormulaSourceAuditStatus(slug));
}
