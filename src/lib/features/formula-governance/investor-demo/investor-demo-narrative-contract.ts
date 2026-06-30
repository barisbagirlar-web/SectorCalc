/**
 * Investor demo narrative data contract — Phase 5I-O structured input only.
 */

import { buildInvestorSystemMap } from "@/lib/features/formula-governance/investor-demo/investor-demo-system-map";
import { collectInvestorDemoMetrics } from "@/lib/features/formula-governance/investor-demo/investor-demo-metrics";

export function buildDemoScriptDataContract(): Readonly<Record<string, unknown>> {
  const metrics = collectInvestorDemoMetrics();
  const systemMap = buildInvestorSystemMap();

  return {
    systemMap,
    metrics,
    moatSignals: [
      "dual_core_calculation_intelligence",
      "formula_governance_oracle_loop",
      "trust_trace_export_pipeline",
      "tool_factory_human_approval_gates",
    ],
    liveProofRequired: true,
    marketingCopyExcluded: true,
  };
}
