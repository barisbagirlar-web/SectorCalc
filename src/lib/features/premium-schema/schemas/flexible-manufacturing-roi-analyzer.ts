/**
 * Tool #43 — Flexible Manufacturing ROI
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FLEXIBLE_MFG_ROI_SCHEMA: PremiumCalculatorSchema = {
  id: "flexible-manufacturing-roi-analyzer", legacyPaidSlug: "flexible-manufacturing-roi-analyzer",
  name: "Flexible Manufacturing (FMS) ROI Analyzer", name_i18n: {"en":"Flexible Manufacturing (FMS) ROI Analyzer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Investment decision for a Flexible Manufacturing System (FMS) should not be made without a comparative ROI analysis against a dedicated system.", painStatement_i18n: {"en":"Investment decision for a Flexible Manufacturing System (FMS) should not be made without a comparative ROI analysis against a dedicated system."},
  inputs: [
    { id: "costDedicated", label: "Dedicated Sistem Maliyeti", label_i18n: {"en":"Dedicated System Cost"}, type: "number", unit: "USD", required: true, smartDefault: 300000, validation: { min: 0 }, helper: "", expertMeaning: "Dedicated system cost", expertMeaning_i18n: {"en":"Dedicated system cost"} },
    { id: "costFlex", label: "FMS Sistem Maliyeti", label_i18n: {"en":"FMS System Cost"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Flexible system cost", expertMeaning_i18n: {"en":"Flexible system cost"} },
    { id: "ttmReduction", label: "TTM Azaltma (gün)", label_i18n: {"en":"Time-to-market reduction"}, type: "number", unit: "gün", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Time-to-market reduction", expertMeaning_i18n: {"en":"Time-to-market reduction"} },
    { id: "totalTime", label: "Total development time", label_i18n: {"en":"Total development time"}, type: "number", unit: "gün", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Total development time", expertMeaning_i18n: {"en":"Total development time"} },
    { id: "revenueGain", label: "Revenue gain from early launch", label_i18n: {"en":"Revenue gain from early launch"}, type: "number", unit: "USD", required: false, smartDefault: 200000, validation: { min: 0 }, helper: "", expertMeaning: "Revenue gain from early launch", expertMeaning_i18n: {"en":"Revenue gain from early launch"} },
    { id: "customerPremium", label: "Customer premium from flexibility", label_i18n: {"en":"Customer premium from flexibility"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Customer premium from flexibility", expertMeaning_i18n: {"en":"Customer premium from flexibility"} },
    { id: "productionVolume", label: "Annual production volume", label_i18n: {"en":"Annual production volume"}, type: "number", unit: "adet", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume"} },
    { id: "unitPrice", label: "Unit Price", label_i18n: {"en":"Unit Price"}, type: "number", unit: "USD", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Unit price", expertMeaning_i18n: {"en":"Unit price"} },
    { id: "wipDedicated", label: "Dedicated WIP", label_i18n: {"en":"Dedicated WIP"}, type: "number", unit: "USD", required: false, smartDefault: 80000, validation: { min: 0 }, helper: "", expertMeaning: "WIP for dedicated system", expertMeaning_i18n: {"en":"WIP for dedicated system"} },
    { id: "wipFlexible", label: "FMS WIP", label_i18n: {"en":"FMS WIP"}, type: "number", unit: "USD", required: false, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "WIP for flexible system", expertMeaning_i18n: {"en":"WIP for flexible system"} },
    { id: "carryCostPct", label: "Inventory carrying cost", label_i18n: {"en":"Inventory carrying cost"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Inventory carrying cost", expertMeaning_i18n: {"en":"Inventory carrying cost"} },
    { id: "scrapReduction", label: "Hurda Azaltma Tasarrufu", label_i18n: {"en":"Scrap Azaltma Tasarrufu"}, type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Scrap reduction savings", expertMeaning_i18n: {"en":"Scrap reduction savings"} },
    { id: "capex", label: "FMS capital expenditure", label_i18n: {"en":"FMS capital expenditure"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "FMS capital expenditure", expertMeaning_i18n: {"en":"FMS capital expenditure"} },
  ],
  outputs: [
    { id: "roi", label: "FMS ROI", label_i18n: {"en":"FMS ROI"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "roi", warning: 30, critical: 15, direction: "lower_is_bad", warningMessage: "ROI < %30 — yatırım fizibilitesi sorgulanmalı.", warningMessage_i18n: {"en":"ROI < %30 — Investment feasibility should be questioned."}, criticalMessage: "ROI < %15 — dedicated sistem daha avantajlı olabilir.", criticalMessage_i18n: {"en":"ROI < %15 — A dedicated system may be more advantageous."} }],
  formulaPipeline: [
    { formulaId: "cost.flex_mfg_roi", inputMap: {
        capex: "capex",
        costDed: "costDedicated",
        costFms: "costFlex"
      ,
        flexVal: "flexVal",
        invSav: "invSav",
        scrapRed: "scrapRed"}, outputId: "roi" },
  ],
  reportTemplate: { title: "Flexible Manufacturing ROI Report", title_i18n: {"en":"Flexible Manufacturing ROI Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Compares dedicated vs flexible manufacturing cost.", "Includes flex value (TTM + customer premium), WIP savings, scrap reduction.", "ROI = (CostGap+FlexVal+InvSav+ScrapRed)/Capex."],assumptionNotes_i18n:[{"en":"Compares dedicated vs flexible manufacturing cost."},{"en":"Includes flex value (TTM + customer premium), WIP savings, scrap reduction."},{"en":"ROI = (CostGap+FlexVal+InvSav+ScrapRed)/Capex."}] },
};
