/**
 * Tool — Süt Kâr Dedektörü
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DAIRY_PROFIT_DETECTOR_ANALYZER: PremiumCalculatorSchema = {
  id: "dairy-profit-detector-analyzer", legacyPaidSlug: "dairy-profit-detector-analyzer",
  name: "Süt Kâr Dedektörü", name_i18n: {"en":"Sut Kar Dedektoru"}, sectorSlug: "food", category: "cost",
  painStatement: "Süt çiftliklerinde yem maliyeti ile süt geliri arasındaki fark izlenmezse kârlılık fark edilmeden erir ve işletme zarar eder.", painStatement_i18n: {"en":"Süt çiftliklerinde yem maliyeti ile süt geliri arasındaki fark izlenmezse kârlılık fark edilmeden erir ve işletme zarar eder."},
  inputs: [
    { id: "milkYieldPerCow", label: "İnek Başına Süt Verimi", label_i18n: {"en":"Daily milk yield per cow"}, type: "number", unit: "kg/gün", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Daily milk yield per cow", expertMeaning_i18n: {"en":"Daily milk yield per cow"} },
    { id: "milkFatPct", label: "Süt Yağ Oranı", label_i18n: {"en":"Milk fat percentage"}, type: "number", unit: "%", required: true, smartDefault: 3.8, validation: { min: 2, max: 7 }, helper: "", expertMeaning: "Milk fat percentage", expertMeaning_i18n: {"en":"Milk fat percentage"} },
    { id: "milkProteinPct", label: "Süt Protein Oranı", label_i18n: {"en":"Milk protein percentage"}, type: "number", unit: "%", required: true, smartDefault: 3.2, validation: { min: 2, max: 5 }, helper: "", expertMeaning: "Milk protein percentage", expertMeaning_i18n: {"en":"Milk protein percentage"} },
    { id: "milkPrice", label: "Süt Satış Fiyatı", label_i18n: {"en":"Milk price per kg"}, type: "number", unit: "USD/kg", required: true, smartDefault: 0.45, validation: { min: 0.01 }, helper: "", expertMeaning: "Milk price per kg", expertMeaning_i18n: {"en":"Milk price per kg"} },
    { id: "dailyFeedCostPerCow", label: "Günlük Yem Maliyeti (İnek Başı)", label_i18n: {"en":"Daily feed cost per cow"}, type: "number", unit: "USD/gün", required: true, smartDefault: 6.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Daily feed cost per cow", expertMeaning_i18n: {"en":"Daily feed cost per cow"} },
    { id: "herdSize", label: "Sürü Büyüklüğü", label_i18n: {"en":"Number of milking cows"}, type: "number", unit: "baş", required: false, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Number of milking cows", expertMeaning_i18n: {"en":"Number of milking cows"} },
    { id: "sccCount", label: "Somatik Hücre Sayısı", label_i18n: {"en":"Somatic cell count"}, type: "number", unit: "hücre/mL", required: false, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Somatic cell count", expertMeaning_i18n: {"en":"Somatic cell count"} },
    { id: "otherCostsPerCow", label: "Diğer Maliyetler (İnek Başı)", label_i18n: {"en":"Other daily costs per cow"}, type: "number", unit: "USD/gün", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Other daily costs per cow", expertMeaning_i18n: {"en":"Other daily costs per cow"} },
  ],
  outputs: [
    { id: "fcmMilk", label: "Düzeltilmiş Süt Verimi (FCM)", label_i18n: {"en":"Duzeltilmis Sut Verimi (FCM)"}, unit: "kg/gün", format: "number" },
    { id: "dairyIncomeOverFeed", label: "Yem Üzeri Gelir (IOFC)", label_i18n: {"en":"Yem Uzeri Gelir (IOFC)"}, unit: "USD/gün", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "dairyIncomeOverFeed", warning: 3, critical: 1.5, direction: "lower_is_bad", warningMessage: "Yem üzeri gelir <$3/inek/gün — kârlılık daralıyor.", warningMessage_i18n: {"en":"Yem üzeri gelir <$3/inek/gün — kârlılık daralıyor."}, criticalMessage: "Yem üzeri gelir <$1.5/inek/gün — işletme zarar riski yüksek.", criticalMessage_i18n: {"en":"Yem üzeri gelir <$1.5/inek/gün — işletme zarar riski yüksek."} }],
  formulaPipeline: [
    { formulaId: "measurement.fcm_milk", inputMap: {
        milkYield: "milkYieldPerCow",
        fatYield: "milkFatPct",
        milkProteinPct: "milkProteinPct"
      }, outputId: "fcmMilk" },
    { formulaId: "cost.dairy_income_over_feed", inputMap: {
        milkPrice: "milkPrice",
        milkYield: "fcmMilk",
        totalFeedCost: "dailyFeedCostPerCow",
        herdSize: "herdSize",
        otherCostsPerCow: "otherCostsPerCow"
      }, outputId: "dairyIncomeOverFeed" },
  ],
  reportTemplate: { title: "Süt Kâr Dedektörü Raporu", title_i18n: {"en":"Süt Kâr Dedektörü Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["FCM = verim × (0.4324 + 0.1625 × yağ% + 0.0345 × protein%).", "IOFC = (FCM × süt fiyatı) − (yem maliyeti + diğer maliyetler).", "SCC >400K hücre/mL kalite primi kaybına yol açar.", "NRC 2001 yem standartları baz alınmıştır."],assumptionNotes_i18n:[{"en":"FCM = verim × (0.4324 + 0.1625 × yağ% + 0.0345 × protein%)."},{"en":"IOFC = (FCM × süt fiyatı) − (yem maliyeti + diğer maliyetler)."},{"en":"SCC >400K hücre/mL kalite primi kaybına yol açar."},{"en":"NRC 2001 yem standartları baz alınmıştır."}] },
};
