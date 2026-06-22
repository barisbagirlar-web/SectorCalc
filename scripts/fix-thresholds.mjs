/**
 * Fix remaining threshold messages with $ signs - use callback replace to avoid $10K issues.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("src/lib/premium-schema/schemas");

function isTurkish(s) { return /[çşığöüÇŞİĞÖÜ]/u.test(s); }

const FILES = [
  "delivery-cost-analyzer.ts",
  "demand-forecast-stock-analyzer.ts",
  "digital-twin-cost-analyzer.ts",
  "downtime-cost-analyzer.ts",
  "dye-recipe-cost-analyzer.ts",
  "employee-turnover-cost-analyzer.ts",
  "energy-consumption-report-analyzer.ts",
  "environmental-waste-cost-analyzer.ts",
  "eoq-inventory-optimizer-analyzer.ts",
  "fabric-cutting-optimizer-analyzer.ts",
  "factory-layout-distance-analyzer.ts",
  "feed-cost-formulation-analyzer.ts",
  "fertilizer-dosage-analyzer.ts",
  "filament-recycling-analyzer.ts",
  "fire-hydrant-flow-analyzer.ts",
  "flexible-manufacturing-roi-analyzer.ts",
  "food-waste-margin-analyzer.ts",
  "freight-cost-analyzer.ts",
  "fuel-route-drift-analyzer.ts",
  "gage-rnr-cost-analyzer.ts",
  "haccp-deviation-cost-analyzer.ts",
  "heat-exchanger-fouling-analyzer.ts",
  "hourly-rate-analyzer.ts",
  "hvac-capacity-analyzer.ts",
  "hydraulic-system-loss-analyzer.ts",
  "inflation-escalation-analyzer.ts",
  "interest-rate-risk-analyzer.ts",
  "inventory-turnover-risk-analyzer.ts",
  "irr-investment-analyzer.ts",
  "irrigation-cost-check-analyzer.ts",
];

// Threshold message translations (Turkish-en → English-en)
const THRESHOLD_FIXES = [
  // delivery-cost
  ['warningMessage_i18n: {"en":"Teslimat verimliliği < %90 — süreç iyileştirme önerilir.","tr":"Teslimat verimliliği < %90 — süreç iyileştirme önerilir."}',
   'warningMessage_i18n: {"en":"Delivery efficiency < 90% — process improvement recommended.","tr":"Teslimat verimliliği < %90 — süreç iyileştirme önerilir."}'],
  ['criticalMessage_i18n: {"en":"Teslimat verimliliği < %80 — acil rota optimizasyonu gerekli.","tr":"Teslimat verimliliği < %80 — acil rota optimizasyonu gerekli."}',
   'criticalMessage_i18n: {"en":"Delivery efficiency < 80% — urgent route optimization needed.","tr":"Teslimat verimliliği < %80 — acil rota optimizasyonu gerekli."}'],
  // demand-forecast
  ['warningMessage_i18n: {"en":"Tahmin hatası > 100 adet — forecast modeli gözden geçirilmeli.","tr":"Tahmin hatası > 100 adet — forecast modeli gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Forecast error > 100 units — forecast model should be reviewed.","tr":"Tahmin hatası > 100 adet — forecast modeli gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Tahmin hatası > 300 adet — acil talep tahmini revizyonu gerekli.","tr":"Tahmin hatası > 300 adet — acil talep tahmini revizyonu gerekli."}',
   'criticalMessage_i18n: {"en":"Forecast error > 300 units — urgent demand forecast revision required.","tr":"Tahmin hatası > 300 adet — acil talep tahmini revizyonu gerekli."}'],
  // downtime
  ['warningMessage_i18n: {"en":"Duruş maliyeti > $10K — önleyici bakım planı gözden geçirilmeli.","tr":"Duruş maliyeti > $10K — önleyici bakım planı gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Downtime cost > $10K — preventive maintenance plan should be reviewed.","tr":"Duruş maliyeti > $10K — önleyici bakım planı gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Duruş maliyeti > $50K — acil kök neden analizi gerekiyor.","tr":"Duruş maliyeti > $50K — acil kök neden analizi gerekiyor."}',
   'criticalMessage_i18n: {"en":"Downtime cost > $50K — urgent root cause analysis required.","tr":"Duruş maliyeti > $50K — acil kök neden analizi gerekiyor."}'],
  // employee-turnover
  ['warningMessage_i18n: {"en":"Ciro maliyeti > $50K — çalışan bağlılığı programı değerlendirilmeli.","tr":"Ciro maliyeti > $50K — çalışan bağlılığı programı değerlendirilmeli."}',
   'warningMessage_i18n: {"en":"Turnover cost > $50K — employee engagement program should be evaluated.","tr":"Ciro maliyeti > $50K — çalışan bağlılığı programı değerlendirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Ciro maliyeti > $150K — acil elde tutma stratejisi gerekiyor.","tr":"Ciro maliyeti > $150K — acil elde tutma stratejisi gerekiyor."}',
   'criticalMessage_i18n: {"en":"Turnover cost > $150K — urgent retention strategy required.","tr":"Ciro maliyeti > $150K — acil elde tutma stratejisi gerekiyor."}'],
  // energy
  ['warningMessage_i18n: {"en":"PF < %90 — kompanzasyon iyileştirilmeli.","tr":"PF < %90 — kompanzasyon iyileştirilmeli."}',
   'warningMessage_i18n: {"en":"PF < 90% — compensation should be improved.","tr":"PF < %90 — kompanzasyon iyileştirilmeli."}'],
  ['criticalMessage_i18n: {"en":"PF < %85 — reaktif ceza riski yüksek.","tr":"PF < %85 — reaktif ceza riski yüksek."}',
   'criticalMessage_i18n: {"en":"PF < 85% — reactive penalty risk high.","tr":"PF < %85 — reaktif ceza riski yüksek."}'],
  // environmental-waste
  ['warningMessage_i18n: {"en":"Çevre maliyeti > $50K — azaltım programı başlatılmalı.","tr":"Çevre maliyeti > $50K — azaltım programı başlatılmalı."}',
   'warningMessage_i18n: {"en":"Environmental cost > $50K — reduction program should be initiated.","tr":"Çevre maliyeti > $50K — azaltım programı başlatılmalı."}'],
  ['criticalMessage_i18n: {"en":"Maliyet > $150K — acil çevre yönetimi aksiyonu.","tr":"Maliyet > $150K — acil çevre yönetimi aksiyonu."}',
   'criticalMessage_i18n: {"en":"Cost > $150K — urgent environmental management action.","tr":"Maliyet > $150K — acil çevre yönetimi aksiyonu."}'],
  // eoq
  ['warningMessage_i18n: {"en":"Maliyet > $10K — EOQ optimizasyonu önerilir.","tr":"Maliyet > $10K — EOQ optimizasyonu önerilir."}',
   'warningMessage_i18n: {"en":"Cost > $10K — EOQ optimization recommended.","tr":"Maliyet > $10K — EOQ optimizasyonu önerilir."}'],
  ['criticalMessage_i18n: {"en":"Maliyet > $25K — envanter politikası yenilenmeli.","tr":"Maliyet > $25K — envanter politikası yenilenmeli."}',
   'criticalMessage_i18n: {"en":"Cost > $25K — inventory policy should be renewed.","tr":"Maliyet > $25K — envanter politikası yenilenmeli."}'],
  // fabric-cutting
  ['warningMessage_i18n: {"en":"Verim < %80 — pastal optimizasyonu önerilir.","tr":"Verim < %80 — pastal optimizasyonu önerilir."}',
   'warningMessage_i18n: {"en":"Yield < 80% — spreading optimization recommended.","tr":"Verim < %80 — pastal optimizasyonu önerilir."}'],
  ['criticalMessage_i18n: {"en":"Fire oranı > %15 — kesim planı revizyonu acil.","tr":"Fire oranı > %15 — kesim planı revizyonu acil."}',
   'criticalMessage_i18n: {"en":"Waste rate > 15% — cutting plan revision urgent.","tr":"Fire oranı > %15 — kesim planı revizyonu acil."}'],
  // factory-layout
  ['warningMessage_i18n: {"en":"Malzeme taşıma mesafesi > 500m — yerleşim optimizasyonu önerilir.","tr":"Malzeme taşıma mesafesi > 500m — yerleşim optimizasyonu önerilir."}',
   'warningMessage_i18n: {"en":"Material handling distance > 500m — layout optimization recommended.","tr":"Malzeme taşıma mesafesi > 500m — yerleşim optimizasyonu önerilir."}'],
  ['criticalMessage_i18n: {"en":"Malzeme taşıma mesafesi > 1000m — yeniden yerleşim planı acil.","tr":"Malzeme taşıma mesafesi > 1000m — yeniden yerleşim planı acil."}',
   'criticalMessage_i18n: {"en":"Material handling distance > 1000m — relocation plan urgent.","tr":"Malzeme taşıma mesafesi > 1000m — yeniden yerleşim planı acil."}'],
  // feed-cost
  ['warningMessage_i18n: {"en":"FCR > 2.5 — yem verimliliği düşük.","tr":"FCR > 2.5 — yem verimliliği düşük."}',
   'warningMessage_i18n: {"en":"FCR > 2.5 — feed efficiency is low.","tr":"FCR > 2.5 — yem verimliliği düşük."}'],
  // fertilizer
  ['warningMessage_i18n: {"en":"Gübre maliyeti > $5000 — alternatif gübreleme değerlendirilmeli.","tr":"Gübre maliyeti > $5000 — alternatif gübreleme değerlendirilmeli."}',
   'warningMessage_i18n: {"en":"Fertilizer cost > $5000 — alternative fertilization should be evaluated.","tr":"Gübre maliyeti > $5000 — alternatif gübreleme değerlendirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Gübre maliyeti > $8000 — alternatif gübreleme stratejisi acil.","tr":"Gübre maliyeti > $8000 — alternatif gübreleme stratejisi acil."}',
   'criticalMessage_i18n: {"en":"Fertilizer cost > $8000 — urgent alternative fertilization strategy.","tr":"Gübre maliyeti > $8000 — alternatif gübreleme stratejisi acil."}'],
  // filament
  ['warningMessage_i18n: {"en":"ROI < %30 — geri dönüşüm yatırımı sorgulanmalı.","tr":"ROI < %30 — geri dönüşüm yatırımı sorgulanmalı."}',
   'warningMessage_i18n: {"en":"ROI < 30% — recycling investment should be questioned.","tr":"ROI < %30 — geri dönüşüm yatırımı sorgulanmalı."}'],
  ['criticalMessage_i18n: {"en":"ROI < %10 — yatırım fizibil değil.","tr":"ROI < %10 — yatırım fizibil değil."}',
   'criticalMessage_i18n: {"en":"ROI < 10% — investment not feasible.","tr":"ROI < %10 — yatırım fizibil değil."}'],
  // fire-hydrant
  ['warningMessage_i18n: {"en":"Uyum skoru < 70 — bakım planı oluşturulmalı.","tr":"Uyum skoru < 70 — bakım planı oluşturulmalı."}',
   'warningMessage_i18n: {"en":"Compliance score < 70 — maintenance plan should be created.","tr":"Uyum skoru < 70 — bakım planı oluşturulmalı."}'],
  ['criticalMessage_i18n: {"en":"Uyum skoru < 40 — acil hidrant yenileme programı gerekli.","tr":"Uyum skoru < 40 — acil hidrant yenileme programı gerekli."}',
   'criticalMessage_i18n: {"en":"Compliance score < 40 — urgent hydrant replacement program needed.","tr":"Uyum skoru < 40 — acil hidrant yenileme programı gerekli."}'],
  ['warningMessage_i18n: {"en":"Uyumsuzluk riski > $10K — sigorta gözden geçirilmeli.","tr":"Uyumsuzluk riski > $10K — sigorta gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Non-compliance risk > $10K — insurance should be reviewed.","tr":"Uyumsuzluk riski > $10K — sigorta gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek.","tr":"Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek."}',
   'criticalMessage_i18n: {"en":"Non-compliance risk > $30K — legal enforcement risk is high.","tr":"Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek."}'],
  // flexible-manufacturing
  ['warningMessage_i18n: {"en":"ROI < %30 — yatırım fizibilitesi sorgulanmalı.","tr":"ROI < %30 — yatırım fizibilitesi sorgulanmalı."}',
   'warningMessage_i18n: {"en":"ROI < 30% — investment feasibility should be questioned.","tr":"ROI < %30 — yatırım fizibilitesi sorgulanmalı."}'],
  ['criticalMessage_i18n: {"en":"ROI < %15 — dedicated sistem daha avantajlı olabilir.","tr":"ROI < %15 — dedicated sistem daha avantajlı olabilir."}',
   'criticalMessage_i18n: {"en":"ROI < 15% — dedicated system may be more advantageous.","tr":"ROI < %15 — dedicated sistem daha avantajlı olabilir."}'],
  // food-waste
  ['warningMessage_i18n: {"en":"Verim < %80 — fire azaltma programı başlatılmalı.","tr":"Verim < %80 — fire azaltma programı başlatılmalı."}',
   'warningMessage_i18n: {"en":"Yield < 80% — waste reduction program should be initiated.","tr":"Verim < %80 — fire azaltma programı başlatılmalı."}'],
  ['criticalMessage_i18n: {"en":"Verim < %70 — proses iyileştirme acil.","tr":"Verim < %70 — proses iyileştirme acil."}',
   'criticalMessage_i18n: {"en":"Yield < 70% — process improvement urgent.","tr":"Verim < %70 — proses iyileştirme acil."}'],
  // freight
  ['warningMessage_i18n: {"en":"Toplam navlun > $3K — alternatif taşımacılık modları değerlendirilmeli.","tr":"Toplam navlun > $3K — alternatif taşımacılık modları değerlendirilmeli."}',
   'warningMessage_i18n: {"en":"Total freight > $3K — alternative transport modes should be evaluated.","tr":"Toplam navlun > $3K — alternatif taşımacılık modları değerlendirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Toplam navlun > $8K — lojistik ihalesi yenilenmeli.","tr":"Toplam navlun > $8K — lojistik ihalesi yenilenmeli."}',
   'criticalMessage_i18n: {"en":"Total freight > $8K — logistics tender should be renewed.","tr":"Toplam navlun > $8K — lojistik ihalesi yenilenmeli."}'],
  // fuel-route
  ['warningMessage_i18n: {"en":"Sapma > 30 km — rota planlaması iyileştirilmeli.","tr":"Sapma > 30 km — rota planlaması iyileştirilmeli."}',
   'warningMessage_i18n: {"en":"Deviation > 30 km — route planning should be improved.","tr":"Sapma > 30 km — rota planlaması iyileştirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Sapma > 60 km — GPS takibi ve dispatcher kontrolü gerekli.","tr":"Sapma > 60 km — GPS takibi ve dispatcher kontrolü gerekli."}',
   'criticalMessage_i18n: {"en":"Deviation > 60 km — GPS tracking and dispatcher control needed.","tr":"Sapma > 60 km — GPS takibi ve dispatcher kontrolü gerekli."}'],
  ['warningMessage_i18n: {"en":"Sapma maliyeti > $10K — filo yönetim sistemi gözden geçirilmeli.","tr":"Sapma maliyeti > $10K — filo yönetim sistemi gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Deviation cost > $10K — fleet management system should be reviewed.","tr":"Sapma maliyeti > $10K — filo yönetim sistemi gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Sapma maliyeti > $30K — acil rota optimizasyonu başlatılmalı.","tr":"Sapma maliyeti > $30K — acil rota optimizasyonu başlatılmalı."}',
   'criticalMessage_i18n: {"en":"Deviation cost > $30K — urgent route optimization should be initiated.","tr":"Sapma maliyeti > $30K — acil rota optimizasyonu başlatılmalı."}'],
  // gage-rnr
  ['warningMessage_i18n: {"en":"%GRR > %20 — ölçüm sistemi iyileştirilmeli.","tr":"%GRR > %20 — ölçüm sistemi iyileştirilmeli."}',
   'warningMessage_i18n: {"en":"%GRR > 20% — measurement system should be improved.","tr":"%GRR > %20 — ölçüm sistemi iyileştirilmeli."}'],
  ['criticalMessage_i18n: {"en":"%GRR > %30 — ölçüm sistemi yetersiz.","tr":"%GRR > %30 — ölçüm sistemi yetersiz."}',
   'criticalMessage_i18n: {"en":"%GRR > 30% — measurement system is inadequate.","tr":"%GRR > %30 — ölçüm sistemi yetersiz."}'],
  // haccp
  ['warningMessage_i18n: {"en":"Maliyet > $50K — HACCP planı gözden geçirilmeli.","tr":"Maliyet > $50K — HACCP planı gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Cost > $50K — HACCP plan should be reviewed.","tr":"Maliyet > $50K — HACCP planı gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Maliyet > $150K — tesis denetimi ve düzeltici faaliyet acil.","tr":"Maliyet > $150K — tesis denetimi ve düzeltici faaliyet acil."}',
   'criticalMessage_i18n: {"en":"Cost > $150K — facility audit and corrective action urgent.","tr":"Maliyet > $150K — tesis denetimi ve düzeltici faaliyet acil."}'],
  // hourly-rate
  ['warningMessage_i18n: {"en":"Yüklü saatlik ücret >$50 — maliyet avantajı azalıyor.","tr":"Yüklü saatlik ücret >$50 — maliyet avantajı azalıyor."}',
   'warningMessage_i18n: {"en":"Loaded hourly rate > $50 — cost advantage is decreasing.","tr":"Yüklü saatlik ücret >$50 — maliyet avantajı azalıyor."}'],
  ['criticalMessage_i18n: {"en":"Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır.","tr":"Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır."}',
   'criticalMessage_i18n: {"en":"Loaded hourly rate > $80 — competitive pricing becomes difficult.","tr":"Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır."}'],
  // hvac
  ['warningMessage_i18n: {"en":"Enerji maliyeti > $5000 — EER iyileştirilmeli.","tr":"Enerji maliyeti > $5000 — EER iyileştirilmeli."}',
   'warningMessage_i18n: {"en":"Energy cost > $5000 — EER should be improved.","tr":"Enerji maliyeti > $5000 — EER iyileştirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Maliyet > $15000 — sistem yenileme değerlendirilmeli.","tr":"Maliyet > $15000 — sistem yenileme değerlendirilmeli."}',
   'criticalMessage_i18n: {"en":"Cost > $15000 — system replacement should be evaluated.","tr":"Maliyet > $15000 — sistem yenileme değerlendirilmeli."}'],
  // hydraulic
  ['warningMessage_i18n: {"en":"Verim < %80 — kaçak ve sürtünme kayıpları azaltılmalı.","tr":"Verim < %80 — kaçak ve sürtünme kayıpları azaltılmalı."}',
   'warningMessage_i18n: {"en":"Efficiency < 80% — leakage and friction losses should be reduced.","tr":"Verim < %80 — kaçak ve sürtünme kayıpları azaltılmalı."}'],
  ['criticalMessage_i18n: {"en":"Verim < %70 — sistem revizyonu gerekli.","tr":"Verim < %70 — sistem revizyonu gerekli."}',
   'criticalMessage_i18n: {"en":"Efficiency < 70% — system revision required.","tr":"Verim < %70 — sistem revizyonu gerekli."}'],
  // inflation
  ['warningMessage_i18n: {"en":"Karşılık > $100K — risk yönetimi planı gözden geçirilmeli.","tr":"Karşılık > $100K — risk yönetimi planı gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Provision > $100K — risk management plan should be reviewed.","tr":"Karşılık > $100K — risk yönetimi planı gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Karşılık > $250K — proje fizibilitesi risk altında.","tr":"Karşılık > $250K — proje fizibilitesi risk altında."}',
   'criticalMessage_i18n: {"en":"Provision > $250K — project feasibility is at risk.","tr":"Karşılık > $250K — proje fizibilitesi risk altında."}'],
  // interest-rate
  ['warningMessage_i18n: {"en":"Şok etkisi > $500K — hedge oranı artırılmalı.","tr":"Şok etkisi > $500K — hedge oranı artırılmalı."}',
   'warningMessage_i18n: {"en":"Shock impact > $500K — hedge ratio should be increased.","tr":"Şok etkisi > $500K — hedge oranı artırılmalı."}'],
  ['criticalMessage_i18n: {"en":"Şok etkisi > $1M — acil risk azaltma stratejisi.","tr":"Şok etkisi > $1M — acil risk azaltma stratejisi."}',
   'criticalMessage_i18n: {"en":"Shock impact > $1M — urgent risk mitigation strategy.","tr":"Şok etkisi > $1M — acil risk azaltma stratejisi."}'],
  // inventory-turnover
  ['warningMessage_i18n: {"en":"Stok devir hızı <4 — sermaye atıl kalıyor.","tr":"Stok devir hızı <4 — sermaye atıl kalıyor."}',
   'warningMessage_i18n: {"en":"Inventory turnover < 4 — capital is sitting idle.","tr":"Stok devir hızı <4 — sermaye atıl kalıyor."}'],
  ['criticalMessage_i18n: {"en":"Stok devir hızı <2 — acil stok eritme aksiyonu gerekli.","tr":"Stok devir hızı <2 — acil stok eritme aksiyonu gerekli."}',
   'criticalMessage_i18n: {"en":"Inventory turnover < 2 — urgent stock reduction action needed.","tr":"Stok devir hızı <2 — acil stok eritme aksiyonu gerekli."}'],
  // irr (handled separately due to apostrophe)
  ['criticalMessage_i18n: {"en":"IRR < %10 — yatırım fizibilitesi sorgulanmalı.","tr":"IRR < %10 — yatırım fizibilitesi sorgulanmalı."}',
   'criticalMessage_i18n: {"en":"IRR < 10% — investment feasibility should be questioned.","tr":"IRR < %10 — yatırım fizibilitesi sorgulanmalı."}'],
  // irrigation
  ['warningMessage_i18n: {"en":"Sulama maliyeti >$20K — sistem verimliliği sorgulanmalı.","tr":"Sulama maliyeti >$20K — sistem verimliliği sorgulanmalı."}',
   'warningMessage_i18n: {"en":"Irrigation cost > $20K — system efficiency should be questioned.","tr":"Sulama maliyeti >$20K — sistem verimliliği sorgulanmalı."}'],
  ['criticalMessage_i18n: {"en":"Sulama maliyeti >$40K — alternatif sulama yöntemleri değerlendirilmeli.","tr":"Sulama maliyeti >$40K — alternatif sulama yöntemleri değerlendirilmeli."}',
   'criticalMessage_i18n: {"en":"Irrigation cost > $40K — alternative irrigation methods should be evaluated.","tr":"Sulama maliyeti >$40K — alternatif sulama yöntemleri değerlendirilmeli."}'],
  // heat-exchanger
  ['warningMessage_i18n: {"en":"Enerji kaybı > $10K/yıl — temizlik planlanmalı.","tr":"Enerji kaybı > $10K/yıl — temizlik planlanmalı."}',
   'warningMessage_i18n: {"en":"Energy loss > $10K/year — cleaning should be scheduled.","tr":"Enerji kaybı > $10K/yıl — temizlik planlanmalı."}'],
  ['criticalMessage_i18n: {"en":"Kayıp > $30K/yıl — acil temizlik gerekli.","tr":"Kayıp > $30K/yıl — acil temizlik gerekli."}',
   'criticalMessage_i18n: {"en":"Loss > $30K/year — urgent cleaning needed.","tr":"Kayıp > $30K/yıl — acil temizlik gerekli."}'],
  // dye-recipe
  ['warningMessage_i18n: {"en":"Maliyet > $3/kg — optimizasyon potansiyeli var.","tr":"Maliyet > $3/kg — optimizasyon potansiyeli var."}',
   'warningMessage_i18n: {"en":"Cost > $3/kg — optimization potential exists.","tr":"Maliyet > $3/kg — optimizasyon potansiyeli var."}'],
  ['criticalMessage_i18n: {"en":"Maliyet > $5/kg — acil reçete optimizasyonu.","tr":"Maliyet > $5/kg — acil reçete optimizasyonu."}',
   'criticalMessage_i18n: {"en":"Cost > $5/kg — urgent recipe optimization.","tr":"Maliyet > $5/kg — acil reçete optimizasyonu."}'],
  // fabric-cutting (only yield warning was already done, add critical)
  ['criticalMessage_i18n: {"en":"Verim < %70 — acil iyileştirme gerekli.","tr":"Verim < %70 — acil iyileştirme gerekli."}',
   'criticalMessage_i18n: {"en":"Yield < 70% — urgent improvement needed.","tr":"Verim < %70 — acil iyileştirme gerekli."}'],
];

let total = 0;
for (const file of FILES) {
  const fpath = path.join(DIR, file);
  let content = fs.readFileSync(fpath, "utf-8");
  let fileChanged = false;
  for (const [oldStr, newStr] of THRESHOLD_FIXES) {
    if (content.includes(oldStr)) {
      // Use split/join to avoid $ interpretation in String.replace
      content = content.split(oldStr).join(newStr);
      fileChanged = true;
      total++;
    }
  }
  if (fileChanged) {
    fs.writeFileSync(fpath, content, "utf-8");
  }
}

// Handle IRR warning separately (contains apostrophe)
const irrFile = path.join(DIR, "irr-investment-analyzer.ts");
let irrContent = fs.readFileSync(irrFile, "utf-8");
const irrOld = `warningMessage_i18n: {"en":"IRR < %15 — WACC\u0027nin altında olabilir, risk değerlendirmesi yapılmalı.","tr":"IRR < %15 — WACC\u0027nin altında olabilir, risk değerlendirmesi yapılmalı."}`;
const irrNew = `warningMessage_i18n: {"en":"IRR < 15% — may be below WACC, risk assessment should be performed.","tr":"IRR < %15 — WACC\u0027nin altında olabilir, risk değerlendirmesi yapılmalı."}`;
if (irrContent.includes(irrOld)) {
  irrContent = irrContent.split(irrOld).join(irrNew);
  fs.writeFileSync(irrFile, irrContent, "utf-8");
  total++;
  console.log("  ✓ Fixed IRR warning message");
}

console.log(`=== Applied ${total} threshold message fixes across all files ===`);
