/**
 * Tool #19 — MOQ Stok Denge
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const MOQ_STOCK_BALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "moq-stock-balance-analyzer", legacyPaidSlug: "moq-stock-balance-analyzer",
  name: "MOQ Stok Denge Analizi", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "MOQ ile gerçek talep arasındaki fark hesaplanmazsa ya stok fazlası cezası ya da fırsat maliyeti oluşur.",
  inputs: [
    { id: "moqQty", label: "Minimum Sipariş Miktarı (MOQ)", type: "number", unit: "adet", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Minimum order quantity" },
    { id: "actualDemand", label: "Gerçek Talep", type: "number", unit: "adet/sipariş", required: true, smartDefault: 300, validation: { min: 1 }, helper: "", expertMeaning: "Actual demand per order" },
    { id: "unitCost", label: "Birim Maliyet", type: "number", unit: "USD", required: true, smartDefault: 12, validation: { min: 0.01 }, helper: "", expertMeaning: "Unit cost" },
    { id: "priceBreakQty", label: "Fiyat Kırılım Miktarı", type: "number", unit: "adet", required: false, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Quantity for price break" },
    { id: "priceBreakUnitPrice", label: "Fiyat Kırılım Birim Fiyatı", type: "number", unit: "USD", required: false, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Price break unit price" },
    { id: "annualOrders", label: "Yıllık Sipariş Sayısı", type: "number", unit: "sipariş/yıl", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Orders per year" },
  ],
  outputs: [
    { id: "optimalQty", label: "Optimum Sipariş Miktarı", unit: "adet", format: "number" },
    { id: "moqPenalty", label: "MOQ Cezası", unit: "USD/yıl", format: "currency" },
    { id: "priceBreakSavings", label: "Fiyat Kırılım Tasarrufu", unit: "USD/yıl", format: "currency" },
    { id: "netBenefit", label: "Net Fayda", unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "moqPenalty", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "MOQ cezası > $5K — tedarikçi ile MOQ yeniden müzakere edilmeli.", criticalMessage: "MOQ cezası > $15K — alternatif tedarikçi değerlendirilmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.moq_optimal_qty", inputMap: { actualDemand: "actualDemand", moqQty: "moqQty" }, outputId: "optimalQty" },
    { formulaId: "cost.eoq_moq_penalty", inputMap: { optimalQty: "optimalQty", moqQty: "moqQty", unitCost: "unitCost", annualOrders: "annualOrders" }, outputId: "moqPenalty" },
    { formulaId: "cost.moq_price_break_savings", inputMap: { priceBreakQty: "priceBreakQty", priceBreakUnitPrice: "priceBreakUnitPrice", unitCost: "unitCost", annualOrders: "annualOrders" }, outputId: "priceBreakSavings" },
    { formulaId: "cost.moq_net_benefit", inputMap: { priceBreakSavings: "priceBreakSavings", moqPenalty: "moqPenalty" }, outputId: "netBenefit" },
  ],
  reportTemplate: { title: "MOQ Stock Balance Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["MOQ cezası = max(0, MOQ − talep) × birim maliyet × sipariş sayısı.", "Optimum miktar = max(talep, MOQ).", "Fiyat kırılım avantajı skontolu fiyat bazında hesaplanır."] },
};
