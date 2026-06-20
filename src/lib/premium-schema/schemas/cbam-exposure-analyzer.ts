/**
 * Tool #14 — CBAM Maruziyeti Check
 * EmbeddedEmissions → CBAMCertificateCost → ComplianceScore
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const EU_ETS_DEFAULT_PRICE = 90;

export const CBAM_EXPOSURE_SCHEMA: PremiumCalculatorSchema = {
  id: "cbam-exposure-analyzer", legacyPaidSlug: "cbam-exposure-analyzer",
  name: "CBAM Maruziyeti Analizi", sectorSlug: "energy-carbon", category: "carbon",
  painStatement: "AB Sınırda Karbon Düzenlemesi (CBAM) kapsamında ürünlerin gömülü emisyonlarını raporlamayan ihracatçılar ciddi mali cezalarla karşılaşır. Bu araç CBAM mali yükümlülüğünü hesaplar ve uyum puanı verir.",
  inputs: [
    { id: "productionVolumeTons", label: "Üretim Hacmi", type: "number", unit: "ton", required: true, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Total production in metric tons" },
    { id: "naturalGasM3", label: "Doğal Gaz Tüketimi", type: "number", unit: "m³", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Natural gas consumption" },
    { id: "coalTons", label: "Kömür Tüketimi", type: "number", unit: "ton", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Coal consumption" },
    { id: "electricityMwh", label: "Elektrik Tüketimi", type: "number", unit: "MWh", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Electricity consumption" },
    { id: "processEmissions", label: "Proses Emisyonu", type: "number", unit: "tCO₂e", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Process CO₂ equivalent" },
    { id: "renewableRatio", label: "Yenilenebilir Enerji Oranı", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Renewable energy share" },
    { id: "exportVolumeTons", label: "AB'ye İhracat Hacmi", type: "number", unit: "ton", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Export volume to EU" },
    { id: "euEtsPrice", label: "EU ETS Fiyatı", type: "number", unit: "USD/tCO₂e", required: false, smartDefault: EU_ETS_DEFAULT_PRICE, validation: { min: 0 }, helper: "", expertMeaning: "EU ETS carbon price" },
    { id: "carbonLeakageFactor", label: "Karbon Kaçağı Faktörü", type: "number", unit: "", required: false, smartDefault: 0.8, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Carbon leakage exposure factor" },
    { id: "dataCompleteness", label: "Veri Tamamlık (%)", type: "number", unit: "%", required: false, smartDefault: 60, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Emissions data completeness" },
    { id: "verificationStatus", label: "Doğrulama Durumu (%)", type: "number", unit: "%", required: false, smartDefault: 40, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Third-party verification completeness" },
    { id: "reductionProgress", label: "Azaltım İlerlemesi (%)", type: "number", unit: "%", required: false, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Emission reduction progress" },
    { id: "directEmissionsInput", label: "Kapsam 1 Emisyon (Hesaplanmış)", type: "number", unit: "tCO₂e", required: true, smartDefault: 700, validation: { min: 0 }, helper: "Direkt emisyonlar (doğalgaz/kömür/proses).", expertMeaning: "Scope 1 direct emissions" },
    { id: "indirectEmissionsInput", label: "Kapsam 2 Emisyon (Hesaplanmış)", type: "number", unit: "tCO₂e", required: true, smartDefault: 500, validation: { min: 0 }, helper: "Elektrik tüketimi kaynaklı emisyonlar.", expertMeaning: "Scope 2 indirect emissions" },
    { id: "totalEmbeddedInput", label: "Toplam Gömülü Emisyon", type: "number", unit: "tCO₂e", required: true, smartDefault: 1200, validation: { min: 0 }, helper: "Kapsam 1 + Kapsam 2 toplamı.", expertMeaning: "Total embedded emissions" },
  ],
  outputs: [
    { id: "totalEmbedded", label: "Toplam Gömülü Emisyon", unit: "tCO₂e", format: "number" },
    { id: "carbonIntensity", label: "Karbon Yoğunluğu", unit: "tCO₂e/ton", format: "number" },
    { id: "cbamCertificateCost", label: "CBAM Sertifika Maliyeti", unit: "USD", format: "currency" },
    { id: "complianceScore", label: "Uyum Puanı (0-100)", unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "cbamCertificateCost", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "CBAM maliyeti > $10K — emisyon azaltım stratejisi geliştirilmeli.", criticalMessage: "CBAM maliyeti > $50K — acil uyum eylem planı gerekiyor." },
    { fieldId: "complianceScore", warning: 50, critical: 30, direction: "lower_is_bad", warningMessage: "Uyum puanı < 50 — veri ve doğrulama eksik.", criticalMessage: "Uyum puanı < 30 — CBAM raporlaması için yetersiz." },
  ],
  formulaPipeline: [
    { formulaId: "carbon.embedded_emissions", inputMap: { directEmissions: "directEmissionsInput", indirectEmissions: "indirectEmissionsInput" }, outputId: "totalEmbedded" },
    { formulaId: "carbon.cbam_certificate_cost", inputMap: { embeddedEmissions: "totalEmbeddedInput", freeAllowance: "exportVolumeTons", euEtsPrice: "euEtsPrice" }, outputId: "cbamCertificateCost" },
    { formulaId: "carbon.compliance_score", inputMap: { dataCompleteness: "dataCompleteness", verificationStatus: "verificationStatus", reductionProgress: "reductionProgress" }, outputId: "complianceScore" },
  ],
  reportTemplate: { title: "CBAM Exposure Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Direct = NaturalGas×2.204 + Coal×2.86 (tCO₂e).", "Indirect = ElectricityMWh × GridFactor (0.447 for Turkey).", "CBAM cost = (Embedded - FreeAllowance) × EU_ETS_Price.", "Free allowance = Benchmark × Production × LeakageFactor.", "Compliance score = Data(0.3) + Verification(0.3) + Reduction(0.4).", "EU ETS assumed at $90/tCO₂e (2026 estimated)."] },
};
