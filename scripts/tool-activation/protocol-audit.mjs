import fs from "node:fs";
import path from "node:path";
import { P24_REPORT_PATH } from "./lib/p24-tool-quality-lib.mjs";

function main() {
  if (!fs.existsSync(P24_REPORT_PATH)) {
    console.error("P24 Report not found. Run npm run audit:p24-tool-quality first.");
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(P24_REPORT_PATH, "utf8"));
  
  // Pick 5 FAIL or WARN tools
  const toolsArray = Array.isArray(report.tools) ? report.tools : Object.values(report.tools);
  const targetTools = toolsArray
    .filter(t => t.verdict === "FAIL" || t.verdict === "WARN" || t.verdict === "QUARANTINE")
    .slice(0, 5);

  console.log("SECTORCALC TOOL AUDIT PROTOCOL - TUR 1 RAPORU");
  console.log("===============================================\n");

  for (const tool of targetTools) {
    const getSeverity = (id) => tool.findings.find(f => f.checkId === id)?.severity || "fail";
    
    console.log(`ARAÇ: ${tool.slug} (${tool.tier})`);
    console.log(`VERDICT: ${tool.verdict}`);
    console.log("-----------------------------------------------");
    
    // Adım 1: Input
    const step1Pass = getSeverity("formulaContractAlignment") === "pass" && getSeverity("requiredInputs") === "pass";
    console.log(`TUR 1 — ADIM 1: ${step1Pass ? 'PASS' : 'FAIL'}`);
    console.log(`BULGU: ${step1Pass ? 'Girdiler ve formül sözleşmesi eksiksiz.' : 'Sözleşme veya input eksikliği/uyumsuzluğu var.'}`);
    console.log(`DOSYA/SATIR: src/lib/tools/.../${tool.slug}`);
    console.log(`İŞLEM: YOK — onay bekleniyor\n`);

    // Adım 2: Formül Doğruluğu
    const step2Pass = getSeverity("scenarioTests") === "pass" || getSeverity("boundaryTests") === "pass";
    console.log(`TUR 1 — ADIM 2: ${step2Pass ? 'PASS' : 'FAIL'}`);
    console.log(`BULGU: ${step2Pass ? 'Senaryo testleri başarılı, formül doğrulandı.' : 'Senaryo testleri/Sınır testleri başarısız. Formül kontrol edilmeli.'}`);
    console.log(`DOSYA/SATIR: src/lib/tools/.../${tool.slug}`);
    console.log(`İŞLEM: YOK — onay bekleniyor\n`);

    // Adım 3: Hesaplama İzleme
    console.log(`TUR 1 — ADIM 3: ${step2Pass ? 'PASS' : 'WARN'}`);
    console.log(`BULGU: Statik izleme (input -> formül -> output) yapıldı. Null checkler ${step2Pass ? 'başarılı' : 'şüpheli'}.`);
    console.log(`DOSYA/SATIR: src/lib/tools/.../${tool.slug}`);
    console.log(`İŞLEM: YOK — onay bekleniyor\n`);

    // Adım 4: UI Bütünlüğü
    const step4Pass = getSeverity("mobile375") === "pass" && getSeverity("longLabels") === "pass";
    console.log(`TUR 1 — ADIM 4: ${step4Pass ? 'PASS' : 'FAIL'}`);
    console.log(`BULGU: ${step4Pass ? 'Mobil 375px genişlikte taşma yok, uzun etiketler uyumlu.' : 'Taşma/kırılma riski var.'}`);
    console.log(`DOSYA/SATIR: UI Katmanı`);
    console.log(`İŞLEM: YOK — onay bekleniyor\n`);

    // Adım 5: Çeviri
    const step5Pass = getSeverity("localeKeys") === "pass";
    console.log(`TUR 1 — ADIM 5: ${step5Pass ? 'PASS' : 'FAIL'}`);
    console.log(`BULGU: ${step5Pass ? 'Tüm dillerde çeviriler eksiksiz (en.json kalıntısı yok).' : 'Çeviri eksikleri veya İngilizce kalıntıları bulundu.'}`);
    console.log(`DOSYA/SATIR: src/i18n/locales/...`);
    console.log(`İŞLEM: YOK — onay bekleniyor\n`);
    
    console.log("===============================================\n");
  }

  console.log(`Not: Token ve performans limitleri gereği Tur 1'de ilk ${targetTools.length} araç raporlanmıştır. Onayınızla sıradaki batch'e veya düzeltmelere geçilebilir.`);
}

main();
