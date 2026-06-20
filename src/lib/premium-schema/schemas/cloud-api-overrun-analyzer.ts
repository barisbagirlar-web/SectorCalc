/**
 * Tool #19 — Cloud API Overrun Maliyeti
 * OverrunRequests → Throttling → DataEgress → SLAPenalty → Total
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CLOUD_API_OVERRUN_SCHEMA: PremiumCalculatorSchema = {
  id: "cloud-api-overrun-analyzer", legacyPaidSlug: "cloud-api-overrun-analyzer",
  name: "Cloud API Overrun Maliyet Analizi", sectorSlug: "it-cloud", category: "cost",
  painStatement: "API aşım, throttling ve data egress maliyetleri faturalarda sürpriz kalemlerdir. SLA ihlalleri ek cezalar getirir. Bu araç toplam overrun maliyetini hesaplar.",
  inputs: [
    { id: "monthlyTotalRequests", label: "Aylık Toplam İstek", type: "number", unit: "adet", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Total monthly API requests" },
    { id: "includedRequests", label: "Pakete Dahil İstek", type: "number", unit: "adet", required: true, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Included requests in plan" },
    { id: "overageRate", label: "Aşım Ücreti", type: "number", unit: "USD/istek", required: true, smartDefault: 0.0005, validation: { min: 0 }, helper: "", expertMeaning: "Per-request overage charge" },
    { id: "throttledRequests", label: "Throttle/Retry Sayısı", type: "number", unit: "adet", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Number of throttled requests" },
    { id: "retryCostPerRequest", label: "Retry Başına Maliyet", type: "number", unit: "USD", required: false, smartDefault: 0.001, validation: { min: 0 }, helper: "", expertMeaning: "Cost per retry attempt" },
    { id: "avgRetries", label: "Ortalama Retry Sayısı", type: "number", unit: "", required: false, smartDefault: 2, validation: { min: 1 }, helper: "", expertMeaning: "Average retries per throttle" },
    { id: "dataEgressGb", label: "Veri Çıkışı (Egress)", type: "number", unit: "GB", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Monthly data egress volume" },
    { id: "egressRatePerGb", label: "Egress Birim Fiyat", type: "number", unit: "USD/GB", required: false, smartDefault: 0.09, validation: { min: 0 }, helper: "", expertMeaning: "Cloud egress per GB" },
    { id: "slaUptimeCommitment", label: "SLA Uptime Taahhüdü", type: "number", unit: "%", required: false, smartDefault: 99.9, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "SLA commitment level" },
    { id: "actualUptime", label: "Gerçek Uptime", type: "number", unit: "%", required: false, smartDefault: 99.5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Actual measured uptime" },
    { id: "monthlyFee", label: "Aylık Abonelik Ücreti", type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Monthly service fee" },
    { id: "dataEgressCostInput", label: "Data Egress Maliyeti (Tahmini)", type: "number", unit: "USD", required: false, smartDefault: 9, validation: { min: 0 }, helper: "Veri çıkışının aylık maliyeti.", expertMeaning: "Monthly data egress cost" },
    { id: "slaPenaltyInput", label: "SLA İhlal Cezası", type: "number", unit: "USD", required: false, smartDefault: 25, validation: { min: 0 }, helper: "SLA ihlali durumunda uygulanan ceza.", expertMeaning: "SLA violation penalty" },
  ],
  outputs: [
    { id: "overrunCost", label: "Aşım Maliyeti", unit: "USD", format: "currency" },
    { id: "throttlingCost", label: "Throttle Maliyeti", unit: "USD", format: "currency" },
    { id: "dataEgressCost", label: "Data Egress Maliyeti", unit: "USD", format: "currency" },
    { id: "slaPenalty", label: "SLA İhlal Cezası", unit: "USD", format: "currency" },
    { id: "totalOverrunCost", label: "Toplam Overrun Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalOverrunCost", warning: 1000, critical: 10000, direction: "higher_is_bad", warningMessage: "Overrun > $1K — plan yükseltme veya optimizasyon düşünülmeli.", criticalMessage: "Overrun > $10K — acil maliyet optimizasyonu ve tedarikçi değerlendirmesi." },
  ],
  formulaPipeline: [
    { formulaId: "cost.cloud_overrun_cost", inputMap: { totalRequests: "monthlyTotalRequests", includedRequests: "includedRequests", overageRate: "overageRate" }, outputId: "overrunCost" },
    { formulaId: "cost.cloud_throttling_cost", inputMap: { throttledRequests: "throttledRequests", retryCost: "retryCostPerRequest", avgRetries: "avgRetries" }, outputId: "throttlingCost" },
    { formulaId: "cost.cloud_overrun_total", inputMap: { overrunCost: "overrunCost", throttlingCost: "throttlingCost", dataEgressCost: "dataEgressCostInput", slaPenalty: "slaPenaltyInput" }, outputId: "totalOverrunCost" },
  ],
  reportTemplate: { title: "Cloud API Overrun Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Overrun = MAX(0, Total - Included) × Overage rate.", "Throttling cost = Throttled × Retry cost × Avg retries.", "Data egress = GB × Egress rate (typically $0.09-$0.12/GB).", "SLA penalty = IF(Actual < Commitment) then Monthly fee × Credit %.", "SLA credits typically 5-10% of monthly fee per violation."] },
};
