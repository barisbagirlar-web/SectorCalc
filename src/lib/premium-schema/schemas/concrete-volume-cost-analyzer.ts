/**
 * Tool #12 — Beton Hacmi (Concrete Volume & Cost)
 * V_slab → V_footing → V_column → V_wall → Total volume → Weight → Cost
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const CONCRETE_GRADE_OPTIONS = [
  { value: "C20", label: "C20" }, { value: "C25", label: "C25" },
  { value: "C30", label: "C30" }, { value: "C35", label: "C35" },
  { value: "C40", label: "C40" },
] as const;

export const CONCRETE_VOLUME_SCHEMA: PremiumCalculatorSchema = {
  id: "concrete-volume-cost-analyzer", legacyPaidSlug: "concrete-volume-cost-analyzer",
  name: "Beton Hacmi & Maliyet Analizi", sectorSlug: "construction", category: "measurement",
  painStatement: "Şantiyelerde beton hacmi elle hesaplanırken fire, pompa ve tesviye maliyetleri sıklıkla gözden kaçar. Bu araç geometrik hacim + waste + maliyeti tek adımda hesaplar.",
  inputs: [
    { id: "slabLength", label: "Döşeme Uzunluğu", type: "number", unit: "m", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Slab length" },
    { id: "slabWidth", label: "Döşeme Genişliği", type: "number", unit: "m", required: false, smartDefault: 8, validation: { min: 0 }, helper: "", expertMeaning: "Slab width" },
    { id: "slabThickness", label: "Döşeme Kalınlığı", type: "number", unit: "cm", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Slab thickness" },
    { id: "footingCount", label: "Temel Sayısı", type: "number", unit: "adet", required: false, smartDefault: 6, validation: { min: 0 }, helper: "", expertMeaning: "Number of footings" },
    { id: "footingLength", label: "Temel Uzunluğu", type: "number", unit: "m", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Footing length" },
    { id: "footingWidth", label: "Temel Genişliği", type: "number", unit: "m", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Footing width" },
    { id: "footingDepth", label: "Temel Derinliği", type: "number", unit: "m", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Footing depth" },
    { id: "columnCount", label: "Kolon Sayısı", type: "number", unit: "adet", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Number of columns" },
    { id: "columnDiameter", label: "Kolon Çapı", type: "number", unit: "cm", required: false, smartDefault: 40, validation: { min: 0 }, helper: "", expertMeaning: "Column diameter" },
    { id: "columnHeight", label: "Kolon Yüksekliği", type: "number", unit: "m", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Column height" },
    { id: "wallLength", label: "Duvar Uzunluğu", type: "number", unit: "m", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Wall length" },
    { id: "wallHeight", label: "Duvar Yüksekliği", type: "number", unit: "m", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Wall height" },
    { id: "wallThickness", label: "Duvar Kalınlığı", type: "number", unit: "cm", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Wall thickness" },
    { id: "concreteGrade", label: "Beton Sınıfı", type: "select", unit: "", required: false, smartDefault: "C25", options: [...CONCRETE_GRADE_OPTIONS], helper: "", expertMeaning: "Concrete strength class" },
    { id: "concreteDensity", label: "Beton Yoğunluğu", type: "number", unit: "kg/m³", required: false, smartDefault: 2400, validation: { min: 0 }, helper: "", expertMeaning: "Concrete density" },
    { id: "wasteFactor", label: "Fire Oranı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Waste factor" },
    { id: "unitPrice", label: "Beton Birim Fiyat", type: "number", unit: "USD/m³", required: false, smartDefault: 120, validation: { min: 0 }, helper: "", expertMeaning: "Concrete price per m³" },
    { id: "pumpCost", label: "Pompa Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Concrete pump cost" },
  ],
  outputs: [
    { id: "totalVolume", label: "Toplam Beton Hacmi", unit: "m³", format: "number" },
    { id: "totalWeight", label: "Toplam Ağırlık", unit: "kg", format: "number" },
    { id: "truckLoads", label: "Kamyon Sayısı", unit: "adet", format: "number" },
    { id: "totalCost", label: "Toplam Maliyet", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalCost", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "Beton maliyeti > $10K — alternatif tedarikçi değerlendir.", criticalMessage: "Beton maliyeti > $50K — ihale süreci başlatılmalı." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.concrete_volume_total", inputMap: { slabLength: "slabLength", slabWidth: "slabWidth", slabThickness: "slabThickness", footingLength: "footingLength", footingWidth: "footingWidth", footingDepth: "footingDepth", footingCount: "footingCount", columnDiameter: "columnDiameter", columnHeight: "columnHeight", columnCount: "columnCount", wallLength: "wallLength", wallHeight: "wallHeight", wallThickness: "wallThickness", wasteFactor: "wasteFactor" }, outputId: "totalVolume" },
  ],
  reportTemplate: { title: "Concrete Volume & Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["V_slab = L × W × T (m). V_footing = L × W × D × Count.", "V_column = π×(D/2)²×H×Count. V_wall = L × H × T.", "Total volume with waste = V_geometric × (1 + WasteFactor/100).", "Truck loads = CEILING(TotalVolume / 8 m³). Standard truck = 8 m³."] },
};
