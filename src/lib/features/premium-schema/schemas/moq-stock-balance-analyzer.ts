/**
 * Tool #19 — MOQ Stok Denge
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const MOQ_STOCK_BALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "moq-stock-balance-analyzer", legacyPaidSlug: "moq-stock-balance-analyzer",
  name: "MOQ Stok Denge Analizi", name_i18n: {"en":"MOQ Stok Denge Analizi","tr":"MOQ Stok Denge Analizi"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "MOQ ile gerçek talep arasındaki fark hesaplanmazsa ya stok fazlası cezası ya da fırsat maliyeti oluşur.", painStatement_i18n: {"en":"MOQ ile gerçek talep arasındaki fark hesaplanmazsa ya stok fazlası cezası ya da fırsat maliyeti oluşur.","tr":"MOQ ile gerçek talep arasındaki fark hesaplanmazsa ya stok fazlası cezası ya da fırsat maliyeti oluşur."},
  inputs: [
    { id: "moqQty", label: "Minimum Sipariş Miktarı (MOQ)", label_i18n: {"en":"Minimum order quantity","tr":"Minimum Sipariş Miktarı (MOQ)"}, type: "number", unit: "adet", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Minimum order quantity", expertMeaning_i18n: {"en":"Minimum order quantity","tr":"minimum sipariş miktarı (moq)"} },
    { id: "actualDemand", label: "Gerçek Talep", label_i18n: {"en":"Actual demand per order","tr":"Gerçek Talep"}, type: "number", unit: "adet/sipariş", required: true, smartDefault: 300, validation: { min: 1 }, helper: "", expertMeaning: "Actual demand per order", expertMeaning_i18n: {"en":"Actual demand per order","tr":"gerçek talep"} },
    { id: "unitCost", label: "Birim Maliyet", label_i18n: {"en":"Birim Maliyet","tr":"Birim Maliyet"}, type: "number", unit: "USD", required: true, smartDefault: 12, validation: { min: 0.01 }, helper: "", expertMeaning: "Unit cost", expertMeaning_i18n: {"en":"Unit cost","tr":"Unit cost"} },
    { id: "priceBreakQty", label: "Fiyat Kırılım Miktarı", label_i18n: {"en":"Quantity for price break","tr":"Fiyat Kırılım Miktarı"}, type: "number", unit: "adet", required: false, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Quantity for price break", expertMeaning_i18n: {"en":"Quantity for price break","tr":"fiyat kırılım miktarı"} },
    { id: "priceBreakUnitPrice", label: "Fiyat Kırılım Birim Fiyatı", label_i18n: {"en":"Price break unit price","tr":"Fiyat Kırılım Birim Fiyatı"}, type: "number", unit: "USD", required: false, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Price break unit price", expertMeaning_i18n: {"en":"Price break unit price","tr":"fiyat kırılım birim fiyatı"} },
    { id: "annualOrders", label: "Yıllık Sipariş Sayısı", label_i18n: {"en":"Orders per year","tr":"Yıllık Sipariş Sayısı"}, type: "number", unit: "sipariş/yıl", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Orders per year", expertMeaning_i18n: {"en":"Orders per year","tr":"yıllık sipariş sayısı"} },
  ],
  outputs: [
    { id: "optimalQty", label: "Optimum Sipariş Miktarı", label_i18n: {"en":"Optimum Siparis Miktar","tr":"Optimum Sipariş Miktarı"}, unit: "adet", format: "number" },
    { id: "moqPenalty", label: "MOQ Cezası", label_i18n: {"en":"MOQ Cezas","tr":"MOQ Cezası"}, unit: "USD/yıl", format: "currency" },
    { id: "priceBreakSavings", label: "Fiyat Kırılım Tasarrufu", label_i18n: {"en":"Fiyat Krlm Tasarrufu","tr":"Fiyat Kırılım Tasarrufu"}, unit: "USD/yıl", format: "currency" },
    { id: "netBenefit", label: "Net Fayda", label_i18n: {"en":"Net Fayda","tr":"Net Fayda"}, unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "moqPenalty", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "MOQ cezası > $5K — tedarikçi ile MOQ yeniden müzakere edilmeli.", warningMessage_i18n: {"en":"MOQ cezası > $5K — tedarikçi ile MOQ yeniden müzakere edilmeli.","tr":"MOQ cezası > $5K — tedarikçi ile MOQ yeniden müzakere edilmeli."}, criticalMessage: "MOQ cezası > $15K — alternatif tedarikçi değerlendirilmeli.", criticalMessage_i18n: {"en":"MOQ cezası > $15K — alternatif tedarikçi değerlendirilmeli.","tr":"MOQ cezası > $15K — alternatif tedarikçi değerlendirilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.moq_optimal_qty", inputMap: { actualDemand: "actualDemand", moqQty: "moqQty" ,
        eopQty: "eopQty",
        moq: "moq"}, outputId: "optimalQty" },
    { formulaId: "cost.eoq_moq_penalty", inputMap: { optimalQty: "optimalQty", moqQty: "moqQty", unitCost: "unitCost", annualOrders: "annualOrders" ,
        moq: "moq",
        eopQty: "eopQty",
        holdingCostPerUnit: "holdingCostPerUnit"}, outputId: "moqPenalty" },
    { formulaId: "cost.moq_price_break_savings", inputMap: { priceBreakQty: "priceBreakQty", priceBreakUnitPrice: "priceBreakUnitPrice", unitCost: "unitCost", annualOrders: "annualOrders" ,
        eopQty: "eopQty",
        standardPrice: "standardPrice",
        discountPrice: "discountPrice"}, outputId: "priceBreakSavings" },
    { formulaId: "cost.moq_net_benefit", inputMap: { priceBreakSavings: "priceBreakSavings", moqPenalty: "moqPenalty" }, outputId: "netBenefit" },
  ],
  reportTemplate: { title: "MOQ Stock Balance Report", title_i18n: {"en":"MOQ Stock Balance Report","tr":"MOQ Stock Balance Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["MOQ cezası = max(0, MOQ − talep) × birim maliyet × sipariş sayısı.", "Optimum miktar = max(talep, MOQ).", "Fiyat kırılım avantajı skontolu fiyat bazında hesaplanır."],assumptionNotes_i18n:[{"en":"MOQ cezası = max(0, MOQ − talep) × birim maliyet × sipariş sayısı.","tr":"MOQ cezası = max(0, MOQ − talep) × birim maliyet × sipariş sayısı."},{"en":"Optimum miktar = max(talep, MOQ).","tr":"Optimum miktar = max(talep, MOQ)."},{"en":"Fiyat kırılım avantajı skontolu fiyat bazında hesaplanır.","tr":"Fiyat kırılım avantajı skontolu fiyat bazında hesaplanır."}] },
};
