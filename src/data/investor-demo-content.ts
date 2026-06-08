/**
 * Investor demo page content — Phase 6A (English, data-driven claims only).
 */

export const INVESTOR_LIVE_PILOTS = [
  {
    governanceSlug: "3d-print-cost-check",
    routeSlug: "3d-print-cost-check",
    href: "/tools/free/3d-print-cost-check",
    label: "3D Print Cost Check",
  },
  {
    governanceSlug: "auto-shop-margin-leak-detector",
    routeSlug: "repair-time-vs-price-check",
    href: "/tools/free/repair-time-vs-price-check",
    label: "Repair Time vs Price Check",
  },
  {
    governanceSlug: "cabinet-cost-estimator",
    routeSlug: "cabinet-cost-estimator",
    href: "/tools/free/cabinet-cost-estimator",
    label: "Cabinet Cost Estimator",
  },
] as const;

export const INVESTOR_ROLLOUT_POTENTIAL_COUNT = 15 as const;

export const INVESTOR_PROBLEM_STATEMENT = {
  headline: "Sector-specific margin decisions fail in spreadsheets — not because teams lack formulas, but because inputs, assumptions, and validation are inconsistent.",
  subhead:
    "SectorCalc is a calculation operating system for sector tools: structured inputs, governed formulas, deterministic outputs, and auditable decision reports.",
} as const;

export const INVESTOR_DUAL_CORE = {
  mind2:
    "Requirement Engine — given a goal and known inputs, the system resolves which inputs are missing, derivable, or require expert review.",
  mind1:
    "Validation Engine — oracle, scenario, and property checks confirm inputs and results before any verdict or export is shown.",
} as const;

export const INVESTOR_DEMO_FLOW_STEPS = [
  "Open a live Smart Form pilot on a production free route",
  "Run a governed free check with browser-side inputs",
  "Show trust trace readiness and report export contract (dry-run)",
  "Walk the Tool Factory pipeline through patch plan and human approval gate",
  "Close with deploy-ready gate — command disabled until approved",
] as const;

export const INVESTOR_MOAT_BULLETS = [
  "Deterministic calculation boundary — LLM does not compute results or override oracle",
  "Formula governance with oracle/scenario/property validation loop",
  "Trust trace and export renderer contracts before customer-facing reports",
  "Controlled patch and deploy gates with mandatory human approval",
  "Smart Form pilots live on production routes behind a feature flag",
] as const;

export const INVESTOR_NINETY_DAY_PLAN = [
  "Ship investor demo pack and commercial clarity layer",
  "Expand Smart Form staging rollout for calculation-bridge candidates",
  "Wire premium report preview to trust trace dry-run output",
  "Complete remediation batch apply sandbox with human approval",
  "Prepare Stripe live readiness gate — no auto-deploy",
] as const;
