/**
 * Tool #25 — CPM Gecikme Cezası
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CPM_DELAY_SCHEMA: PremiumCalculatorSchema = {
  id: "cpm-delay-penalty-analyzer", legacyPaidSlug: "cpm-delay-penalty-analyzer",
  name: "CPM Gecikme Cezası & EOT Talep Analizi", name_i18n: {"en":"CPM Delay Penalty & EOT Claim Analysis","tr":"CPM Gecikme Cezası & EOT Talep Analizi"}, sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat projelerinde gecikme cezaları ve EOT talepleri doğru hesaplanmazsa taşeron ve ana yüklenici arasında uyuşmazlık kaçınılmazdır.", painStatement_i18n: {"en":"If delay penalties and EOT claims are not calculated correctly in construction projects, disputes between subcontractor and main contractor are inevitable.","tr":"İnşaat projelerinde gecikme cezaları ve EOT talepleri doğru hesaplanmazsa taşeron ve ana yüklenici arasında uyuşmazlık kaçınılmazdır."},
  inputs: [
    { id: "plannedDuration", label: "Planlanan Süre", label_i18n: {"en":"Planned Duration","tr":"Planlanan Süre"}, type: "number", unit: "gün", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Planned project duration", expertMeaning_i18n: {"en":"Planned project duration","tr":"Planlanan proje süresi"} },
    { id: "actualDuration", label: "Gerçek Süre", label_i18n: {"en":"Actual Duration","tr":"Gerçek Süre"}, type: "number", unit: "gün", required: true, smartDefault: 240, validation: { min: 1 }, helper: "", expertMeaning: "Actual project duration", expertMeaning_i18n: {"en":"Actual project duration","tr":"Gerçek proje süresi"} },
    { id: "totalFloat", label: "Toplam Float", label_i18n: {"en":"Total Float","tr":"Toplam Float"}, type: "number", unit: "gün", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Total float on critical path", expertMeaning_i18n: {"en":"Total float on critical path","tr":"Kritik yoldaki toplam float"} },
    { id: "forceMajeure", label: "Mücbir Sebep Günü", label_i18n: {"en":"Force Majeure Days","tr":"Mücbir Sebep Günü"}, type: "number", unit: "gün", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Force majeure days", expertMeaning_i18n: {"en":"Force majeure days","tr":"Mücbir sebep günleri"} },
    { id: "ownerCaused", label: "İşveren Kaynaklı Gecikme", label_i18n: {"en":"Employer-Caused Delay","tr":"İşveren Kaynaklı Gecikme"}, type: "number", unit: "gün", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Employer-caused delay", expertMeaning_i18n: {"en":"Employer-caused delay","tr":"İşveren kaynaklı gecikme"} },
    { id: "dailyPenalty", label: "Günlük Gecikme Cezası", label_i18n: {"en":"Daily Delay Penalty","tr":"Günlük Gecikme Cezası"}, type: "number", unit: "USD/gün", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Daily liquidated damages", expertMeaning_i18n: {"en":"Daily liquidated damages","tr":"Günlük sıvılaştırılmış tazminat"} },
    { id: "accelerationCost", label: "Hızlandırma Maliyeti", label_i18n: {"en":"Acceleration Cost","tr":"Hızlandırma Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Crashing/acceleration cost", expertMeaning_i18n: {"en":"Crashing/acceleration cost","tr":"Hızlandırma maliyeti"} },
    { id: "effFactor", label: "Verimlilik Faktörü", label_i18n: {"en":"Efficiency Factor","tr":"Verimlilik Faktörü"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Efficiency factor", expertMeaning_i18n: {"en":"Efficiency factor","tr":"Verimlilik faktörü"} },
    { id: "excusableDelay", label: "Affedilebilir Gecikme (Excusable Delay)", label_i18n: {"en":"Excusable Delay","tr":"Affedilebilir Gecikme (Excusable Delay)"}, type: "number", unit: "gün", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Force majeure + owner caused delays", expertMeaning_i18n: {"en":"Force majeure + owner caused delays","tr":"Mücbir sebep + işveren kaynaklı gecikmeler"} },
  ],
  outputs: [
    { id: "criticalDelay", label: "Kritik Gecikme", label_i18n: {"en":"Critical Delay","tr":"Kritik Gecikme"}, unit: "gün", format: "number" },
    { id: "excusableDelay", label: "Affedilebilir Gecikme", label_i18n: {"en":"Excusable Delay","tr":"Affedilebilir Gecikme"}, unit: "gün", format: "number" },
    { id: "nonExcusable", label: "Affedilemez Gecikme", label_i18n: {"en":"Non-Excusable Delay","tr":"Affedilemez Gecikme"}, unit: "gün", format: "number" },
    { id: "liquidatedDamages", label: "Sıvılaştırılmış Tazminat", label_i18n: {"en":"Liquidated Damages","tr":"Sıvılaştırılmış Tazminat"}, unit: "USD", format: "currency" },
    { id: "netPenalty", label: "Net Ceza", label_i18n: {"en":"Net Penalty","tr":"Net Ceza"}, unit: "USD", format: "currency" },
    { id: "eotClaim", label: "EOT Talep Hakkı", label_i18n: {"en":"EOT Claim Right","tr":"EOT Talep Hakkı"}, unit: "gün", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "liquidatedDamages", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Ceza > $50K — hızlandırma veya EOT değerlendirilmeli.", warningMessage_i18n: {"en":"Penalty > $50K — evaluate acceleration or EOT.","tr":"Ceza > $50K — hızlandırma veya EOT değerlendirilmeli."}, criticalMessage: "Ceza > $150K — hukuki süreç riski yüksek.", criticalMessage_i18n: {"en":"Penalty > $150K — legal process risk is high.","tr":"Ceza > $150K — hukuki süreç riski yüksek."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cpm_critical_delay", inputMap: { actualDuration: "actualDuration", plannedDuration: "plannedDuration", totalFloat: "totalFloat" }, outputId: "criticalDelay" },
    { formulaId: "measurement.cpm_non_excusable", inputMap: { criticalDelay: "criticalDelay", forceMajeure: "forceMajeure", ownerCaused: "ownerCaused" }, outputId: "nonExcusable" },
    { formulaId: "cost.cpm_liquidated_damages", inputMap: { nonExcusable: "nonExcusable", dailyPenalty: "dailyPenalty" }, outputId: "liquidatedDamages" },
    { formulaId: "cost.cpm_net_penalty", inputMap: { liquidatedDamages: "liquidatedDamages", accelerationCost: "accelerationCost" }, outputId: "netPenalty" },
    { formulaId: "measurement.cpm_eot_claim", inputMap: { excusableDelay: "excusableDelay", effFactor: "effFactor" }, outputId: "eotClaim" },
  ],
  reportTemplate: { title: "CPM Delay Penalty Report", title_i18n: {"en":"CPM Delay Penalty Report","tr":"CPM Delay Penalty Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Critical delay = MAX(0, Actual-Planned-Float).", "Excusable = ForceMajeure+OwnerCaused.", "LD = NonExcusable×DailyPenalty.", "EOT = Excusable×(1-Efficiency)."],assumptionNotes_i18n:[{"en":"Critical delay = MAX(0, Actual-Planned-Float).","tr":"Critical delay = MAX(0, Actual-Planned-Float)."},{"en":"Excusable = ForceMajeure+OwnerCaused.","tr":"Excusable = ForceMajeure+OwnerCaused."},{"en":"LD = NonExcusable×DailyPenalty.","tr":"LD = NonExcusable×DailyPenalty."},{"en":"EOT = Excusable×(1-Efficiency).","tr":"EOT = Excusable×(1-Efficiency)."}] },
};
