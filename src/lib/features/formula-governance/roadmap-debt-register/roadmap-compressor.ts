/**
 * Roadmap compressor — Phase 5I-Q next 3 batches.
 */

import type { RoadmapBatchSuggestion } from "@/lib/features/formula-governance/roadmap-debt-register/debt-register-types";

export function compressRoadmapToNext3Batches(): readonly RoadmapBatchSuggestion[] {
  return [
    {
      batchId: "5J-A",
      title: "Fixture Ontology + Smart Form Staging Rollout",
      debtItems: ["fixture-ontology", "smart-form-rollout"],
    },
    {
      batchId: "5J-B",
      title: "Report Real Export + Remediation Apply Sandbox",
      debtItems: ["report-export", "remediation-apply", "patch-apply"],
    },
    {
      batchId: "5J-C",
      title: "Full Audit Batch 2 + Investor Demo Package",
      debtItems: ["full-audit-b2", "investor-package", "analytics"],
    },
  ];
}

export function buildInvestorDemoMinimumPath(): readonly string[] {
  return [
    "Live smart form pilots (3 routes)",
    "Trust trace export dry-run demo",
    "Tool factory demo flow walkthrough",
    "Deploy-ready gate (command disabled proof)",
  ];
}

export function buildFullProductizationPath(): readonly string[] {
  return [
    "Complete fixture ontology for contract_only tools",
    "Expand smart form to staging rollout batch",
    "Wire report renderer real export (subscribed users)",
    "Human-approved remediation controlled apply",
    "Stripe live + payment gates",
    "Investor demo package + analytics monitoring",
  ];
}
