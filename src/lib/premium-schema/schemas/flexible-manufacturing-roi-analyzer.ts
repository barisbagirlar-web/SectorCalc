/**
 * Tool #43 — Flexible Manufacturing ROI
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FLEXIBLE_MFG_ROI_SCHEMA: PremiumCalculatorSchema = {
  id: "flexible-manufacturing-roi-analyzer", legacyPaidSlug: "flexible-manufacturing-roi-analyzer",
  name: "Esnek İmalat (FMS) ROI Analizi", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Esnek imalat sistemine (FMS) yatırım kararı, dedicated sistemle karşılaştırmalı ROI analizi yapılmadan verilmemelidir.",
  inputs: [
    { id: "costDedicated", label: "Dedicated Sistem Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 300000, validation: { min: 0 }, helper: "", expertMeaning: "Dedicated system cost" },
    { id: "costFlex", label: "FMS Sistem Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Flexible system cost" },
    { id: "ttmReduction", label: "TTM Azaltma (gün)", type: "number", unit: "gün", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Time-to-market reduction" },
    { id: "totalTime", label: "Toplam Geliştirme Süresi", type: "number", unit: "gün", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Total development time" },
    { id: "revenueGain", label: "Erken Çıkış Gelir Kazancı", type: "number", unit: "USD", required: false, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Revenue gain from early launch" },
    { id: "customerPremium", label: "Müşteri Prim Marjı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Customer premium from flexibility" },
    { id: "productionVolume", label: "Yıllık Üretim Hacmi", type: "number", unit: "adet", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Annual production volume" },
    { id: "unitPrice", label: "Birim Fiyat", type: "number", unit: "USD", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Unit price" },
    { id: "wipDedicated", label: "Dedicated WIP", type: "number", unit: "USD", required: false, smartDefault: 80000, validation: { min: 0 }, helper: "", expertMeaning: "WIP for dedicated system" },
    { id: "wipFlexible", label: "FMS WIP", type: "number", unit: "USD", required: false, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "WIP for flexible system" },
    { id: "carryCostPct", label: "Taşıma Maliyeti Oranı", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Inventory carrying cost" },
    { id: "scrapReduction", label: "Hurda Azaltma Tasarrufu", type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Scrap reduction savings" },
    { id: "capex", label: "FMS Yatırım Bedeli", type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "FMS capital expenditure" },
  ],
  outputs: [
    { id: "roi", label: "FMS ROI", unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "roi", warning: 30, critical: 15, direction: "lower_is_bad", warningMessage: "ROI < %30 — yatırım fizibilitesi sorgulanmalı.", criticalMessage: "ROI < %15 — dedicated sistem daha avantajlı olabilir." }],
  formulaPipeline: [
    { formulaId: "cost.flex_mfg_roi", inputMap: { costDedicated: "costDedicated", costFlex: "costFlex", capex: "capex" }, outputId: "roi" },
  ],
  reportTemplate: { title: "Flexible Manufacturing ROI Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Compares dedicated vs flexible manufacturing cost.", "Includes flex value (TTM + customer premium), WIP savings, scrap reduction.", "ROI = (CostGap+FlexVal+InvSav+ScrapRed)/Capex."] },
};
