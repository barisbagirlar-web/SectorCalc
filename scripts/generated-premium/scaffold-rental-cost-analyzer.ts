/**
 * İSKELE KİRALAMA — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SCAFFOLDRENTALCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "scaffold-rental-cost-analyzer",
  legacyPaidSlug: "scaffold-rental-cost-analyzer",
  name: "İSKELE KİRALAMA",
  sectorSlug: "general",
  category: "cost",
  painStatement: "İSKELE KİRALAMA — premium analysis tool.",
  inputs: [
    { id: "cevreyukseklik", label: "Çevre/Yükseklik", type: "number", required: true },
    { id: "sure", label: "Süre", type: "number", required: true },
    { id: "m_kiralamaiscilik", label: "m² Kiralama/İşçilik", type: "number", required: true },
    { id: "sefer", label: "Sefer", type: "number", required: true },
    { id: "kritik_yol", label: "Kritik Yol", type: "number", required: true },
    { id: "risk", label: "Risk", type: "number", required: true },
  ],
  outputs: [
    { id: "area", label: "Area", unit: "currency", format: "currency" },
    { id: "vol", label: "Vol", unit: "currency", format: "currency" },
    { id: "rental", label: "Rental", unit: "currency", format: "currency" },
    { id: "lab__erect", label: "Lab_ Erect", unit: "currency", format: "currency" },
    { id: "lab__dism", label: "Lab_ Dism", unit: "currency", format: "currency" },
    { id: "transp", label: "Transp", unit: "currency", format: "currency" },
    { id: "total", label: "Total", unit: "currency", format: "currency" },
    { id: "opt_dur", label: "Opt Dur", unit: "currency", format: "currency" },
    { id: "overrun", label: "Overrun", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.iskele_kiralama_analyzer_0", inputMap: { Perim: "perim", Height: "height" }, outputId: "area" },
    { formulaId: "custom.iskele_kiralama_analyzer_1", inputMap: { Area: "area", Standoff: "standoff" }, outputId: "vol" },
    { formulaId: "custom.iskele_kiralama_analyzer_2", inputMap: { Area: "area", Rate: "rate", Dur: "dur" }, outputId: "rental" },
    { formulaId: "custom.iskele_kiralama_analyzer_3", inputMap: { Area: "area", ErectRate: "erect_rate" }, outputId: "lab__erect" },
    { formulaId: "custom.iskele_kiralama_analyzer_4", inputMap: { Area: "area", DismRate: "dism_rate" }, outputId: "lab__dism" },
    { formulaId: "custom.iskele_kiralama_analyzer_5", inputMap: { Trips: "trips", TruckRate: "truck_rate" }, outputId: "transp" },
    { formulaId: "custom.iskele_kiralama_analyzer_6", inputMap: { Rental: "rental", Lab_Erect: "lab__erect", Lab_Dism: "lab__dism", Transp: "transp" }, outputId: "total" },
    { formulaId: "custom.iskele_kiralama_analyzer_7", inputMap: { CritPath: "crit_path", Buffer: "buffer", Overlap: "overlap" }, outputId: "opt_dur" },
    { formulaId: "custom.iskele_kiralama_analyzer_8", inputMap: { Actual: "actual", OptDur: "opt_dur", DailyRate: "daily_rate" }, outputId: "overrun" },
  ],
  reportTemplate: {
    title: "İSKELE KİRALAMA Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
