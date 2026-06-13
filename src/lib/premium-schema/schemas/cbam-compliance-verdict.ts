import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CBAM_COMPLIANCE_VERDICT_SCHEMA: PremiumCalculatorSchema = {
  id: "cbam-compliance-verdict",
  name: "CBAM Compliance Readiness Verdict",
  sectorSlug: "energy-carbon",
  category: "carbon",
  painStatement:
    "Exporters can miss CBAM data gaps until certificate coverage, declared emissions and completeness are compared.",

  inputs: [
    {
      id: "embeddedEmissionsTon",
      label: "Embedded emissions",
      type: "number",
      unit: "ton CO₂e",
      required: true,
      smartDefault: 150,
      validation: { min: 0 },
      helper: "Calculated or measured embedded emissions.",
      expertMeaning: "Reference embedded emissions tonnage.",
    },
    {
      id: "declaredEmissionsTon",
      label: "Declared emissions",
      type: "number",
      unit: "ton CO₂e",
      required: true,
      smartDefault: 120,
      validation: { min: 0 },
      helper: "Declared emissions in submitted data.",
      expertMeaning: "Declared tonnage used for gap analysis.",
    },
    {
      id: "certificateCoveragePct",
      label: "Certificate coverage",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 70,
      validation: { min: 0, max: 100 },
      helper: "Share of exposure covered by certificates.",
      expertMeaning: "Certificate coverage percent assumption.",
    },
    {
      id: "dataCompletenessPct",
      label: "Data completeness",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 80,
      validation: { min: 0, max: 100 },
      helper: "Completeness of required CBAM data fields.",
      expertMeaning: "Documentation completeness band.",
    },
    {
      id: "cbamCertificatePrice",
      label: "CBAM certificate price",
      type: "number",
      unit: "EUR/ton",
      required: true,
      smartDefault: 85,
      validation: { min: 0 },
      helper: "Assumed certificate price per tonne.",
      expertMeaning: "Price applied to emission gap exposure.",
    },
    {
      id: "eurTryRate",
      label: "EUR/TRY rate",
      type: "number",
      unit: "TRY/EUR",
      required: true,
      smartDefault: 35,
      validation: { min: 0.01 },
      helper: "Exchange rate for local currency exposure.",
      expertMeaning: "FX assumption for financial exposure.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "carbon.emission_gap_ton",
      inputMap: {
        embeddedEmissionsTon: "embeddedEmissionsTon",
        declaredEmissionsTon: "declaredEmissionsTon",
      },
      outputId: "emissionGap",
    },
    {
      formulaId: "benchmark.gap_percent",
      inputMap: { percent: "certificateCoveragePct" },
      outputId: "coverageGapPct",
    },
    {
      formulaId: "benchmark.gap_percent",
      inputMap: { percent: "dataCompletenessPct" },
      outputId: "dataGapPct",
    },
    {
      formulaId: "carbon.cbam_financial_exposure",
      inputMap: {
        emissionGap: "emissionGap",
        cbamCertificatePrice: "cbamCertificatePrice",
        eurTryRate: "eurTryRate",
      },
      outputId: "financialExposure",
    },
    {
      formulaId: "risk.cbam_composite_score",
      inputMap: {
        embeddedEmissionsTon: "embeddedEmissionsTon",
        emissionGap: "emissionGap",
        coverageGapPct: "coverageGapPct",
        dataGapPct: "dataGapPct",
      },
      outputId: "riskScore",
    },
  ],

  outputs: [
    {
      id: "financialExposure",
      label: "Financial exposure",
      unit: "TRY",
      format: "currency",
      isBigNumber: true,
    },
    { id: "riskScore", label: "Risk score", unit: "score", format: "number" },
    { id: "emissionGap", label: "Emission gap", unit: "ton CO₂e", format: "number" },
    { id: "coverageGapPct", label: "Coverage gap", unit: "%", format: "percentage" },
    { id: "dataGapPct", label: "Data gap", unit: "%", format: "percentage" },
  ],

  thresholds: [
    {
      fieldId: "riskScore",
      warning: 20,
      critical: 50,
      direction: "higher_is_bad",
      warningMessage: "Medium CBAM readiness risk — review data completeness and coverage.",
      criticalMessage: "High CBAM readiness risk — close emission and certificate gaps before filing.",
    },
  ],

  reportTemplate: {
    title: "CBAM Compliance Readiness Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 15,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Emission gap = max(embedded − declared, 0).",
      "Risk score combines emission, coverage and data gaps — not a regulatory approval.",
      "Financial exposure = emission gap × certificate price × FX rate.",
    ],
  },
};
