/**
 * Tool #20 — Cloud Fire Elimination (Bulut İsraf Temizliği)
 * ZombieResource + OversizingSavings + SpotSavings + ReservedSavings + IdleHoursCost
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CLOUD_WASTE_ELIMINATION_SCHEMA: PremiumCalculatorSchema = {
  id: "cloud-waste-elimination-analyzer", legacyPaidSlug: "cloud-waste-elimination-analyzer",
  name: "Cloud İsraf Temizliği (Waste Elimination) Analizi", sectorSlug: "it-cloud", category: "cost",
  painStatement: "Bulut harcamalarının %30-45'i gereksiz kaynaklardan oluşur: zombie kaynaklar, aşırı boyutlandırma ve boşta çalışan instance'lar. Bu araç toplam israfı hesaplar ve tasarruf potansiyelini gösterir.",
  inputs: [
    { id: "unattachedVolumes", label: "Bağımsız Disk Sayısı", type: "number", unit: "adet", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Unattached EBS volumes" },
    { id: "volumeRatePerMonth", label: "Disk Birim Fiyat", type: "number", unit: "USD/ay", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Monthly cost per unattached volume" },
    { id: "orphanSnapshotGb", label: "Atıl Snapshot Boyutu", type: "number", unit: "GB", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Orphaned snapshots total GB" },
    { id: "snapshotStorageRate", label: "Snapshot Depolama Ücreti", type: "number", unit: "USD/GB/ay", required: false, smartDefault: 0.05, validation: { min: 0 }, helper: "", expertMeaning: "S3/EFS snapshot cost per GB" },
    { id: "currentInstanceCost", label: "Mevcut Instance Maliyeti", type: "number", unit: "USD/ay", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Current monthly compute cost" },
    { id: "rightSizedInstanceCost", label: "Right-Sized Instance Maliyeti", type: "number", unit: "USD/ay", required: true, smartDefault: 3500, validation: { min: 0 }, helper: "", expertMeaning: "Optimized monthly compute cost" },
    { id: "spotUsageRatio", label: "Spot Kullanım Oranı", type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Current spot adoption" },
    { id: "targetSpotRatio", label: "Hedef Spot Oranı", type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target spot adoption" },
    { id: "onDemandCost", label: "On-Demand Aylık Maliyet", type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "On-demand spend eligible for RI" },
    { id: "reservedCost", label: "Reserved Instance Aylık Maliyet", type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Reserved instance cost" },
    { id: "nonBizHoursInstances", label: "Mesai Dışı Çalışan Sunucu Sayısı", type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Instances running 24/7 unnecessarily" },
    { id: "nonBizHoursPerMonth", label: "Mesai Dışı Saat/Ay", type: "number", unit: "saat", required: false, smartDefault: 300, validation: { min: 0 }, helper: "", expertMeaning: "Non-business hours per month" },
    { id: "instanceHourlyRate", label: "Instance Saatlik Maliyet", type: "number", unit: "USD/saat", required: false, smartDefault: 0.50, validation: { min: 0 }, helper: "", expertMeaning: "Average hourly instance cost" },
    { id: "zombieCostInput", label: "Zombie Kaynak Maliyeti (Tahmini)", type: "number", unit: "USD/ay", required: false, smartDefault: 350, validation: { min: 0 }, helper: "Bağımsız diskler + atıl snapshotlar.", expertMeaning: "Zombie resource cost per month" },
    { id: "oversizingSavingsInput", label: "Aşırı Boyutlandırma Tasarrufu", type: "number", unit: "USD/ay", required: false, smartDefault: 1500, validation: { min: 0 }, helper: "Mevcut - right-sized farkı.", expertMeaning: "Monthly oversizing waste" },
    { id: "spotSavingsInput", label: "Spot Instance Tasarruf Potansiyeli", type: "number", unit: "USD/ay", required: false, smartDefault: 450, validation: { min: 0 }, helper: "Spot kullanım artışından tasarruf.", expertMeaning: "Additional spot savings potential" },
    { id: "reservedSavingsInput", label: "Reserved Instance Tasarrufu", type: "number", unit: "USD/ay", required: false, smartDefault: 600, validation: { min: 0 }, helper: "Reserved vs on-demand farkı.", expertMeaning: "RI savings per month" },
    { id: "idleHoursCostInput", label: "Boşta Çalışan Instance Maliyeti", type: "number", unit: "USD/ay", required: false, smartDefault: 750, validation: { min: 0 }, helper: "Mesai dışı çalışan instance'lar.", expertMeaning: "Non-business hours instance cost" },
  ],
  outputs: [
    { id: "zombieResourceCost", label: "Zombie Kaynak Maliyeti", unit: "USD/ay", format: "currency" },
    { id: "oversizingSavings", label: "Aşırı Boyutlandırma Tasarrufu", unit: "USD/ay", format: "currency" },
    { id: "idleHoursCost", label: "Boşta Çalışan Instance Maliyeti", unit: "USD/ay", format: "currency" },
    { id: "totalWasteEliminated", label: "Toplam İsraf (Aylık)", unit: "USD/ay", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalWasteEliminated", warning: 2000, critical: 10000, direction: "higher_is_bad", warningMessage: "Aylık israf > $2K — bulut maliyet optimizasyonu planı başlatılmalı.", criticalMessage: "Aylık israf > $10K — acil FinOps müdahalesi gerekiyor." },
  ],
  formulaPipeline: [
    { formulaId: "cost.cloud_waste_total", inputMap: { zombieCost: "zombieCostInput", oversizingSavings: "oversizingSavingsInput", spotSavings: "spotSavingsInput", reservedSavings: "reservedSavingsInput", idleHoursCost: "idleHoursCostInput" }, outputId: "totalWasteEliminated" },
  ],
  reportTemplate: { title: "Cloud Waste Elimination Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Zombie cost = Unattached volumes × Rate + Orphan snapshots × Storage rate.", "Oversizing savings = (Current - RightSized) per month.", "Spot savings = (OnDemand - Spot) × fault-tolerant workload ratio.", "Reserved instance savings = (OnDemand - Reserved) × utilization.", "Idle hours cost = Non-business hours × Running instances × Hourly rate.", "Average waste: 30% overprovisioned, 20% idle, 15% zombie resources."] },
};
