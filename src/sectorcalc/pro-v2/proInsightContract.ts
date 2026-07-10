// SectorCalc PRO V2 — Insight Contract
// Defines the structure of a premium insight report.

export interface InsightKpi {
  label: string;
  value: string;
  unit: string;
  severity?: "OK" | "WARNING" | "CRITICAL" | "INFO";
  explanation?: string;
}

export interface DecisionState {
  state: "PROFITABLE" | "AT_RISK" | "LOSS" | "REVIEW" | "INFO";
  label: string;
  summary: string;
}

export interface CostDistributionItem {
  category: string;
  amount: number;
  percentage: number;
  color?: string;
}

export interface CalculatedValue {
  label: string;
  value: string;
  unit: string;
  formula_ref?: string;
}

export interface HiddenLossItem {
  title: string;
  description: string;
  potential_impact: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface MissedAssumptionItem {
  title: string;
  description: string;
  impact_on_result: string;
}

export interface RiskWarning {
  title: string;
  description: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  mitigation?: string;
}

export interface SensitivityCheck {
  parameter: string;
  change: string;
  impact: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface ChecklistItem {
  item: string;
  status: "PASS" | "FAIL" | "REVIEW" | "PROVIDED" | "ASSUMED" | "MISSING" | "NOT CHECKED";
  details?: string;
}

export interface RecommendedAction {
  action: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  expected_benefit: string;
}

export interface ProInsightReport {
  toolName: string;
  generatedAt: string;

  // 1. Primary result
  primaryKpi: InsightKpi;

  // 2. Decision state
  decisionState: DecisionState;

  // 3. Executive interpretation
  executiveInterpretation: string;

  // 4. Cost distribution (at least 3 items)
  costDistribution: CostDistributionItem[];

  // 5. Calculated values (at least 3)
  calculatedValues: CalculatedValue[];

  // 6. Hidden loss diagnosis (at least 3)
  hiddenLosses: HiddenLossItem[];

  // 7. Missed assumptions (at least 3)
  missedAssumptions: MissedAssumptionItem[];

  // 8. Risk warnings (at least 3)
  riskWarnings: RiskWarning[];

  // 9. Sensitivity checks (at least 3)
  sensitivityChecks: SensitivityCheck[];

  // 10. Professional checklist (at least 5)
  checklist: ChecklistItem[];

  // 11. Recommended next action
  recommendedAction: RecommendedAction;

  // 12. Assumptions used
  assumptionsUsed: Array<{ parameter: string; value: string }>;

  // 13. Trace reference
  traceId?: string;

  // Additional metrics
  costPerMeter?: string;
  baseCostPerMeter?: string;
  totalFloorPerMeter?: string;
  wireMass?: string;
  wireCostTotal?: string;
  gasCostTotal?: string;
  laborCostTotal?: string;
  overheadCostTotal?: string;
  contingencyAmount?: string;
  totalCost?: string;
  marginAmount?: string;
  marginPercent?: string;
  keyCostDriver?: string;
}
