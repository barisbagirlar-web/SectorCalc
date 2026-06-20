/**
 * Tool #40 — Robot vs Manuel Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ROBOT_VS_MANUAL_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "robot-vs-manual-analyzer", legacyPaidSlug: "robot-vs-manual-analyzer",
  name: "Robot vs Manuel Operasyon Maliyet", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Otomasyon yatırımının manuel operasyona göre gerçek maliyet avantajı hesaplanmazsa yanlış karar üretim maliyetini katlayabilir.",
  inputs: [
    { id: "manualLaborCost", label: "Yıllık İşçilik Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 55000, validation: { min: 1 }, helper: "", expertMeaning: "Annual labor cost per worker" },
    { id: "numWorkers", label: "İşçi Sayısı", type: "number", unit: "kişi", required: true, smartDefault: 3, validation: { min: 1 }, helper: "", expertMeaning: "Number of workers" },
    { id: "robotInvestment", label: "Robot Yatırımı", type: "number", unit: "USD", required: true, smartDefault: 120000, validation: { min: 1 }, helper: "", expertMeaning: "Total robot system investment" },
    { id: "robotMaintenance", label: "Yıllık Bakım Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 8000, validation: { min: 0 }, helper: "", expertMeaning: "Annual robot maintenance cost" },
    { id: "robotEnergy", label: "Yıllık Enerji Maliyeti", type: "number", unit: "USD/yıl", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Annual energy cost for robot" },
    { id: "robotLife", label: "Robot Ömrü", type: "number", unit: "yıl", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Expected robot useful life" },
    { id: "manualOutput", label: "Manuel Çıktı", type: "number", unit: "adet/yıl", required: true, smartDefault: 80000, validation: { min: 1 }, helper: "", expertMeaning: "Manual annual output per worker" },
    { id: "robotOutput", label: "Robot Çıktı", type: "number", unit: "adet/yıl", required: false, smartDefault: 120000, validation: { min: 1 }, helper: "", expertMeaning: "Robot annual output" },
  ],
  outputs: [
    { id: "manualCostAnnual", label: "Yıllık Manuel Maliyet", unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "robotCostAnnual", label: "Yıllık Robot Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "robotOutput", label: "Robot Yıllık Çıktı", unit: "adet/yıl", format: "number", isBigNumber: true },
    { id: "manualOutput", label: "Manuel Yıllık Çıktı", unit: "adet/yıl", format: "number", isBigNumber: true },
    { id: "costPerUnitManual", label: "Birim Maliyet — Manuel", unit: "USD/adet", format: "currency" },
    { id: "costPerUnitRobot", label: "Birim Maliyet — Robot", unit: "USD/adet", format: "currency" },
    { id: "robotRoi", label: "Robot Yatırım Getirisi", unit: "%", format: "number" },
    { id: "robotPayback", label: "Robot Geri Ödeme Süresi", unit: "yıl", format: "number" },
  ],
  thresholds: [{ fieldId: "costPerUnitRobot", warning: 0.5, critical: 0.8, direction: "higher_is_bad", warningMessage: "Robot birim maliyet > $0.50 — verimlilik değerlendirilmeli.", criticalMessage: "Robot birim maliyet > $0.80 — fizibilite sorgulanmalı." }],
  formulaPipeline: [
    { formulaId: "cost.manual_cost_annual", inputMap: { manualLaborCost: "manualLaborCost", numWorkers: "numWorkers" }, outputId: "manualCostAnnual" },
    { formulaId: "cost.robot_cost_annual", inputMap: { robotInvestment: "robotInvestment", robotMaintenance: "robotMaintenance", robotEnergy: "robotEnergy", robotLife: "robotLife" }, outputId: "robotCostAnnual" },
    { formulaId: "measurement.robot_output", inputMap: { robotOutput: "robotOutput" }, outputId: "robotOutput" },
    { formulaId: "measurement.manual_output", inputMap: { manualOutput: "manualOutput", numWorkers: "numWorkers" }, outputId: "manualOutput" },
    { formulaId: "cost.cost_per_unit_manual", inputMap: { manualCostAnnual: "manualCostAnnual", manualOutput: "manualOutput" }, outputId: "costPerUnitManual" },
    { formulaId: "cost.cost_per_unit_robot", inputMap: { robotCostAnnual: "robotCostAnnual", robotOutput: "robotOutput" }, outputId: "costPerUnitRobot" },
    { formulaId: "cost.robot_roi", inputMap: { manualCostAnnual: "manualCostAnnual", robotCostAnnual: "robotCostAnnual", robotInvestment: "robotInvestment" }, outputId: "robotRoi" },
    { formulaId: "cost.robot_payback", inputMap: { robotInvestment: "robotInvestment", manualCostAnnual: "manualCostAnnual", robotCostAnnual: "robotCostAnnual" }, outputId: "robotPayback" },
  ],
  reportTemplate: { title: "Robot vs Manual Analysis Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Manuel maliyet = işçi sayısı × yıllık maliyet.", "Robot maliyeti = bakım + enerji + (yatırım/ömür).", "Birim maliyet = yıllık maliyet / yıllık çıktı.", "ROI = (manuel - robot) / yatırım × 100."] },
};
