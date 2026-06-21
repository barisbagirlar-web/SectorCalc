/**
 * Tool #21 — CLV/CAC Oranı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CLV_CAC_SCHEMA: PremiumCalculatorSchema = {
  id: "clv-cac-ratio-analyzer", legacyPaidSlug: "clv-cac-ratio-analyzer",
  name: "CLV / CAC Oranı Analizi", name_i18n: {"en":"CLV / CAC Oranı Analizi","tr":"CLV / CAC Oranı Analizi"}, sectorSlug: "ecommerce", category: "cost",
  painStatement: "Müşteri kazanma maliyeti (CAC) ile yaşam boyu değer (CLV) arasındaki dengesizlik, pazarlama bütçesinin verimsiz kullanımına ve kârlılık sorunlarına yol açar.", painStatement_i18n: {"en":"Müşteri kazanma maliyeti (CAC) ile yaşam boyu değer (CLV) arasındaki dengesizlik, pazarlama bütçesinin verimsiz kullanımına ve kârlılık sorunlarına yol açar.","tr":"Müşteri kazanma maliyeti (CAC) ile yaşam boyu değer (CLV) arasındaki dengesizlik, pazarlama bütçesinin verimsiz kullanımına ve kârlılık sorunlarına yol açar."},
  inputs: [
    { id: "avgOrderValue", label: "Ortalama Sipariş Değeri", label_i18n: {"en":"Ortalama Sipariş Değeri","tr":"Ortalama Sipariş Değeri"}, type: "number", unit: "USD", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "", expertMeaning: "Average order value (AOV)", expertMeaning_i18n: {"en":"Average order value (AOV)","tr":"Average order value (AOV)"} },
    { id: "purchaseFreq", label: "Yıllık Satın Alma Sıklığı", label_i18n: {"en":"Yıllık Satın Alma Sıklığı","tr":"Yıllık Satın Alma Sıklığı"}, type: "number", unit: "adet/yıl", required: true, smartDefault: 6, validation: { min: 0.1 }, helper: "", expertMeaning: "Purchase frequency per year", expertMeaning_i18n: {"en":"Purchase frequency per year","tr":"Purchase frequency per year"} },
    { id: "lifespan", label: "Müşteri Yaşam Süresi", label_i18n: {"en":"Müşteri Yaşam Süresi","tr":"Müşteri Yaşam Süresi"}, type: "number", unit: "yıl", required: true, smartDefault: 3, validation: { min: 0.5 }, helper: "", expertMeaning: "Average customer lifespan (years)", expertMeaning_i18n: {"en":"Average customer lifespan (years)","tr":"Average customer lifespan (years)"} },
    { id: "grossMarginPct", label: "Brüt Marj", label_i18n: {"en":"Brüt Marj","tr":"Brüt Marj"}, type: "number", unit: "%", required: true, smartDefault: 40, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Gross margin percentage", expertMeaning_i18n: {"en":"Gross margin percentage","tr":"Gross margin percentage"} },
    { id: "retentionRate", label: "Müşteri Elde Tutma Oranı", label_i18n: {"en":"Müşteri Elde Tutma Oranı","tr":"Müşteri Elde Tutma Oranı"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual retention rate", expertMeaning_i18n: {"en":"Annual retention rate","tr":"Annual retention rate"} },
    { id: "discountRate", label: "İskonto Oranı (WACC)", label_i18n: {"en":"İskonto Oranı (WACC)","tr":"İskonto Oranı (WACC)"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for NPV", expertMeaning_i18n: {"en":"Discount rate for NPV","tr":"Discount rate for NPV"} },
    { id: "salesMarketing", label: "Satış & Pazarlama Gideri", label_i18n: {"en":"Satış & Pazarlama Gideri","tr":"Satış & Pazarlama Gideri"}, type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Total sales & marketing spend", expertMeaning_i18n: {"en":"Total sales & marketing spend","tr":"Total sales & marketing spend"} },
    { id: "salaries", label: "Satış Ekibi Maaşları", label_i18n: {"en":"Satış Ekibi Maaşları","tr":"Satış Ekibi Maaşları"}, type: "number", unit: "USD", required: false, smartDefault: 30000, validation: { min: 0 }, helper: "", expertMeaning: "Sales team salaries", expertMeaning_i18n: {"en":"Sales team salaries","tr":"Sales team salaries"} },
    { id: "overhead", label: "Genel Giderler", label_i18n: {"en":"Genel Giderler","tr":"Genel Giderler"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Allocated overhead", expertMeaning_i18n: {"en":"Allocated overhead","tr":"Allocated overhead"} },
    { id: "newCustomers", label: "Yeni Müşteri Sayısı", label_i18n: {"en":"Yeni Müşteri Sayısı","tr":"Yeni Müşteri Sayısı"}, type: "number", unit: "kişi", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "New customers acquired", expertMeaning_i18n: {"en":"New customers acquired","tr":"New customers acquired"} },
    { id: "avgMonthlyGpInput", label: "Aylık Ort. Brüt Kâr (Müşteri Başına)", label_i18n: {"en":"Aylık Ort. Brüt Kâr (Müşteri Başına)","tr":"Aylık Ort. Brüt Kâr (Müşteri Başına)"}, type: "number", unit: "USD", required: false, smartDefault: 35, validation: { min: 0 }, helper: "", expertMeaning: "Avg monthly gross profit per customer", expertMeaning_i18n: {"en":"Avg monthly gross profit per customer","tr":"Avg monthly gross profit per customer"} },
  ],
  outputs: [
    { id: "clv", label: "CLV (Brüt)", label_i18n: {"en":"CLV (Brüt)","tr":"CLV (Brüt)"}, unit: "USD", format: "currency" },
    { id: "gmClv", label: "Brüt Marj CLV", label_i18n: {"en":"Brüt Marj CLV","tr":"Brüt Marj CLV"}, unit: "USD", format: "currency" },
    { id: "discountedClv", label: "İskontolu CLV", label_i18n: {"en":"İskontolu CLV","tr":"İskontolu CLV"}, unit: "USD", format: "currency" },
    { id: "cac", label: "CAC", label_i18n: {"en":"CAC","tr":"CAC"}, unit: "USD", format: "currency" },
    { id: "payback", label: "Geri Ödeme Süresi", label_i18n: {"en":"Geri Ödeme Süresi","tr":"Geri Ödeme Süresi"}, unit: "ay", format: "number" },
    { id: "ltvCac", label: "LTV/CAC Oranı", label_i18n: {"en":"LTV/CAC Oranı","tr":"LTV/CAC Oranı"}, unit: "", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "ltvCac", warning: 3, critical: 1, direction: "lower_is_bad", warningMessage: "LTV/CAC < 3 — pazarlama verimliliği iyileştirilmeli.", warningMessage_i18n: {"en":"LTV/CAC < 3 — pazarlama verimliliği iyileştirilmeli.","tr":"LTV/CAC < 3 — pazarlama verimliliği iyileştirilmeli."}, criticalMessage: "LTV/CAC < 1 — her müşteri zarar yazıyor, acil strateji değişikliği.", criticalMessage_i18n: {"en":"LTV/CAC < 1 — her müşteri zarar yazıyor, acil strateji değişikliği.","tr":"LTV/CAC < 1 — her müşteri zarar yazıyor, acil strateji değişikliği."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.clv", inputMap: { avgOrderValue: "avgOrderValue", purchaseFreq: "purchaseFreq", lifespan: "lifespan" }, outputId: "clv" },
    { formulaId: "cost.gross_margin_clv", inputMap: { clv: "clv", grossMarginPct: "grossMarginPct" }, outputId: "gmClv" },
    { formulaId: "cost.discounted_clv", inputMap: { grossMarginClv: "gmClv", retentionRate: "retentionRate", discountRate: "discountRate", lifespan: "lifespan" }, outputId: "discountedClv" },
    { formulaId: "cost.cac", inputMap: { salesMarketing: "salesMarketing", salaries: "salaries", overhead: "overhead", newCustomers: "newCustomers" }, outputId: "cac" },
    { formulaId: "cost.payback", inputMap: { cac: "cac", avgMonthlyGrossProfit: "avgMonthlyGpInput" }, outputId: "payback" },
    { formulaId: "cost.ltv_cac", inputMap: { discountedClv: "discountedClv", cac: "cac" }, outputId: "ltvCac" },
  ],
  reportTemplate: { title: "CLV/CAC Ratio Report", title_i18n: {"en":"CLV/CAC Ratio Report","tr":"CLV/CAC Ratio Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["CLV = AOV × PurchaseFreq × Lifespan.", "DiscountedCLV uses retention rate churn model.", "CAC = (Sales+Marketing+Salaries+Overhead)/NewCustomers.", "LTV/CAC > 3 is healthy; < 1 is critical.", "Payback = CAC / MonthlyGrossProfit."],assumptionNotes_i18n:[{"en":"CLV = AOV × PurchaseFreq × Lifespan.","tr":"CLV = AOV × PurchaseFreq × Lifespan."},{"en":"DiscountedCLV uses retention rate churn model.","tr":"DiscountedCLV uses retention rate churn model."},{"en":"CAC = (Sales+Marketing+Salaries+Overhead)/NewCustomers.","tr":"CAC = (Sales+Marketing+Salaries+Overhead)/NewCustomers."},{"en":"LTV/CAC > 3 is healthy; < 1 is critical.","tr":"LTV/CAC > 3 is healthy; < 1 is critical."},{"en":"Payback = CAC / MonthlyGrossProfit.","tr":"Payback = CAC / MonthlyGrossProfit."}] },
};
