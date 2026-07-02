/**
 * Tool - Supplier TCO
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SUPPLIER_PERFORMANCE_TCO_ANALYZER: PremiumCalculatorSchema = {
  id: "supplier-performance-tco-analyzer", legacyPaidSlug: "supplier-performance-tco-analyzer",
  name: "Supplier TCO Performance Analysis", name_i18n: {"en":"Supplier TCO Performance Analysis"}, sectorSlug: "quality", category: "cost",
  painStatement: "Supplier selection often focuses only pre unit price; when quality, logistics, inventory, and scrap costs are ignored, the true total cost of ownership remains hidden.", painStatement_i18n: {"en":"Supplier selection often focuses only pre unit price; when quality, logistics, inventory, and scrap costs are ignored, the true total cost of ownership remains hidden."},
  inputs: [
    { id: "unitPrice", label: "Unit Price", label_i18n: {"en":"Unit Price"}, type: "number", unit: "USD/unit", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Price per unit", expertMeaning_i18n: {"en":"Price per unit"} },
    { id: "annualVolume", label: "Annual Volume", label_i18n: {"en":"Annual Volume"}, type: "number", unit: "units", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Annual purchase volume", expertMeaning_i18n: {"en":"Annual purchase volume"} },
    { id: "defectRate", label: "Defect Rate", label_i18n: {"en":"Defect Rate"}, type: "number", unit: "%", required: true, smartDefault: 2, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Defect rate percentage", expertMeaning_i18n: {"en":"Defect rate percentage"} },
    { id: "costPerDefect", label: "Cost per Defect", label_i18n: {"en":"Cost per Defect"}, type: "number", unit: "USD", required: true, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per defective unit", expertMeaning_i18n: {"en":"Cost per defective unit"} },
    { id: "freightCostPerUnit", label: "Freight Cost per Unit", label_i18n: {"en":"Freight Cost per Unit"}, type: "number", unit: "USD/unit", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Freight cost per unit", expertMeaning_i18n: {"en":"Freight cost per unit"} },
    { id: "leadTimeDays", label: "Delivery Lead Time", label_i18n: {"en":"Delivery Lead Time"}, type: "number", unit: "days", required: false, smartDefault: 14, validation: { min: 1 }, helper: "", expertMeaning: "Delivery lead time in days", expertMeaning_i18n: {"en":"Delivery lead time in days"} },
    { id: "holdingCostPct", label: "Inventory Holding Cost Rate", label_i18n: {"en":"Inventory Holding Cost Rate"}, type: "number", unit: "%/yil", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual holding cost as % of unit price", expertMeaning_i18n: {"en":"Annual holding cost as % of unit price"} },
    { id: "inspectionCostPerUnit", label: "Inspection Cost per Unit", label_i18n: {"en":"Inspection Cost per Unit"}, type: "number", unit: "USD/unit", required: false, smartDefault: 0.1, validation: { min: 0 }, helper: "", expertMeaning: "Inspection cost per unit", expertMeaning_i18n: {"en":"Inspection cost per unit"} },
  ],
  outputs: [
    { id: "supplierTco", label: "Total Cost of Ownership (TCO)", label_i18n: {"en":"Total Cost of Ownership (TCO)"}, unit: "USD/unit", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "supplierTco", warning: 6, critical: 8, direction: "higher_is_bad", warningMessage: "TCO >$6/unit - question supplier performance.", warningMessage_i18n: {"en":"TCO >$6/unit - question supplier performance."}, criticalMessage: "TCO >$8/unit - evaluate alternative suppliers.", criticalMessage_i18n: {"en":"TCO >$8/unit - evaluate alternative suppliers."} }],
  formulaPipeline: [
    { formulaId: "cost.supplier_tco", inputMap: { unitPrice: "unitPrice", annualVolume: "annualVolume", defectRate: "defectRate", costPerDefect: "costPerDefect", freightCostPerUnit: "freightCostPerUnit", leadTimeDays: "leadTimeDays", holdingCostPct: "holdingCostPct", inspectionCostPerUnit: "inspectionCostPerUnit" ,
        purchasePrice: "purchasePrice",
        orderingCost: "orderingCost",
        transportCost: "transportCost",
        qualityCost: "qualityCost",
        inventoryCost: "inventoryCost",
        riskCost: "riskCost"}, outputId: "supplierTco" },
  ],
  reportTemplate: { title: "Supplier TCO Report", title_i18n: {"en":"Supplier TCO Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["TCO = unit price + defect cost + freight + inspection + inventory holding.", "Defect cost = defect rate × volume × cost per defect / volume.", "Inventory holding = lead time × daily demand × holding rate × unit price / volume.", "Quality costs account for 15-30% of TCO on average."],assumptionNotes_i18n:[{"en":"TCO = unit price + defect cost + freight + inspection + inventory holding."},{"en":"Defect cost = defect rate × volume × cost per defect / volume."},{"en":"Inventory holding = lead time × daily demand × holding rate × unit price / volume."},{"en":"Quality costs account for 15-30% of TCO on average."}] },
};
