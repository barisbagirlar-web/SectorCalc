/**
 * Tool #15 — CBAM Uyumluluk Kararı
 * SpecificEmbedded → ActualVsDefault → FinancialLiability → ComplianceDecision
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const ORIGIN_COUNTRY_OPTIONS = [
  { value: "CN", label: "China" }, { value: "IN", label: "India" },
  { value: "TR", label: "Turkey" }, { value: "RU", label: "Russia" },
  { value: "US", label: "United States" }, { value: "BR", label: "Brazil" },
  { value: "KR", label: "South Korea" }, { value: "JP", label: "Japan" },
  { value: "VN", label: "Vietnam" }, { value: "other", label: "Other" },
] as const;

export const CBAM_COMPLIANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "cbam-compliance-verdict-analyzer", legacyPaidSlug: "cbam-compliance-verdict-analyzer",
  name: "CBAM Uyumluluk Karar Analizi", sectorSlug: "energy-carbon", category: "carbon",
  painStatement: "CBAM kapsamında ürünlerin spesifik gömülü emisyonu AB varsayılan değerlerinin altında mı? Finansal yükümlülük kar marjını aşıyor mu? Bu araç tedarik zinciri kararını destekler.",
  inputs: [
    { id: "totalImportMassTons", label: "Toplam İthalat Kütlesi", type: "number", unit: "ton", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Total import mass" },
    { id: "originCountry", label: "Menşe Ülke", type: "select", unit: "", required: true, smartDefault: "TR", options: [...ORIGIN_COUNTRY_OPTIONS], helper: "", expertMeaning: "Country of origin" },
    { id: "scope1Emissions", label: "Kapsam 1 Emisyon", type: "number", unit: "tCO₂e", required: true, smartDefault: 300, validation: { min: 0 }, helper: "", expertMeaning: "Scope 1 direct emissions" },
    { id: "scope2Emissions", label: "Kapsam 2 Emisyon", type: "number", unit: "tCO₂e", required: true, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Scope 2 indirect emissions" },
    { id: "defaultEmissionFactor", label: "AB Varsayılan Emisyon Faktörü", type: "number", unit: "tCO₂e/ton", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "EU default value per product category" },
    { id: "carbonPricePaidOrigin", label: "Menşe Ülkede Ödenen Karbon Vergisi", type: "number", unit: "USD/tCO₂e", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Carbon price already paid in origin" },
    { id: "euEtsPrice", label: "EU ETS Fiyatı", type: "number", unit: "USD/tCO₂e", required: false, smartDefault: 90, validation: { min: 0 }, helper: "", expertMeaning: "Current EU ETS allowance price" },
    { id: "marginThreshold", label: "Kâr Marjı Eşiği", type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin threshold for proceed/reevaluate" },
    { id: "totalEmbeddedInput", label: "Toplam Gömülü Emisyon", type: "number", unit: "tCO₂e", required: true, smartDefault: 500, validation: { min: 0 }, helper: "İthalatın Scope 1+2 toplam emisyonu.", expertMeaning: "Total embedded emissions" },
  ],
  outputs: [
    { id: "specificEmbedded", label: "Spesifik Gömülü Emisyon", unit: "tCO₂e/ton", format: "number" },
    { id: "actualVsDefault", label: "Gerçek / Varsayılan Oranı", unit: "", format: "number" },
    { id: "financialLiability", label: "Net CBAM Finansal Yükümlülük", unit: "USD", format: "currency" },
    { id: "complianceDecision", label: "Uyum Kararı", unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "actualVsDefault", warning: 1, critical: 1.2, direction: "higher_is_bad", warningMessage: "Emisyonlar AB varsayılan değerine yakın — doğrulama gerekli.", criticalMessage: "Emisyonlar AB varsayılanını aşıyor — tedarik zinciri risk altında." },
    { fieldId: "financialLiability", warning: 25000, critical: 75000, direction: "higher_is_bad", warningMessage: "Yükümlülük > $25K — fiyatlama stratejisi gözden geçirilmeli.", criticalMessage: "Yükümlülük > $75K — alternatif tedarikçi değerlendirilmeli." },
  ],
  formulaPipeline: [
    { formulaId: "carbon.specific_embedded", inputMap: { totalEmbedded: "totalEmbeddedInput", totalMass: "totalImportMassTons" }, outputId: "specificEmbedded" },
    { formulaId: "carbon.actual_vs_default", inputMap: { specificEmbedded: "specificEmbedded", defaultFactor: "defaultEmissionFactor" }, outputId: "actualVsDefault" },
    { formulaId: "carbon.cbam_financial_liability", inputMap: { totalEmbedded: "totalEmbeddedInput", euEtsPrice: "euEtsPrice", carbonPricePaidOrigin: "carbonPricePaidOrigin" }, outputId: "financialLiability" },
  ],
  reportTemplate: { title: "CBAM Compliance Verdict Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Specific embedded = Total emissions / Total mass (tCO₂e/ton).", "Actual vs Default = Specific / EU default factor.", "Financial liability = Total × (EU price - Origin price paid).", "Decision = 'Proceed' if AVD < 1 AND liability < margin threshold.", "CBAM rules subject to change — verify with current EU regulation."] },
};
