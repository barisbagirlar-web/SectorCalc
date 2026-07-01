/**
 * Tool #25 — CPM Gecikme Cezası
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CPM_DELAY_SCHEMA: PremiumCalculatorSchema = {
  id: "cpm-delay-penalty-analyzer", legacyPaidSlug: "cpm-delay-penalty-analyzer",
  name: "CPM Gecikme Cezası & EOT Talep Analizi", name_i18n: {"en":"CPM Delay Penalty & EOT Claim Analyzer","tr":"CPM Gecikme Cezası & EOT Talep Analizi"}, sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat projelerinde gecikme cezaları ve EOT talepleri doğru hesaplanmazsa taşeron ve ana yüklenici arasında uyuşmazlık kaçınılmazdır.", painStatement_i18n: {"en":"İnşaat projelerinde gecikme cezaları ve EOT talepleri doğru hesaplanmazsa taşeron ve ana yüklenici arasında uyuşmazlık kaçınılmazdır.","tr":"İnşaat projelerinde gecikme cezaları ve EOT talepleri doğru hesaplanmazsa taşeron ve ana yüklenici arasında uyuşmazlık kaçınılmazdır."},
  inputs: [
    { id: "plannedDuration", label: "Planlanan Süre", label_i18n: {"en":"Planned project duration","tr":"Planlanan Süre"}, type: "number", unit: "gün", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned project duration", expertMeaning_i18n: {"en":"Planned project duration","tr":"planlanan süre"} },
    { id: "actualDuration", label: "Gerçek Süre", label_i18n: {"en":"Actual project duration","tr":"Gerçek Süre"}, type: "number", unit: "gün", required: true, smartDefault: 240, validation: { min: 1 }, helper: "", expertMeaning: "Actual project duration", expertMeaning_i18n: {"en":"Actual project duration","tr":"gerçek süre"} },
    { id: "totalFloat", label: "Toplam Float", label_i18n: {"en":"Toplam Float","tr":"Toplam Float"}, type: "number", unit: "gün", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Total float on critical path", expertMeaning_i18n: {"en":"Total float on critical path","tr":"Total float on critical path"} },
    { id: "forceMajeure", label: "Mücbir Sebep Günü", label_i18n: {"en":"Force majeure days","tr":"Mücbir Sebep Günü"}, type: "number", unit: "gün", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Force majeure days", expertMeaning_i18n: {"en":"Force majeure days","tr":"mücbir sebep günü"} },
    { id: "ownerCaused", label: "İşveren Kaynaklı Gecikme", label_i18n: {"en":"Employer-caused delay","tr":"İşveren Kaynaklı Gecikme"}, type: "number", unit: "gün", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Employer-caused delay", expertMeaning_i18n: {"en":"Employer-caused delay","tr":"i̇şveren kaynaklı gecikme"} },
    { id: "dailyPenalty", label: "Günlük Gecikme Cezası", label_i18n: {"en":"Daily liquidated damages","tr":"Günlük Gecikme Cezası"}, type: "number", unit: "USD/gün", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Daily liquidated damages", expertMeaning_i18n: {"en":"Daily liquidated damages","tr":"günlük gecikme cezası"} },
    { id: "accelerationCost", label: "Hızlandırma Maliyeti", label_i18n: {"en":"Crashing/acceleration cost","tr":"Hızlandırma Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Crashing/acceleration cost", expertMeaning_i18n: {"en":"Crashing/acceleration cost","tr":"hızlandırma maliyeti"} },
    { id: "effFactor", label: "Verimlilik Faktörü", label_i18n: {"en":"Efficiency factor","tr":"Verimlilik Faktörü"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Efficiency factor", expertMeaning_i18n: {"en":"Efficiency factor","tr":"verimlilik faktörü"} },
    { id: "excusableDelay", label: "Affedilebilir Gecikme (Excusable Delay)", label_i18n: {"en":"Affedilebilir Gecikme (Excusable Delay)","tr":"Affedilebilir Gecikme (Excusable Delay)"}, type: "number", unit: "gün", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Force majeure + owner caused delays", expertMeaning_i18n: {"en":"Force majeure + owner caused delays","tr":"Force majeure + owner caused delays"} },
  ],
  outputs: [
    { id: "criticalDelay", label: "Kritik Gecikme", label_i18n: {"en":"Kritik Gecikme","tr":"Kritik Gecikme"}, unit: "gün", format: "number" },
    { id: "excusableDelay", label: "Affedilebilir Gecikme", label_i18n: {"en":"Affedilebilir Gecikme","tr":"Affedilebilir Gecikme"}, unit: "gün", format: "number" },
    { id: "nonExcusable", label: "Affedilemez Gecikme", label_i18n: {"en":"Affedilemez Gecikme","tr":"Affedilemez Gecikme"}, unit: "gün", format: "number" },
    { id: "liquidatedDamages", label: "Sıvılaştırılmış Tazminat", label_i18n: {"en":"Svlastrlms Tazminat","tr":"Sıvılaştırılmış Tazminat"}, unit: "USD", format: "currency" },
    { id: "netPenalty", label: "Net Ceza", label_i18n: {"en":"Net Ceza","tr":"Net Ceza"}, unit: "USD", format: "currency" },
    { id: "eotClaim", label: "EOT Talep Hakkı", label_i18n: {"en":"EOT Talep Hakk","tr":"EOT Talep Hakkı"}, unit: "gün", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "liquidatedDamages", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Ceza > $50K — hızlandırma veya EOT değerlendirilmeli.", warningMessage_i18n: {"en":"Ceza > $50K — hızlandırma veya EOT değerlendirilmeli.","tr":"Ceza > $50K — hızlandırma veya EOT değerlendirilmeli."}, criticalMessage: "Ceza > $150K — hukuki süreç riski yüksek.", criticalMessage_i18n: {"en":"Ceza > $150K — hukuki süreç riski yüksek.","tr":"Ceza > $150K — hukuki süreç riski yüksek."} },
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
  reportTemplate: { title: "CPM Delay Penalty Report", title_i18n: {"en":"CPM Delay Penalty Report","tr":"CPM Delay Penalty Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Critical delay = MAX(0, Actual-Planned-Float).", "Excusable = ForceMajeure+OwnerCaused.", "LD = NonExcusable×DailyPenalty.", "EOT = Excusable×(1-Efficiency)."],assumptionNotes_i18n:[{"en":"Critical delay = MAX(0, Actual-Planned-Float).","tr":"Critical delay = MAX(0, Actual-Planned-Float)."},{"en":"Excusable = ForceMajeure+OwnerCaused.","tr":"Excusable = ForceMajeure+OwnerCaused."},{"en":"LD = NonExcusable×DailyPenalty.","tr":"LD = NonExcusable×DailyPenalty."},{"en":"EOT = Excusable×(1-Efficiency).","tr":"EOT = Excusable×(1-Efficiency)."}] },
};
