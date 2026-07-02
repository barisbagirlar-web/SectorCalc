/**
 * Debt register builder - Phase 5I-Q remaining debt catalog.
 */

import type { DebtRegisterEntry } from "@/lib/features/formula-governance/roadmap-debt-register/debt-register-types";

export const DEBT_REGISTER_ENTRIES: readonly DebtRegisterEntry[] = [
  { id: "fixture-ontology", category: "fixture_ontology_expansion", severity: "high", description: "15 tools need fixture ontology drafts", batchSuggestion: "5J-A" },
  { id: "smart-form-rollout", category: "smart_form_rollout_expansion", severity: "high", description: "7 calculation bridge candidates await staging rollout", batchSuggestion: "5J-B" },
  { id: "report-export", category: "report_renderer_real_export", severity: "medium", description: "PDF/Excel/Word real export not wired", batchSuggestion: "5J-C" },
  { id: "remediation-apply", category: "remediation_controlled_apply", severity: "high", description: "Remediation batch 1 apply gate pending human approval", batchSuggestion: "5J-D" },
  { id: "full-audit-b2", category: "full_audit_batch2", severity: "medium", description: "Second remediation batch not planned", batchSuggestion: "5J-E" },
  { id: "payment-gates", category: "payment_auth_pricing_gates", severity: "critical", description: "Stripe live readiness gate pending", batchSuggestion: "5K-A" },
  { id: "analytics", category: "analytics_monitoring", severity: "medium", description: "Campaign ROI monitoring incomplete", batchSuggestion: "5K-B" },
  { id: "investor-package", category: "investor_demo_package", severity: "medium", description: "Investor demo UI package not built", batchSuggestion: "5K-C" },
  { id: "prod-docs", category: "production_documentation", severity: "medium", description: "Production runbook documentation incomplete", batchSuggestion: "5K-D" },
  { id: "patch-apply", category: "tool_factory_controlled_patch_apply", severity: "high", description: "Controlled patch apply sandbox not built", batchSuggestion: "5J-F" },
] as const;

export function buildDebtRegister(): readonly DebtRegisterEntry[] {
  return DEBT_REGISTER_ENTRIES;
}
