/**
 * Tool — Steam Trap
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const STEAM_TRAP_ENERGY_LOSS_ANALYZER: PremiumCalculatorSchema = {
  id: "steam-trap-energy-loss-analyzer", legacyPaidSlug: "steam-trap-energy-loss-analyzer",
  name: "Steam Trap Enerji Kaybı Analizi", name_i18n: {"en":"Steam Trap Enerji Kaybı Analizi","tr":"Steam Trap Enerji Kaybı Analizi"}, sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Arızalı buhar kapanları (steam trap) fark edilmeden yüksek enerji kaybına yol açar ve bu kayıplar ölçülmezse enerji verimliliği düşer.", painStatement_i18n: {"en":"Arızalı buhar kapanları (steam trap) fark edilmeden yüksek enerji kaybına yol açar ve bu kayıplar ölçülmezse enerji verimliliği düşer.","tr":"Arızalı buhar kapanları (steam trap) fark edilmeden yüksek enerji kaybına yol açar ve bu kayıplar ölçülmezse enerji verimliliği düşer."},
  inputs: [
    { id: "steamPressure", label: "Buhar Basıncı", label_i18n: {"en":"Buhar Basıncı","tr":"Buhar Basıncı"}, type: "number", unit: "bar", required: true, smartDefault: 7, validation: { min: 0.1 }, helper: "", expertMeaning: "Steam pressure in bar", expertMeaning_i18n: {"en":"Steam pressure in bar","tr":"Steam pressure in bar"} },
    { id: "holeDiameter", label: "Kaçak Çapı", label_i18n: {"en":"Kaçak Çapı","tr":"Kaçak Çapı"}, type: "number", unit: "mm", required: true, smartDefault: 3, validation: { min: 0.1 }, helper: "", expertMeaning: "Orifice diameter in mm", expertMeaning_i18n: {"en":"Orifice diameter in mm","tr":"Orifice diameter in mm"} },
    { id: "operatingHoursPerYear", label: "Yıllık Çalışma Saati", label_i18n: {"en":"Yıllık Çalışma Saati","tr":"Yıllık Çalışma Saati"}, type: "number", unit: "saat/yıl", required: true, smartDefault: 8000, validation: { min: 1 }, helper: "", expertMeaning: "Operating hours per year", expertMeaning_i18n: {"en":"Operating hours per year","tr":"Operating hours per year"} },
    { id: "steamCost", label: "Buhar Maliyeti", label_i18n: {"en":"Buhar Maliyeti","tr":"Buhar Maliyeti"}, type: "number", unit: "USD/ton", required: true, smartDefault: 25, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per ton of steam", expertMeaning_i18n: {"en":"Cost per ton of steam","tr":"Cost per ton of steam"} },
    { id: "faultyTraps", label: "Arızalı Kapak Sayısı", label_i18n: {"en":"Arızalı Kapak Sayısı","tr":"Arızalı Kapak Sayısı"}, type: "number", unit: "adet", required: false, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of failed traps", expertMeaning_i18n: {"en":"Number of failed traps","tr":"Number of failed traps"} },
    { id: "replacementCost", label: "Değişim Maliyeti", label_i18n: {"en":"Değişim Maliyeti","tr":"Değişim Maliyeti"}, type: "number", unit: "USD/adet", required: false, smartDefault: 350, validation: { min: 1 }, helper: "", expertMeaning: "Replacement cost per trap", expertMeaning_i18n: {"en":"Replacement cost per trap","tr":"Replacement cost per trap"} },
  ],
  outputs: [
    { id: "steamLossRate", label: "Buhar Kaçak Oranı", label_i18n: {"en":"Buhar Kaçak Oranı","tr":"Buhar Kaçak Oranı"}, unit: "ton/saat", format: "number" },
    { id: "annualLoss", label: "Yıllık Enerji Kaybı", label_i18n: {"en":"Yıllık Enerji Kaybı","tr":"Yıllık Enerji Kaybı"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "roi", label: "Onarım Yatırım Getirisi", label_i18n: {"en":"Onarım Yatırım Getirisi","tr":"Onarım Yatırım Getirisi"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "annualLoss", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "Yıllık kayıp >$10K — arızalı kapaklar tespit edilmeli.", warningMessage_i18n: {"en":"Yıllık kayıp >$10K — arızalı kapaklar tespit edilmeli.","tr":"Yıllık kayıp >$10K — arızalı kapaklar tespit edilmeli."}, criticalMessage: "Yıllık kayıp >$50K — acil steam trap bakım programı başlatılmalı.", criticalMessage_i18n: {"en":"Yıllık kayıp >$50K — acil steam trap bakım programı başlatılmalı.","tr":"Yıllık kayıp >$50K — acil steam trap bakım programı başlatılmalı."} }],
  formulaPipeline: [
    { formulaId: "measurement.steam_loss_rate", inputMap: { steamPressure: "steamPressure", holeDiameter: "holeDiameter" }, outputId: "steamLossRate" },
    { formulaId: "cost.steam_trap_annual_loss", inputMap: { steamLossRate: "steamLossRate", operatingHoursPerYear: "operatingHoursPerYear", steamCost: "steamCost", faultyTraps: "faultyTraps" }, outputId: "annualLoss" },
    { formulaId: "cost.steam_trap_roi", inputMap: { annualLoss: "annualLoss", faultyTraps: "faultyTraps", replacementCost: "replacementCost" }, outputId: "roi" },
  ],
  reportTemplate: { title: "Steam Trap Enerji Kaybı Raporu", title_i18n: {"en":"Steam Trap Enerji Kaybı Raporu","tr":"Steam Trap Enerji Kaybı Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Buhar kaçak hızı Napier formülü ile hesaplanır: Q = 0.525 × d² × P.", "Yıllık kayıp = kaçak oranı × saat × maliyet × kapak sayısı.", "Onarım ROI = (yıllık kayıp − değişim) / değişim × 100."],assumptionNotes_i18n:[{"en":"Buhar kaçak hızı Napier formülü ile hesaplanır: Q = 0.525 × d² × P.","tr":"Buhar kaçak hızı Napier formülü ile hesaplanır: Q = 0.525 × d² × P."},{"en":"Yıllık kayıp = kaçak oranı × saat × maliyet × kapak sayısı.","tr":"Yıllık kayıp = kaçak oranı × saat × maliyet × kapak sayısı."},{"en":"Onarım ROI = (yıllık kayıp − değişim) / değişim × 100.","tr":"Onarım ROI = (yıllık kayıp − değişim) / değişim × 100."}] },
};
