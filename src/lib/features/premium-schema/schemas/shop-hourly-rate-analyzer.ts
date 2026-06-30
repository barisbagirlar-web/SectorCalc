import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SHOP_HOURLY_RATE_SCHEMA: PremiumCalculatorSchema = {
  id: "shop-hourly-rate-analyzer", legacyPaidSlug: "shop-hourly-rate-analyzer",
  name: "Mağaza Saatlik Ücret", name_i18n: {"en":"Shop Hourly Rate","tr":"Mağaza Saatlik Ücret"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Atölye saatlik ücreti doğru hesaplanmazsa, faturalama zararı ve marj kaybı oluşur.", painStatement_i18n: {"en":"If the shop hourly rate is not calculated correctly, billing losses and margin erosion occur.","tr":"Atölye saatlik ücreti doğru hesaplanmazsa, faturalama zararı ve marj kaybı oluşur."},
  inputs: [
    { id: "technicianWages", label: "Teknisyen Ücretleri", label_i18n: {"en":"Technician Wages","tr":"Teknisyen Ücretleri"}, type: "number", unit: "USD/ay", required: true, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Total technician wages", expertMeaning_i18n: {"en":"Total technician wages","tr":"Toplam teknisyen ücretleri"} },
    { id: "managerWages", label: "Yönetici Ücretleri", label_i18n: {"en":"Manager Wages","tr":"Yönetici Ücretleri"}, type: "number", unit: "USD/ay", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Manager wages", expertMeaning_i18n: {"en":"Manager wages","tr":"Yönetici ücretleri"} },
    { id: "adminWages", label: "İdari Ücretler", label_i18n: {"en":"Admin Wages","tr":"İdari Ücretler"}, type: "number", unit: "USD/ay", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Admin wages", expertMeaning_i18n: {"en":"Admin wages","tr":"İdari ücretler"} },
    { id: "rent", label: "Kira", label_i18n: {"en":"Rent","tr":"Kira"}, type: "number", unit: "USD/ay", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly rent", expertMeaning_i18n: {"en":"Monthly rent","tr":"Aylık kira"} },
    { id: "utilities", label: "Fatura", label_i18n: {"en":"Utilities","tr":"Fatura"}, type: "number", unit: "USD/ay", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Utilities", expertMeaning_i18n: {"en":"Utilities","tr":"Faturalar"} },
    { id: "insurance", label: "Sigorta", label_i18n: {"en":"Insurance","tr":"Sigorta"}, type: "number", unit: "USD/ay", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Insurance", expertMeaning_i18n: {"en":"Insurance","tr":"Sigorta"} },
    { id: "tools", label: "Alet/Ekipman", label_i18n: {"en":"Tools/Equipment","tr":"Alet/Ekipman"}, type: "number", unit: "USD/ay", required: false, smartDefault: 1500, validation: { min: 0 }, helper: "", expertMeaning: "Tools & equipment", expertMeaning_i18n: {"en":"Tools & equipment","tr":"Alet ve ekipman"} },
    { id: "depreciation", label: "Amortisman", label_i18n: {"en":"Depreciation","tr":"Amortisman"}, type: "number", unit: "USD/ay", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Monthly depreciation", expertMeaning_i18n: {"en":"Monthly depreciation","tr":"Aylık amortisman"} },
    { id: "totalAvailableHours", label: "Toplam Faturalanabilir Saat", label_i18n: {"en":"Total Billable Hours","tr":"Toplam Faturalanabilir Saat"}, type: "number", unit: "saat/ay", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Total billable hours", expertMeaning_i18n: {"en":"Total billable hours","tr":"Toplam faturalanabilir saat"} },
    { id: "utilizationRate", label: "Kullanım Oranı", label_i18n: {"en":"Utilization Rate","tr":"Kullanım Oranı"}, type: "number", unit: "", required: false, smartDefault: 0.75, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Utilization rate", expertMeaning_i18n: {"en":"Utilization rate","tr":"Kullanım oranı"} },
    { id: "targetMargin", label: "Hedef Kâr Marjı", label_i18n: {"en":"Target Profit Margin","tr":"Hedef Kâr Marjı"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target profit margin", expertMeaning_i18n: {"en":"Target profit margin","tr":"Hedef kar marjı"} },
    { id: "actualBillingRate", label: "Gerçek Faturalama Ücreti", label_i18n: {"en":"Actual Billing Rate","tr":"Gerçek Faturalama Ücreti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 95, validation: { min: 0 }, helper: "", expertMeaning: "Actual billing rate", expertMeaning_i18n: {"en":"Actual billing rate","tr":"Gerçek faturalama ücreti"} },
  ],
  outputs: [
    { id: "directLabor", label: "Direkt İşçilik", label_i18n: {"en":"Direct Labor","tr":"Direkt İşçilik"}, unit: "USD/ay", format: "currency" },
    { id: "indirectLabor", label: "Endirekt İşçilik", label_i18n: {"en":"Indirect Labor","tr":"Endirekt İşçilik"}, unit: "USD/ay", format: "currency" },
    { id: "overhead", label: "Genel Gider", label_i18n: {"en":"Overhead","tr":"Genel Gider"}, unit: "USD/ay", format: "currency" },
    { id: "totalShopCost", label: "Toplam Atölye Maliyeti", label_i18n: {"en":"Total Shop Cost","tr":"Toplam Atölye Maliyeti"}, unit: "USD/ay", format: "currency", isBigNumber: true },
    { id: "billableHours", label: "Faturalanabilir Saat", label_i18n: {"en":"Billable Hours","tr":"Faturalanabilir Saat"}, unit: "saat/ay", format: "number" },
    { id: "shopHourlyRate", label: "Atölye Saatlik Ücreti", label_i18n: {"en":"Shop Hourly Rate","tr":"Atölye Saatlik Ücreti"}, unit: "USD/saat", format: "currency" },
    { id: "effectiveMargin", label: "Gerçek Marj", label_i18n: {"en":"Actual Margin","tr":"Gerçek Marj"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "effectiveMargin", warning: 20, critical: 10, direction: "lower_is_bad", warningMessage: "Marj < %20 — maliyet yapısı gözden geçirilmeli.", warningMessage_i18n: {"en":"Margin < 20% — review cost structure.","tr":"Marj < %20 — maliyet yapısı gözden geçirilmeli."}, criticalMessage: "Marj < %10 — acil fiyatlandırma revizyonu.", criticalMessage_i18n: {"en":"Margin < 10% — urgent pricing revision.","tr":"Marj < %10 — acil fiyatlandırma revizyonu."} }],
  formulaPipeline: [
    { formulaId: "cost.shop_direct_labor", inputMap: { technicianWages: "technicianWages" }, outputId: "directLabor" },
    { formulaId: "cost.shop_indirect_labor", inputMap: { managerWages: "managerWages", adminWages: "adminWages" }, outputId: "indirectLabor" },
    { formulaId: "cost.shop_overhead", inputMap: {
        depreciation: "depreciation",
        directLabor: "rent",
        indirectLabor: "utilities",
        insurance: "insurance",
        tools: "tools"
      }, outputId: "overhead" },
    { formulaId: "cost.shop_total_cost", inputMap: { directLabor: "directLabor", indirectLabor: "indirectLabor", overhead: "overhead" }, outputId: "totalShopCost" },
    { formulaId: "cost.shop_billable_hours", inputMap: { totalAvailableHours: "totalAvailableHours", utilizationRate: "utilizationRate" }, outputId: "billableHours" },
    { formulaId: "cost.shop_hourly_rate", inputMap: { totalShopCost: "totalShopCost", billableHours: "billableHours" }, outputId: "shopHourlyRate" },
    { formulaId: "cost.shop_effective_margin", inputMap: {
        actualBillingRate: "actualBillingRate",
        shopHourlyRate: "shopHourlyRate"
      }, outputId: "effectiveMargin" },
  ],
  reportTemplate: { title: "Atölye Saatlik Ücret Raporu", title_i18n: {"en":"Shop Hourly Rate Report","tr":"Atölye Saatlik Ücret Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Saatlik ücret = Toplam maliyet / Faturalanabilir saat.", "Marj = (Faturalama - Maliyet) / Faturalama.", "Kullanım oranı fiili doluluğu yansıtır."],assumptionNotes_i18n:[{"en":"Hourly rate = Total cost / Billable hours.","tr":"Saatlik ücret = Toplam maliyet / Faturalanabilir saat."},{"en":"Margin = (Billing - Cost) / Billing.","tr":"Marj = (Faturalama - Maliyet) / Faturalama."},{"en":"Utilization rate reflects actual occupancy.","tr":"Kullanım oranı fiili doluluğu yansıtır."}] },
};
