/**
 * Tool #21 — CLV/CAC Oranı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CLV_CAC_SCHEMA: PremiumCalculatorSchema = {
  id: "clv-cac-ratio-analyzer", legacyPaidSlug: "clv-cac-ratio-analyzer",
  name: "CLV / CAC Oranı Analizi", sectorSlug: "ecommerce", category: "cost",
  painStatement: "Müşteri kazanma maliyeti (CAC) ile yaşam boyu değer (CLV) arasındaki dengesizlik, pazarlama bütçesinin verimsiz kullanımına ve kârlılık sorunlarına yol açar.",
  inputs: [
    { id: "avgOrderValue", label: "Ortalama Sipariş Değeri", type: "number", unit: "USD", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "", expertMeaning: "Average order value (AOV)" },
    { id: "purchaseFreq", label: "Yıllık Satın Alma Sıklığı", type: "number", unit: "adet/yıl", required: true, smartDefault: 6, validation: { min: 0.1 }, helper: "", expertMeaning: "Purchase frequency per year" },
    { id: "lifespan", label: "Müşteri Yaşam Süresi", type: "number", unit: "yıl", required: true, smartDefault: 3, validation: { min: 0.5 }, helper: "", expertMeaning: "Average customer lifespan (years)" },
    { id: "grossMarginPct", label: "Brüt Marj", type: "number", unit: "%", required: true, smartDefault: 40, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Gross margin percentage" },
    { id: "retentionRate", label: "Müşteri Elde Tutma Oranı", type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual retention rate" },
    { id: "discountRate", label: "İskonto Oranı (WACC)", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV" },
    { id: "salesMarketing", label: "Satış & Pazarlama Gideri", type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Total sales & marketing spend" },
    { id: "salaries", label: "Satış Ekibi Maaşları", type: "number", unit: "USD", required: false, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "Sales team salaries" },
    { id: "overhead", label: "Genel Giderler", type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Allocated overhead" },
    { id: "newCustomers", label: "Yeni Müşteri Sayısı", type: "number", unit: "kişi", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "New customers acquired" },
    { id: "avgMonthlyGpInput", label: "Aylık Ort. Brüt Kâr (Müşteri Başına)", type: "number", unit: "USD", required: false, smartDefault: 35, validation: { min: 0 }, helper: "", expertMeaning: "Avg monthly gross profit per customer" },
  ],
  outputs: [
    { id: "clv", label: "CLV (Brüt)", unit: "USD", format: "currency" },
    { id: "gmClv", label: "Brüt Marj CLV", unit: "USD", format: "currency" },
    { id: "discountedClv", label: "İskontolu CLV", unit: "USD", format: "currency" },
    { id: "cac", label: "CAC", unit: "USD", format: "currency" },
    { id: "payback", label: "Geri Ödeme Süresi", unit: "ay", format: "number" },
    { id: "ltvCac", label: "LTV/CAC Oranı", unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "ltvCac", warning: 3, critical: 1, direction: "lower_is_bad", warningMessage: "LTV/CAC < 3 — pazarlama verimliliği iyileştirilmeli.", criticalMessage: "LTV/CAC < 1 — her müşteri zarar yazıyor, acil strateji değişikliği." },
  ],
  formulaPipeline: [
    { formulaId: "cost.clv", inputMap: { avgOrderValue: "avgOrderValue", purchaseFreq: "purchaseFreq", lifespan: "lifespan" }, outputId: "clv" },
    { formulaId: "cost.gross_margin_clv", inputMap: { clv: "clv", grossMarginPct: "grossMarginPct" }, outputId: "gmClv" },
    { formulaId: "cost.discounted_clv", inputMap: { grossMarginClv: "gmClv", retentionRate: "retentionRate", discountRate: "discountRate", lifespan: "lifespan" }, outputId: "discountedClv" },
    { formulaId: "cost.cac", inputMap: { salesMarketing: "salesMarketing", salaries: "salaries", overhead: "overhead", newCustomers: "newCustomers" }, outputId: "cac" },
    { formulaId: "cost.payback", inputMap: { cac: "cac", avgMonthlyGrossProfit: "avgMonthlyGpInput" }, outputId: "payback" },
    { formulaId: "cost.ltv_cac", inputMap: { discountedClv: "discountedClv", cac: "cac" }, outputId: "ltvCac" },
  ],
  reportTemplate: { title: "CLV/CAC Ratio Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["CLV = AOV × PurchaseFreq × Lifespan.", "DiscountedCLV uses retention rate churn model.", "CAC = (Sales+Marketing+Salaries+Overhead)/NewCustomers.", "LTV/CAC > 3 is healthy; < 1 is critical.", "Payback = CAC / MonthlyGrossProfit."] },
};
