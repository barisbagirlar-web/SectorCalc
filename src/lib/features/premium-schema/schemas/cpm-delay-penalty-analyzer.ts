/**
 * Tool #25 — CPM Gecikme Cezası
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CPM_DELAY_SCHEMA: PremiumCalculatorSchema = {
  id: "cpm-delay-penalty-analyzer", legacyPaidSlug: "cpm-delay-penalty-analyzer",
  name: "CPM Delay Penalty & EOT Claim Analyzer", name_i18n: {"en":"CPM Delay Penalty & EOT Claim Analyzer"}, sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat projelerinde gecikme cezaları ve EOT talepleri doğru hesaplanmazsa taşeron ve ana yüklenici arasında uyuşmazlık kaçınılmazdır.", painStatement_i18n: {"en":"İnşaat projelerinde gecikme cezaları ve EOT talepleri accurate if not calculated taşeron ve ana yüklenici arasında dispute kaçınılmazdır."},
  inputs: [
    { id: "plannedDuration", label: "Planlanan Süre", label_i18n: {"en":"Planned project duration"}, type: "number", unit: "gün", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned project duration", expertMeaning_i18n: {"en":"Planned project duration"} },
    { id: "actualDuration", label: "Actual project duration", label_i18n: {"en":"Actual project duration"}, type: "number", unit: "gün", required: true, smartDefault: 240, validation: { min: 1 }, helper: "", expertMeaning: "Actual project duration", expertMeaning_i18n: {"en":"Actual project duration"} },
    { id: "totalFloat", label: "Toplam Float", label_i18n: {"en":"Total Float"}, type: "number", unit: "gün", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Total float on critical path", expertMeaning_i18n: {"en":"Total float pre critical path"} },
    { id: "forceMajeure", label: "Mücbir Sebep Günü", label_i18n: {"en":"Force majeure days"}, type: "number", unit: "gün", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Force majeure days", expertMeaning_i18n: {"en":"Force majeure days"} },
    { id: "ownerCaused", label: "Employer-caused delay", label_i18n: {"en":"Employer-caused delay"}, type: "number", unit: "gün", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Employer-caused delay", expertMeaning_i18n: {"en":"Employer-caused delay"} },
    { id: "dailyPenalty", label: "Daily liquidated damages", label_i18n: {"en":"Daily liquidated damages"}, type: "number", unit: "USD/gün", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Daily liquidated damages", expertMeaning_i18n: {"en":"Daily liquidated damages"} },
    { id: "accelerationCost", label: "Crashing/acceleration cost", label_i18n: {"en":"Crashing/acceleration cost"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Crashing/acceleration cost", expertMeaning_i18n: {"en":"Crashing/acceleration cost"} },
    { id: "effFactor", label: "Verimlilik Faktörü", label_i18n: {"en":"Efficiency factor"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Efficiency factor", expertMeaning_i18n: {"en":"Efficiency factor"} },
    { id: "excusableDelay", label: "Affedilebilir Gecikme (Excusable Delay)", label_i18n: {"en":"Affedilebilir Gecikme (Excusable Delay)"}, type: "number", unit: "gün", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Force majeure + owner caused delays", expertMeaning_i18n: {"en":"Force majeure + owner caused delays"} },
  ],
  outputs: [
    { id: "criticalDelay", label: "Kritik Gecikme", label_i18n: {"en":"Kritik Gecikme"}, unit: "gün", format: "number" },
    { id: "excusableDelay", label: "Affedilebilir Gecikme", label_i18n: {"en":"Affedilebilir Gecikme"}, unit: "gün", format: "number" },
    { id: "nonExcusable", label: "Affedilemez Gecikme", label_i18n: {"en":"Affedilemez Gecikme"}, unit: "gün", format: "number" },
    { id: "liquidatedDamages", label: "Svlastrlms Tazminat", label_i18n: {"en":"Svlastrlms compensation"}, unit: "USD", format: "currency" },
    { id: "netPenalty", label: "Net Ceza", label_i18n: {"en":"Net penalty"}, unit: "USD", format: "currency" },
    { id: "eotClaim", label: "EOT Talep Hakk", label_i18n: {"en":"EOT demand Hakk"}, unit: "gün", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "liquidatedDamages", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Ceza > $50K — hızlandırma veya EOT değerlendirilmeli.", warningMessage_i18n: {"en":"penalty > $50K — hızlandırma veya EOT değerlendirilmeli."}, criticalMessage: "Ceza > $150K — hukuki süreç riski yüksek.", criticalMessage_i18n: {"en":"penalty > $150K — legal süreç riski yüksek."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cpm_critical_delay", inputMap: { actualDuration: "actualDuration", plannedDuration: "plannedDuration", totalFloat: "totalFloat" }, outputId: "criticalDelay" },
    { formulaId: "measurement.cpm_non_excusable", inputMap: {
        criticalDelay: "criticalDelay",
        excusableDelay: "forceMajeure",
        ownerCaused: "ownerCaused"
      }, outputId: "nonExcusable" },
    { formulaId: "cost.cpm_liquidated_damages", inputMap: { nonExcusable: "nonExcusable", dailyPenalty: "dailyPenalty" }, outputId: "liquidatedDamages" },
    { formulaId: "cost.cpm_net_penalty", inputMap: { liquidatedDamages: "liquidatedDamages", accelerationCost: "accelerationCost" }, outputId: "netPenalty" },
    { formulaId: "measurement.cpm_eot_claim", inputMap: { excusableDelay: "excusableDelay", effFactor: "effFactor" }, outputId: "eotClaim" },
  ],
  reportTemplate: { title: "CPM Delay Penalty Report", title_i18n: {"en":"CPM Delay Penalty Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Critical delay = MAX(0, Actual-Planned-Float).", "Excusable = ForceMajeure+OwnerCaused.", "LD = NonExcusable×DailyPenalty.", "EOT = Excusable×(1-Efficiency)."],assumptionNotes_i18n:[{"en":"Critical delay = MAX(0, Actual-Planned-Float)."},{"en":"Excusable = ForceMajeure+OwnerCaused."},{"en":"LD = NonExcusable×DailyPenalty."},{"en":"EOT = Excusable×(1-Efficiency)."}] },
};
