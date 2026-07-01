/**
 * Tool #15 — CBAM Uyumluluk Kararı
 * SpecificEmbedded → ActualVsDefault → FinancialLiability → ComplianceDecision
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const ORIGIN_COUNTRY_OPTIONS = [
  { value: "CN", label: "China", label_i18n: {"en":"China"} }, { value: "IN", label: "India", label_i18n: {"en":"India"} },
  { value: "TR", label: "Turkey", label_i18n: {"en":"Turkey"} }, { value: "RU", label: "Russia", label_i18n: {"en":"Russia"} },
  { value: "US", label: "United States", label_i18n: {"en":"United States"} }, { value: "BR", label: "Brazil", label_i18n: {"en":"Brazil"} },
  { value: "KR", label: "South Korea", label_i18n: {"en":"South Korea"} }, { value: "JP", label: "Japan", label_i18n: {"en":"Japan"} },
  { value: "VN", label: "Vietnam", label_i18n: {"en":"Vietnam"} }, { value: "other", label: "Other", label_i18n: {"en":"Other"} },
] as const;

export const CBAM_COMPLIANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "cbam-compliance-verdict-analyzer", legacyPaidSlug: "cbam-compliance-verdict-analyzer",
  name: "CBAM Uyumluluk Karar Analizi", name_i18n: {"en":"CBAM Compliance Verdict Analysis"}, sectorSlug: "energy-carbon", category: "carbon",
  painStatement: "CBAM kapsamında ürünlerin spesifik gömülü emisyonu AB varsayılan değerlerinin altında mı? Finansal yükümlülük kar marjını aşıyor mu? Bu araç tedarik zinciri kararını destekler.", painStatement_i18n: {"en":"Is the specific embedded emission of your products under CBAM below EU default values? Does the financial obligation exceed the profit margin? This tool supports supply chain decisions."},
  inputs: [
    { id: "totalImportMassTons", label: "Toplam İthalat Kütlesi", label_i18n: {"en":"Total Import Mass"}, type: "number", unit: "ton", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Total import mass", expertMeaning_i18n: {"en":"Total import mass"} },
    { id: "originCountry", label: "Menşe Ülke", label_i18n: {"en":"Country of Origin"}, type: "select", unit: "", required: true, smartDefault: "TR", options: [...ORIGIN_COUNTRY_OPTIONS], helper: "", expertMeaning: "Country of origin", expertMeaning_i18n: {"en":"Country of origin"} },
    { id: "scope1Emissions", label: "Kapsam 1 Emisyon", label_i18n: {"en":"Scope 1 Emissions"}, type: "number", unit: "tCO₂e", required: true, smartDefault: 300, validation: { min: 0 }, helper: "", expertMeaning: "Scope 1 direct emissions", expertMeaning_i18n: {"en":"Scope 1 direct emissions"} },
    { id: "scope2Emissions", label: "Kapsam 2 Emisyon", label_i18n: {"en":"Scope 2 Emissions"}, type: "number", unit: "tCO₂e", required: true, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Scope 2 indirect emissions", expertMeaning_i18n: {"en":"Scope 2 indirect emissions"} },
    { id: "defaultEmissionFactor", label: "AB Varsayılan Emisyon Faktörü", label_i18n: {"en":"EU Default Emission Factor"}, type: "number", unit: "tCO₂e/ton", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "EU default value per product category", expertMeaning_i18n: {"en":"EU default value per product category"} },
    { id: "carbonPricePaidOrigin", label: "Menşe Ülkede Ödenen Karbon Vergisi", label_i18n: {"en":"Carbon Tax Paid in Origin"}, type: "number", unit: "USD/tCO₂e", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Carbon price already paid in origin", expertMeaning_i18n: {"en":"Carbon price already paid in origin"} },
    { id: "euEtsPrice", label: "EU ETS Fiyatı", label_i18n: {"en":"EU ETS Price"}, type: "number", unit: "USD/tCO₂e", required: false, smartDefault: 90, validation: { min: 0 }, helper: "", expertMeaning: "Current EU ETS allowance price", expertMeaning_i18n: {"en":"Current EU ETS allowance price"} },
    { id: "marginThreshold", label: "Kâr Marjı Eşiği", label_i18n: {"en":"Profit Margin Threshold"}, type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin threshold for proceed/reevaluate", expertMeaning_i18n: {"en":"Profit margin threshold for proceed/reevaluate"} },
    { id: "totalEmbeddedInput", label: "Toplam Gömülü Emisyon", label_i18n: {"en":"Total Embedded Emissions"}, type: "number", unit: "tCO₂e", required: true, smartDefault: 500, validation: { min: 0 }, helper: "İthalatın Scope 1+2 toplam emisyonu.", helper_i18n: {"en":"İthalatın Scope 1+2 toplam emisyonu."}, expertMeaning: "Total embedded emissions", expertMeaning_i18n: {"en":"Total embedded emissions"} },
  ],
  outputs: [
    { id: "specificEmbedded", label: "Spesifik Gömülü Emisyon", label_i18n: {"en":"Spesifik Gomulu Emisyon"}, unit: "tCO₂e/ton", format: "number" },
    { id: "actualVsDefault", label: "Gerçek / Varsayılan Oranı", label_i18n: {"en":"Gercek / Varsaylan Oran"}, unit: "", format: "number" },
    { id: "financialLiability", label: "Net CBAM Finansal Yükümlülük", label_i18n: {"en":"Net CBAM Finansal Yukumluluk"}, unit: "USD", format: "currency" },
    { id: "complianceDecision", label: "Uyum Kararı", label_i18n: {"en":"Uyum Karar"}, unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "actualVsDefault", warning: 1, critical: 1.2, direction: "higher_is_bad", warningMessage: "Emisyonlar AB varsayılan değerine yakın — doğrulama gerekli.", warningMessage_i18n: {"en":"Emissions close to EU default — verification required."}, criticalMessage: "Emisyonlar AB varsayılanını aşıyor — tedarik zinciri risk altında.", criticalMessage_i18n: {"en":"Emissions exceed EU default — supply chain at risk."} },
    { fieldId: "financialLiability", warning: 25000, critical: 75000, direction: "higher_is_bad", warningMessage: "Yükümlülük > $25K — fiyatlama stratejisi gözden geçirilmeli.", warningMessage_i18n: {"en":"Yükümlülük > $25K — fiyatlama stratejisi gözden geçirilmeli."}, criticalMessage: "Yükümlülük > $75K — alternatif tedarikçi değerlendirilmeli.", criticalMessage_i18n: {"en":"Yükümlülük > $75K — alternatif tedarikçi değerlendirilmeli."} },
  ],
  formulaPipeline: [
    { formulaId: "carbon.specific_embedded", inputMap: { totalEmbedded: "totalEmbeddedInput", totalMass: "totalImportMassTons" }, outputId: "specificEmbedded" },
    { formulaId: "carbon.actual_vs_default", inputMap: { specificEmbedded: "specificEmbedded", defaultFactor: "defaultEmissionFactor" }, outputId: "actualVsDefault" },
    { formulaId: "carbon.cbam_financial_liability", inputMap: { totalEmbedded: "totalEmbeddedInput", euEtsPrice: "euEtsPrice", carbonPricePaidOrigin: "carbonPricePaidOrigin" }, outputId: "financialLiability" },
  ],
  reportTemplate: { title: "CBAM Compliance Verdict Report", title_i18n: {"en":"CBAM Compliance Verdict Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Specific embedded = Total emissions / Total mass (tCO₂e/ton).", "Actual vs Default = Specific / EU default factor.", "Financial liability = Total × (EU price - Origin price paid).", "Decision = 'Proceed' if AVD < 1 AND liability < margin threshold.", "CBAM rules subject to change — verify with current EU regulation."],assumptionNotes_i18n:[{"en":"Specific embedded = Total emissions / Total mass (tCO₂e/ton)."},{"en":"Actual vs Default = Specific / EU default factor."},{"en":"Financial liability = Total × (EU price - Origin price paid)."},{"en":"Decision = 'Proceed' if AVD < 1 AND liability < margin threshold."},{"en":"CBAM rules subject to change — verify with current EU regulation."}]},
};
