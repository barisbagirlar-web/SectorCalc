import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("src/lib/premium-schema/schemas");

const FIXES = [
  // factory-layout-distance
  ['warningMessage_i18n: {"en":"Alan kullanımı < %50 — yerleşim optimizasyonu önerilir.","tr":"Alan kullanımı < %50 — yerleşim optimizasyonu önerilir."}',
   'warningMessage_i18n: {"en":"Space utilization < 50% — layout optimization recommended.","tr":"Alan kullanımı < %50 — yerleşim optimizasyonu önerilir."}'],
  ['criticalMessage_i18n: {"en":"Alan kullanımı < %35 — acil yeniden düzenleme.","tr":"Alan kullanımı < %35 — acil yeniden düzenleme."}',
   'criticalMessage_i18n: {"en":"Space utilization < 35% — urgent reconfiguration.","tr":"Alan kullanımı < %35 — acil yeniden düzenleme."}'],
  // digital-twin
  ['warningMessage_i18n: {"en":"ROI < %100 — fizibilite tekrar değerlendirilmeli.","tr":"ROI < %100 — fizibilite tekrar değerlendirilmeli."}',
   'warningMessage_i18n: {"en":"ROI < 100% — feasibility should be re-evaluated.","tr":"ROI < %100 — fizibilite tekrar değerlendirilmeli."}'],
  ['criticalMessage_i18n: {"en":"ROI < %50 — yatırım önerilmez.","tr":"ROI < %50 — yatırım önerilmez."}',
   'criticalMessage_i18n: {"en":"ROI < 50% — investment not recommended.","tr":"ROI < %50 — yatırım önerilmez."}'],
];

let total = 0;
for (const [oldStr, newStr] of FIXES) {
  const fileMatch = oldStr.match(/^warning|^critical/);
  const filePrefix = oldStr.includes("yerleşim") || oldStr.includes("yeniden") ? "factory-layout-distance-analyzer.ts" : "digital-twin-cost-analyzer.ts";
  const fpath = path.join(DIR, filePrefix);
  let content = fs.readFileSync(fpath, "utf-8");
  if (content.includes(oldStr)) {
    content = content.split(oldStr).join(newStr);
    fs.writeFileSync(fpath, content, "utf-8");
    total++;
    console.log(`  ✓ ${filePrefix}: fixed threshold`);
  }
}
console.log(`=== Fixed ${total} threshold messages ===`);
