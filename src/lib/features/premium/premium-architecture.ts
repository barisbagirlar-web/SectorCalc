/**
 * SectorCalc Premium Architecture Reset v1
 *
 * Premium tools are NOT quote/margin calculators alone.
 * They answer: what is measured, where is loss, tolerance breach,
 * impact (money/time/material/energy), and what to do now.
 *
 * Product positioning:
 * Industrial Efficiency & Loss Management Calculation Universe
 * for businesses that cannot afford ERP / consulting / expensive software.
 */

/** Eight canonical decision families (omurga). */
export type PremiumDecisionFamily =
  | "measurement_accuracy"
  | "calibration_tolerance"
  | "scrap_loss"
  | "time_oee_capacity"
  | "route_resource_optimization"
  | "sector_cost_profitability"
  | "energy_carbon_efficiency"
  | "benchmark_health_decision";

/** Seven premium report sub-families (Premium Decision Reports). */
export type PremiumReportFamily =
  | "loss_detection"
  | "measurement_calibration"
  | "productivity_oee"
  | "cost_margin"
  | "energy_carbon"
  | "route_optimization"
  | "benchmark_financial_health";

/** Three engine modes every sector premium tool must expose. */
export type PremiumEngineMode = "measurement" | "loss" | "optimization";

/** Loss impact dimensions surfaced in reports. */
export type LossImpactKind =
  | "monetary"
  | "material"
  | "time"
  | "energy"
  | "carbon"
  | "capacity";

export type ToleranceStatus = "within" | "watch" | "breach";

export type FieldPanelKpiStatus = "ok" | "warn" | "bad";

/** 3-second field panel KPI tile. */
export interface FieldPanelKpi {
  readonly label: string;
  readonly value: string;
  readonly status: FieldPanelKpiStatus;
}

/**
 * Industrial field panel - designed for glove-on, noisy shop-floor reading in ~3 seconds.
 */
export interface PremiumFieldPanel {
  readonly familyBadge: string;
  readonly sectorLabel: string;
  readonly verdictLine: string;
  readonly measuredLine: string;
  readonly lossHotspotLine: string;
  readonly toleranceStatus: ToleranceStatus;
  readonly toleranceLine: string;
  readonly impactLine: string;
  readonly actionLine: string;
  readonly kpis: readonly FieldPanelKpi[];
}

/** Per-engine-mode logic descriptor (not formula - operator-facing). */
export interface PremiumEngineModeDescriptor {
  readonly mode: PremiumEngineMode;
  readonly label: string;
  readonly operatorSummary: string;
}

/** Full architecture profile for one premium analyzer slug. */
export interface PremiumArchitectureProfile {
  readonly slug: string;
  readonly sectorSlug: string;
  readonly sectorLabel: string;
  readonly decisionFamily: PremiumDecisionFamily;
  readonly secondaryFamilies: readonly PremiumDecisionFamily[];
  readonly reportFamily: PremiumReportFamily;
  readonly engineModes: readonly PremiumEngineModeDescriptor[];
  readonly lossImpacts: readonly LossImpactKind[];
  readonly lossTypeLabels: readonly string[];
  readonly reclassifiedTitle: string;
  readonly reclassifiedPromise: string;
  readonly whatIsMeasured: string;
  readonly whereIsLoss: string;
  readonly toleranceFocus: string;
  readonly mvpLossFamily: boolean;
}

export const PREMIUM_DECISION_FAMILY_LABELS: Record<PremiumDecisionFamily, string> = {
  measurement_accuracy: "Measurement & Weighing",
  calibration_tolerance: "Calibration & Tolerance",
  scrap_loss: "Scrap, Fire & Defect Loss",
  time_oee_capacity: "Time, Setup & OEE",
  route_resource_optimization: "Route & Resource Optimization",
  sector_cost_profitability: "Sector Cost & Profitability",
  energy_carbon_efficiency: "Energy, Carbon & Efficiency",
  benchmark_health_decision: "Benchmark & Health Score",
};

export const PREMIUM_REPORT_FAMILY_LABELS: Record<PremiumReportFamily, string> = {
  loss_detection: "Loss Detection Report",
  measurement_calibration: "Measurement & Calibration Report",
  productivity_oee: "Productivity & OEE Report",
  cost_margin: "Cost & Margin Report",
  energy_carbon: "Energy & Carbon Report",
  route_optimization: "Route & Resource Report",
  benchmark_financial_health: "Benchmark & Financial Health Report",
};

export const PREMIUM_ENGINE_MODE_LABELS: Record<PremiumEngineMode, string> = {
  measurement: "Measurement",
  loss: "Loss Detection",
  optimization: "Optimization",
};

/** The five questions every premium tool must answer (at least one). */
export const PREMIUM_DECISION_QUESTIONS = [
  "What is being measured?",
  "Where is the loss?",
  "Is deviation beyond tolerance?",
  "What is the money / time / material / energy impact?",
  "What should the operator do now?",
] as const;

export const SECTORCALC_PRODUCT_VISION = {
  tagline: "Industrial Efficiency & Loss Management Calculation Universe",
  purpose:
    "Affordable measurement, weighing, calibration, scrap, OEE, routing, cost, energy, carbon and profitability tools for businesses that cannot buy ERP or consulting.",
  freeRole: "Quick calculation, conversion, first risk signal.",
  premiumRole:
    "Sector-specific loss analysis, decision threshold, tolerance interpretation, action report, PDF and saved decision output.",
  industrialOsRole:
    "Advanced audit, benchmark, variance and operational intelligence layer.",
} as const;

export const PREMIUM_NOT_QUOTE_ONLY_RULE =
  "SectorCalc premium tools are not quote/margin calculators alone. Each tool ties to measurement, loss, calibration, OEE, routing, energy, carbon or profitability.";
