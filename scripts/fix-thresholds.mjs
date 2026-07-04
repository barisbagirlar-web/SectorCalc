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
  "waste-hydrant-flow-analyzer.ts",
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
  ['criticalMessage_i18n: {"en":"Teslimat verimliliği < %80 — emergency rota optimizasyonu gerekli.","tr":"Teslimat verimliliği < %80 — emergency rota optimizasyonu gerekli."}',
   'criticalMessage_i18n: {"en":"Delivery efficiency < 80% — urgent route optimization needed.","tr":"Teslimat verimliliği < %80 — emergency rota optimizasyonu gerekli."}'],
  // demand-forecast
  ['warningMessage_i18n: {"en":"Prediction hatası > 100 count — forecast modeli gözden geçirilmeli.","tr":"Prediction hatası > 100 count — forecast modeli gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Forecast error > 100 units — forecast model should be reviewed.","tr":"Prediction hatası > 100 count — forecast modeli gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Prediction hatası > 300 count — emergency demand tahmini revizyonu gerekli.","tr":"Prediction hatası > 300 count — emergency demand tahmini revizyonu gerekli."}',
   'criticalMessage_i18n: {"en":"Forecast error > 300 units — urgent demand forecast revision required.","tr":"Prediction hatası > 300 count — emergency demand tahmini revizyonu gerekli."}'],
  // downtime
  ['warningMessage_i18n: {"en":"Duruş cost > $10K — önleyici bakım planı gözden geçirilmeli.","tr":"Duruş cost > $10K — önleyici bakım planı gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Downtime cost > $10K — preventive maintenance plan should be reviewed.","tr":"Duruş cost > $10K — önleyici bakım planı gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Duruş cost > $50K — emergency kök neden analysis gerekiyor.","tr":"Duruş cost > $50K — emergency kök neden analysis gerekiyor."}',
   'criticalMessage_i18n: {"en":"Downtime cost > $50K — urgent root cause analysis required.","tr":"Duruş cost > $50K — emergency kök neden analysis gerekiyor."}'],
  // employee-turnover
  ['warningMessage_i18n: {"en":"Ciro cost > $50K — çalışan bağlılığı programı değerlendirilmeli.","tr":"Ciro cost > $50K — çalışan bağlılığı programı değerlendirilmeli."}',
   'warningMessage_i18n: {"en":"Turnover cost > $50K — employee engagement program should be evaluated.","tr":"Ciro cost > $50K — çalışan bağlılığı programı değerlendirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Ciro cost > $150K — emergency elde tutma stratejisi gerekiyor.","tr":"Ciro cost > $150K — emergency elde tutma stratejisi gerekiyor."}',
   'criticalMessage_i18n: {"en":"Turnover cost > $150K — urgent retention strategy required.","tr":"Ciro cost > $150K — emergency elde tutma stratejisi gerekiyor."}'],
  // energy
  ['warningMessage_i18n: {"en":"PF < %90 — kompanzasyon iyileştirilmeli.","tr":"PF < %90 — kompanzasyon iyileştirilmeli."}',
   'warningMessage_i18n: {"en":"PF < 90% — compensation should be improved.","tr":"PF < %90 — kompanzasyon iyileştirilmeli."}'],
  ['criticalMessage_i18n: {"en":"PF < %85 — reaktif ceza riski yüksek.","tr":"PF < %85 — reaktif ceza riski yüksek."}',
   'criticalMessage_i18n: {"en":"PF < 85% — reactive penalty risk high.","tr":"PF < %85 — reaktif ceza riski yüksek."}'],
  // environmental-waste
  ['warningMessage_i18n: {"en":"Çevre cost > $50K — azaltım programı başlatılmalı.","tr":"Çevre cost > $50K — azaltım programı başlatılmalı."}',
   'warningMessage_i18n: {"en":"Environmental cost > $50K — reduction program should be initiated.","tr":"Çevre cost > $50K — azaltım programı başlatılmalı."}'],
  ['criticalMessage_i18n: {"en":"Cost > $150K — emergency çevre yönetimi aksiyonu.","tr":"Cost > $150K — emergency çevre yönetimi aksiyonu."}',
   'criticalMessage_i18n: {"en":"Cost > $150K — urgent environmental management action.","tr":"Cost > $150K — emergency çevre yönetimi aksiyonu."}'],
  // eoq
  ['warningMessage_i18n: {"en":"Cost > $10K — EOQ optimizasyonu önerilir.","tr":"Cost > $10K — EOQ optimizasyonu önerilir."}',
   'warningMessage_i18n: {"en":"Cost > $10K — EOQ optimization recommended.","tr":"Cost > $10K — EOQ optimizasyonu önerilir."}'],
  ['criticalMessage_i18n: {"en":"Cost > $25K — envanter politikası yenilenmeli.","tr":"Cost > $25K — envanter politikası yenilenmeli."}',
   'criticalMessage_i18n: {"en":"Cost > $25K — inventory policy should be renewed.","tr":"Cost > $25K — envanter politikası yenilenmeli."}'],
  // fabric-cutting
  ['warningMessage_i18n: {"en":"Efficiency < %80 — pastal optimizasyonu önerilir.","tr":"Efficiency < %80 — pastal optimizasyonu önerilir."}',
   'warningMessage_i18n: {"en":"Yield < 80% — spreading optimization recommended.","tr":"Efficiency < %80 — pastal optimizasyonu önerilir."}'],
  ['criticalMessage_i18n: {"en":"Waste ratioı > %15 — kesim planı revizyonu emergency.","tr":"Waste ratioı > %15 — kesim planı revizyonu emergency."}',
   'criticalMessage_i18n: {"en":"Waste rate > 15% — cutting plan revision urgent.","tr":"Waste ratioı > %15 — kesim planı revizyonu emergency."}'],
  // factory-layout
  ['warningMessage_i18n: {"en":"Material taşıma mesafesi > 500m — yerleşim optimizasyonu önerilir.","tr":"Material taşıma mesafesi > 500m — yerleşim optimizasyonu önerilir."}',
   'warningMessage_i18n: {"en":"Material handling distance > 500m — layout optimization recommended.","tr":"Material taşıma mesafesi > 500m — yerleşim optimizasyonu önerilir."}'],
  ['criticalMessage_i18n: {"en":"Material taşıma mesafesi > 1000m — yeniden yerleşim planı emergency.","tr":"Material taşıma mesafesi > 1000m — yeniden yerleşim planı emergency."}',
   'criticalMessage_i18n: {"en":"Material handling distance > 1000m — relocation plan urgent.","tr":"Material taşıma mesafesi > 1000m — yeniden yerleşim planı emergency."}'],
  // feed-cost
  ['warningMessage_i18n: {"en":"FCR > 2.5 — yem verimliliği düşük.","tr":"FCR > 2.5 — yem verimliliği düşük."}',
   'warningMessage_i18n: {"en":"FCR > 2.5 — feed efficiency is low.","tr":"FCR > 2.5 — yem verimliliği düşük."}'],
  // fertilizer
  ['warningMessage_i18n: {"en":"Gübre cost > $5000 — alternatif gübreleme değerlendirilmeli.","tr":"Gübre cost > $5000 — alternatif gübreleme değerlendirilmeli."}',
   'warningMessage_i18n: {"en":"Fertilizer cost > $5000 — alternative fertilization should be evaluated.","tr":"Gübre cost > $5000 — alternatif gübreleme değerlendirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Gübre cost > $8000 — alternatif gübreleme stratejisi emergency.","tr":"Gübre cost > $8000 — alternatif gübreleme stratejisi emergency."}',
   'criticalMessage_i18n: {"en":"Fertilizer cost > $8000 — urgent alternative fertilization strategy.","tr":"Gübre cost > $8000 — alternatif gübreleme stratejisi emergency."}'],
  // filament
  ['warningMessage_i18n: {"en":"ROI < %30 — geri dönüşüm yatırımı sorgulanmalı.","tr":"ROI < %30 — geri dönüşüm yatırımı sorgulanmalı."}',
   'warningMessage_i18n: {"en":"ROI < 30% — recycling investment should be questioned.","tr":"ROI < %30 — geri dönüşüm yatırımı sorgulanmalı."}'],
  ['criticalMessage_i18n: {"en":"ROI < %10 — yatırım fizibil değil.","tr":"ROI < %10 — yatırım fizibil değil."}',
   'criticalMessage_i18n: {"en":"ROI < 10% — investment not feasible.","tr":"ROI < %10 — yatırım fizibil değil."}'],
  // waste-hydrant
  ['warningMessage_i18n: {"en":"Uyum skoru < 70 — bakım planı oluşturulmalı.","tr":"Uyum skoru < 70 — bakım planı oluşturulmalı."}',
   'warningMessage_i18n: {"en":"Compliance score < 70 — maintenance plan should be created.","tr":"Uyum skoru < 70 — bakım planı oluşturulmalı."}'],
  ['criticalMessage_i18n: {"en":"Uyum skoru < 40 — emergency hidrant yenileme programı gerekli.","tr":"Uyum skoru < 40 — emergency hidrant yenileme programı gerekli."}',
   'criticalMessage_i18n: {"en":"Compliance score < 40 — urgent hydrant replacement program needed.","tr":"Uyum skoru < 40 — emergency hidrant yenileme programı gerekli."}'],
  ['warningMessage_i18n: {"en":"Uyumsuzluk riski > $10K — insurance gözden geçirilmeli.","tr":"Uyumsuzluk riski > $10K — insurance gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Non-compliance risk > $10K — insurance should be reviewed.","tr":"Uyumsuzluk riski > $10K — insurance gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek.","tr":"Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek."}',
   'criticalMessage_i18n: {"en":"Non-compliance risk > $30K — legal enforcement risk is high.","tr":"Uyumsuzluk riski > $30K — yasal yaptırım riski yüksek."}'],
  // flexible-manufacturing
  ['warningMessage_i18n: {"en":"ROI < %30 — yatırım fizibilitesi sorgulanmalı.","tr":"ROI < %30 — yatırım fizibilitesi sorgulanmalı."}',
   'warningMessage_i18n: {"en":"ROI < 30% — investment feasibility should be questioned.","tr":"ROI < %30 — yatırım fizibilitesi sorgulanmalı."}'],
  ['criticalMessage_i18n: {"en":"ROI < %15 — dedicated sistem daha avantajlı olabilir.","tr":"ROI < %15 — dedicated sistem daha avantajlı olabilir."}',
   'criticalMessage_i18n: {"en":"ROI < 15% — dedicated system may be more advantageous.","tr":"ROI < %15 — dedicated sistem daha avantajlı olabilir."}'],
  // food-waste
  ['warningMessage_i18n: {"en":"Efficiency < %80 — waste azaltma programı başlatılmalı.","tr":"Efficiency < %80 — waste azaltma programı başlatılmalı."}',
   'warningMessage_i18n: {"en":"Yield < 80% — waste reduction program should be initiated.","tr":"Efficiency < %80 — waste azaltma programı başlatılmalı."}'],
  ['criticalMessage_i18n: {"en":"Efficiency < %70 — process iyileştirme emergency.","tr":"Efficiency < %70 — process iyileştirme emergency."}',
   'criticalMessage_i18n: {"en":"Yield < 70% — process improvement urgent.","tr":"Efficiency < %70 — process iyileştirme emergency."}'],
  // freight
  ['warningMessage_i18n: {"en":"Total navlun > $3K — alternatif taşımacılık modları değerlendirilmeli.","tr":"Total navlun > $3K — alternatif taşımacılık modları değerlendirilmeli."}',
   'warningMessage_i18n: {"en":"Total freight > $3K — alternative transport modes should be evaluated.","tr":"Total navlun > $3K — alternatif taşımacılık modları değerlendirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Total navlun > $8K — lojistik ihalesi yenilenmeli.","tr":"Total navlun > $8K — lojistik ihalesi yenilenmeli."}',
   'criticalMessage_i18n: {"en":"Total freight > $8K — logistics tender should be renewed.","tr":"Total navlun > $8K — lojistik ihalesi yenilenmeli."}'],
  // fuel-route
  ['warningMessage_i18n: {"en":"Deviation > 30 km — rota planlaması iyileştirilmeli.","tr":"Deviation > 30 km — rota planlaması iyileştirilmeli."}',
   'warningMessage_i18n: {"en":"Deviation > 30 km — route planning should be improved.","tr":"Deviation > 30 km — rota planlaması iyileştirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Deviation > 60 km — GPS takibi ve dispatcher controlü gerekli.","tr":"Deviation > 60 km — GPS takibi ve dispatcher controlü gerekli."}',
   'criticalMessage_i18n: {"en":"Deviation > 60 km — GPS tracking and dispatcher control needed.","tr":"Deviation > 60 km — GPS takibi ve dispatcher controlü gerekli."}'],
  ['warningMessage_i18n: {"en":"Deviation cost > $10K — filo yönetim sistemi gözden geçirilmeli.","tr":"Deviation cost > $10K — filo yönetim sistemi gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Deviation cost > $10K — fleet management system should be reviewed.","tr":"Deviation cost > $10K — filo yönetim sistemi gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Deviation cost > $30K — emergency rota optimizasyonu başlatılmalı.","tr":"Deviation cost > $30K — emergency rota optimizasyonu başlatılmalı."}',
   'criticalMessage_i18n: {"en":"Deviation cost > $30K — urgent route optimization should be initiated.","tr":"Deviation cost > $30K — emergency rota optimizasyonu başlatılmalı."}'],
  // gage-rnr
  ['warningMessage_i18n: {"en":"%GRR > %20 — ölçüm sistemi iyileştirilmeli.","tr":"%GRR > %20 — ölçüm sistemi iyileştirilmeli."}',
   'warningMessage_i18n: {"en":"%GRR > 20% — measurement system should be improved.","tr":"%GRR > %20 — ölçüm sistemi iyileştirilmeli."}'],
  ['criticalMessage_i18n: {"en":"%GRR > %30 — ölçüm sistemi yetersiz.","tr":"%GRR > %30 — ölçüm sistemi yetersiz."}',
   'criticalMessage_i18n: {"en":"%GRR > 30% — measurement system is inadequate.","tr":"%GRR > %30 — ölçüm sistemi yetersiz."}'],
  // haccp
  ['warningMessage_i18n: {"en":"Cost > $50K — HACCP planı gözden geçirilmeli.","tr":"Cost > $50K — HACCP planı gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Cost > $50K — HACCP plan should be reviewed.","tr":"Cost > $50K — HACCP planı gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Cost > $150K — tesis audit ve düzeltici faaliyet emergency.","tr":"Cost > $150K — tesis audit ve düzeltici faaliyet emergency."}',
   'criticalMessage_i18n: {"en":"Cost > $150K — facility audit and corrective action urgent.","tr":"Cost > $150K — tesis audit ve düzeltici faaliyet emergency."}'],
  // hourly-rate
  ['warningMessage_i18n: {"en":"Yüklü saatlik ücret >$50 — cost avantajı azalıyor.","tr":"Yüklü saatlik ücret >$50 — cost avantajı azalıyor."}',
   'warningMessage_i18n: {"en":"Loaded hourly rate > $50 — cost advantage is decreasing.","tr":"Yüklü saatlik ücret >$50 — cost avantajı azalıyor."}'],
  ['criticalMessage_i18n: {"en":"Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır.","tr":"Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır."}',
   'criticalMessage_i18n: {"en":"Loaded hourly rate > $80 — competitive pricing becomes difficult.","tr":"Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır."}'],
  // hvac
  ['warningMessage_i18n: {"en":"Energy cost > $5000 — EER iyileştirilmeli.","tr":"Energy cost > $5000 — EER iyileştirilmeli."}',
   'warningMessage_i18n: {"en":"Energy cost > $5000 — EER should be improved.","tr":"Energy cost > $5000 — EER iyileştirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Cost > $15000 — sistem yenileme değerlendirilmeli.","tr":"Cost > $15000 — sistem yenileme değerlendirilmeli."}',
   'criticalMessage_i18n: {"en":"Cost > $15000 — system replacement should be evaluated.","tr":"Cost > $15000 — sistem yenileme değerlendirilmeli."}'],
  // hydraulic
  ['warningMessage_i18n: {"en":"Efficiency < %80 — kaçak ve sürtünme kayıpları azaltılmalı.","tr":"Efficiency < %80 — kaçak ve sürtünme kayıpları azaltılmalı."}',
   'warningMessage_i18n: {"en":"Efficiency < 80% — leakage and friction losses should be reduced.","tr":"Efficiency < %80 — kaçak ve sürtünme kayıpları azaltılmalı."}'],
  ['criticalMessage_i18n: {"en":"Efficiency < %70 — sistem revizyonu gerekli.","tr":"Efficiency < %70 — sistem revizyonu gerekli."}',
   'criticalMessage_i18n: {"en":"Efficiency < 70% — system revision required.","tr":"Efficiency < %70 — sistem revizyonu gerekli."}'],
  // inflation
  ['warningMessage_i18n: {"en":"Profitşılık > $100K — risk yönetimi planı gözden geçirilmeli.","tr":"Profitşılık > $100K — risk yönetimi planı gözden geçirilmeli."}',
   'warningMessage_i18n: {"en":"Provision > $100K — risk management plan should be reviewed.","tr":"Profitşılık > $100K — risk yönetimi planı gözden geçirilmeli."}'],
  ['criticalMessage_i18n: {"en":"Profitşılık > $250K — project fizibilitesi risk altında.","tr":"Profitşılık > $250K — project fizibilitesi risk altında."}',
   'criticalMessage_i18n: {"en":"Provision > $250K — project feasibility is at risk.","tr":"Profitşılık > $250K — project fizibilitesi risk altında."}'],
  // interest-rate
  ['warningMessage_i18n: {"en":"Şok etkisi > $500K — hedge ratioı artırılmalı.","tr":"Şok etkisi > $500K — hedge ratioı artırılmalı."}',
   'warningMessage_i18n: {"en":"Shock impact > $500K — hedge ratio should be increased.","tr":"Şok etkisi > $500K — hedge ratioı artırılmalı."}'],
  ['criticalMessage_i18n: {"en":"Şok etkisi > $1M — emergency risk azaltma stratejisi.","tr":"Şok etkisi > $1M — emergency risk azaltma stratejisi."}',
   'criticalMessage_i18n: {"en":"Shock impact > $1M — urgent risk mitigation strategy.","tr":"Şok etkisi > $1M — emergency risk azaltma stratejisi."}'],
  // inventory-turnover
  ['warningMessage_i18n: {"en":"Inventory devir hızı <4 — sermaye atıl kalıyor.","tr":"Inventory devir hızı <4 — sermaye atıl kalıyor."}',
   'warningMessage_i18n: {"en":"Inventory turnover < 4 — capital is sitting idle.","tr":"Inventory devir hızı <4 — sermaye atıl kalıyor."}'],
  ['criticalMessage_i18n: {"en":"Inventory devir hızı <2 — emergency inventory eritme aksiyonu gerekli.","tr":"Inventory devir hızı <2 — emergency inventory eritme aksiyonu gerekli."}',
   'criticalMessage_i18n: {"en":"Inventory turnover < 2 — urgent stock reduction action needed.","tr":"Inventory devir hızı <2 — emergency inventory eritme aksiyonu gerekli."}'],
  // irr (handled separately due to apostrophe)
  ['criticalMessage_i18n: {"en":"IRR < %10 — yatırım fizibilitesi sorgulanmalı.","tr":"IRR < %10 — yatırım fizibilitesi sorgulanmalı."}',
   'criticalMessage_i18n: {"en":"IRR < 10% — investment feasibility should be questioned.","tr":"IRR < %10 — yatırım fizibilitesi sorgulanmalı."}'],
  // irrigation
  ['warningMessage_i18n: {"en":"Sulama cost >$20K — sistem verimliliği sorgulanmalı.","tr":"Sulama cost >$20K — sistem verimliliği sorgulanmalı."}',
   'warningMessage_i18n: {"en":"Irrigation cost > $20K — system efficiency should be questioned.","tr":"Sulama cost >$20K — sistem verimliliği sorgulanmalı."}'],
  ['criticalMessage_i18n: {"en":"Sulama cost >$40K — alternatif sulama yöntemleri değerlendirilmeli.","tr":"Sulama cost >$40K — alternatif sulama yöntemleri değerlendirilmeli."}',
   'criticalMessage_i18n: {"en":"Irrigation cost > $40K — alternative irrigation methods should be evaluated.","tr":"Sulama cost >$40K — alternatif sulama yöntemleri değerlendirilmeli."}'],
  // heat-exchanger
  ['warningMessage_i18n: {"en":"Energy kaybı > $10K/yıl — temizlik planlanmalı.","tr":"Energy kaybı > $10K/yıl — temizlik planlanmalı."}',
   'warningMessage_i18n: {"en":"Energy loss > $10K/year — cleaning should be scheduled.","tr":"Energy kaybı > $10K/yıl — temizlik planlanmalı."}'],
  ['criticalMessage_i18n: {"en":"Kayıp > $30K/yıl — emergency temizlik gerekli.","tr":"Kayıp > $30K/yıl — emergency temizlik gerekli."}',
   'criticalMessage_i18n: {"en":"Loss > $30K/year — urgent cleaning needed.","tr":"Kayıp > $30K/yıl — emergency temizlik gerekli."}'],
  // dye-recipe
  ['warningMessage_i18n: {"en":"Cost > $3/kg — optimizasyon potansiyeli var.","tr":"Cost > $3/kg — optimizasyon potansiyeli var."}',
   'warningMessage_i18n: {"en":"Cost > $3/kg — optimization potential exists.","tr":"Cost > $3/kg — optimizasyon potansiyeli var."}'],
  ['criticalMessage_i18n: {"en":"Cost > $5/kg — emergency reçete optimizasyonu.","tr":"Cost > $5/kg — emergency reçete optimizasyonu."}',
   'criticalMessage_i18n: {"en":"Cost > $5/kg — urgent recipe optimization.","tr":"Cost > $5/kg — emergency reçete optimizasyonu."}'],
  // fabric-cutting (only yield warning was already done, add critical)
  ['criticalMessage_i18n: {"en":"Efficiency < %70 — emergency iyileştirme gerekli.","tr":"Efficiency < %70 — emergency iyileştirme gerekli."}',
   'criticalMessage_i18n: {"en":"Yield < 70% — urgent improvement needed.","tr":"Efficiency < %70 — emergency iyileştirme gerekli."}'],
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
