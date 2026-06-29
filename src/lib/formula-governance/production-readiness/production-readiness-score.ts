/**
 * Production readiness score — Phase 5I-P weighted gate scoring.
 */

export function computeReadinessScore(gateResults: Readonly<Record<string, boolean>>): number {
  const weights: Readonly<Record<string, number>> = {
    formula_governance: 15,
    oracle_scenario_property: 15,
    input_design: 10,
    smart_form_live: 10,
    production_deploy: 10,
    trust_trace: 10,
    report_renderer: 10,
    full_tool_audit: 5,
    patch_plan: 5,
    controlled_patch: 5,
    remediation: 5,
    tool_factory: 5,
    investor_demo: 5,
    secret_build_lint: 5,
  };

  let score = 0;
  let totalWeight = 0;

  for (const [gate, passed] of Object.entries(gateResults)) {
    const weight = weights[gate] ?? 1;
    totalWeight += weight;
    if (passed) {
      score += weight;
    }
  }

  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
}
