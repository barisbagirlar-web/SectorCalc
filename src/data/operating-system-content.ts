/**
 * Operating system page content — Phase 6C pipeline narrative.
 */

export const OPERATING_SYSTEM_PIPELINE_STAGES = [
  { id: "tool-idea", label: "Tool idea", automated: false },
  { id: "ontology", label: "Sector ontology", automated: true },
  { id: "inputs", label: "Required inputs", automated: true },
  { id: "formula", label: "Formula contract", automated: true },
  { id: "validation", label: "Oracle / scenario / property", automated: true },
  { id: "smart-form", label: "Smart Form", automated: "partial" as const },
  { id: "trust-trace", label: "Trust Trace report", automated: true },
  { id: "patch-plan", label: "Patch plan", automated: true },
  { id: "approval", label: "Human approval", automated: false },
  { id: "deploy", label: "Controlled deploy", automated: false },
] as const;

export const OPERATING_SYSTEM_GATES = [
  {
    id: "deterministic",
    title: "Deterministic calculation",
    body: "Production outputs come from governed formula contracts. LLM assists input extraction only — never formula selection or validation override.",
  },
  {
    id: "oracle",
    title: "Oracle and scenario gates",
    body: "Every wired contract passes oracle comparison plus scenario and property audits before it is treated as production-safe.",
  },
  {
    id: "human",
    title: "Human approval",
    body: "Patch plans, controlled patches, and deploy-ready states require explicit human approval. Deploy commands stay disabled until approved.",
  },
  {
    id: "audit-trail",
    title: "Audit trail",
    body: "Trust trace reports document inputs, assumptions, limitations, and validation coverage — not black-box scores.",
  },
] as const;

export const AUTOMATION_BOUNDARY = {
  automated: [
    "Input design audits and migration plans",
    "Patch plan and controlled patch dry-runs",
    "Trust trace and export renderer contracts",
    "Report render dry-runs (no file output)",
    "Deploy-ready gate evaluation",
  ],
  notAutomated: [
    "Production calculator logic changes",
    "Deploy execution without approval",
    "LLM formula creation or oracle override",
    "Payment capture and subscription state writes from the client",
    "Unreviewed route or schema changes",
  ],
} as const;

export const NEXT_BUSINESS_STEPS = [
  "Commercialize premium report preview with clear paywall boundaries",
  "Stage Smart Form rollout for the next calculation-bridge cohort",
  "Close remediation batch 1 with approved controlled apply sandbox",
] as const;
