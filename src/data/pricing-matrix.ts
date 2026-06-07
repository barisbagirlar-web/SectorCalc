/** Plan & feature matrix rows — Free / Pro / Enterprise (Team) */
export type PlanColumn = "free" | "pro" | "enterprise";

export type PricingMatrixRow = {
  id: string;
  labelKey: string;
  free: boolean | "partial";
  pro: boolean | "partial";
  enterprise: boolean | "partial";
};

export const PRICING_MATRIX_ROWS: PricingMatrixRow[] = [
  {
    id: "sector_calculators",
    labelKey: "pricing.matrix.sectorCalculators",
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    id: "risk_signals",
    labelKey: "pricing.matrix.riskSignals",
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    id: "premium_analyzers",
    labelKey: "pricing.matrix.premiumAnalyzers",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    id: "saved_reports",
    labelKey: "pricing.matrix.savedReports",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    id: "pdf_export",
    labelKey: "pricing.matrix.pdfExport",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    id: "team_seats",
    labelKey: "pricing.matrix.teamSeats",
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    id: "admin_controls",
    labelKey: "pricing.matrix.adminControls",
    free: false,
    pro: false,
    enterprise: "partial",
  },
];

export const PRICING_MATRIX_PLANS: {
  column: PlanColumn;
  nameKey: string;
  priceKey: string;
  periodKey?: string;
  checkoutPlan?: "pro" | "team";
}[] = [
  { column: "free", nameKey: "pricing.matrix.colFree", priceKey: "pricing.freePrice", periodKey: "pricing.freePeriod" },
  {
    column: "pro",
    nameKey: "pricing.matrix.colPro",
    priceKey: "pricing.proPrice",
    periodKey: "pricing.proPeriod",
    checkoutPlan: "pro",
  },
  {
    column: "enterprise",
    nameKey: "pricing.matrix.colEnterprise",
    priceKey: "pricing.teamPrice",
    periodKey: "pricing.teamPeriod",
    checkoutPlan: "team",
  },
];
