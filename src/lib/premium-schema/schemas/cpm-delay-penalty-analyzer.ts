/**
 * Tool #25 — CPM Gecikme Cezası
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CPM_DELAY_SCHEMA: PremiumCalculatorSchema = {
  id: "cpm-delay-penalty-analyzer", legacyPaidSlug: "cpm-delay-penalty-analyzer",
  name: "CPM Gecikme Cezası & EOT Talep Analizi", sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat projelerinde gecikme cezaları ve EOT talepleri doğru hesaplanmazsa taşeron ve ana yüklenici arasında uyuşmazlık kaçınılmazdır.",
  inputs: [
    { id: "plannedDuration", label: "Planlanan Süre", type: "number", unit: "gün", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned project duration" },
    { id: "actualDuration", label: "Gerçek Süre", type: "number", unit: "gün", required: true, smartDefault: 240, validation: { min: 1 }, helper: "", expertMeaning: "Actual project duration" },
    { id: "totalFloat", label: "Toplam Float", type: "number", unit: "gün", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Total float on critical path" },
    { id: "forceMajeure", label: "Mücbir Sebep Günü", type: "number", unit: "gün", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Force majeure days" },
    { id: "ownerCaused", label: "İşveren Kaynaklı Gecikme", type: "number", unit: "gün", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Employer-caused delay" },
    { id: "dailyPenalty", label: "Günlük Gecikme Cezası", type: "number", unit: "USD/gün", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Daily liquidated damages" },
    { id: "accelerationCost", label: "Hızlandırma Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Crashing/acceleration cost" },
    { id: "effFactor", label: "Verimlilik Faktörü", type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Efficiency factor" },
    { id: "excusableDelay", label: "Affedilebilir Gecikme (Excusable Delay)", type: "number", unit: "gün", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Force majeure + owner caused delays" },
  ],
  outputs: [
    { id: "criticalDelay", label: "Kritik Gecikme", unit: "gün", format: "number" },
    { id: "excusableDelay", label: "Affedilebilir Gecikme", unit: "gün", format: "number" },
    { id: "nonExcusable", label: "Affedilemez Gecikme", unit: "gün", format: "number" },
    { id: "liquidatedDamages", label: "Sıvılaştırılmış Tazminat", unit: "USD", format: "currency" },
    { id: "netPenalty", label: "Net Ceza", unit: "USD", format: "currency" },
    { id: "eotClaim", label: "EOT Talep Hakkı", unit: "gün", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "liquidatedDamages", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Ceza > $50K — hızlandırma veya EOT değerlendirilmeli.", criticalMessage: "Ceza > $150K — hukuki süreç riski yüksek." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cpm_critical_delay", inputMap: { actualDuration: "actualDuration", plannedDuration: "plannedDuration", totalFloat: "totalFloat" }, outputId: "criticalDelay" },
    { formulaId: "measurement.cpm_non_excusable", inputMap: { criticalDelay: "criticalDelay", forceMajeure: "forceMajeure", ownerCaused: "ownerCaused" }, outputId: "nonExcusable" },
    { formulaId: "cost.cpm_liquidated_damages", inputMap: { nonExcusable: "nonExcusable", dailyPenalty: "dailyPenalty" }, outputId: "liquidatedDamages" },
    { formulaId: "cost.cpm_net_penalty", inputMap: { liquidatedDamages: "liquidatedDamages", accelerationCost: "accelerationCost" }, outputId: "netPenalty" },
    { formulaId: "measurement.cpm_eot_claim", inputMap: { excusableDelay: "excusableDelay", effFactor: "effFactor" }, outputId: "eotClaim" },
  ],
  reportTemplate: { title: "CPM Delay Penalty Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Critical delay = MAX(0, Actual-Planned-Float).", "Excusable = ForceMajeure+OwnerCaused.", "LD = NonExcusable×DailyPenalty.", "EOT = Excusable×(1-Efficiency)."] },
};
