#!/usr/bin/env node
/**
 * P5A — Manual UI checklist generator (markdown only).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUTPUT_PATH = path.join(ROOT, "scripts/.cache/p5-manual-ui-checklist.md");

const CRITICAL_ROUTES = [
  "/tr",
  "/en",
  "/tr/free-tools",
  "/tr/premium-tools",
  "/tr/pricing",
  "/tr/trust",
  "/tr/reports/sample-decision-report",
  "/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi",
  "/tr/tools/premium/3d-print-job-margin-tool",
  "/tr/tools/premium-schema/cnc-oee-loss",
  "/tr/tools/premium-schema/7-israf-muda-avcisi-parasal-karsilik-calculator",
  "/tr/tools/free/machine-time-calculator",
  "/tr/tools/free/project-cost-calculator",
];

function checkbox(label) {
  return `- [ ] ${label}`;
}

function buildChecklist() {
  const generatedAt = new Date().toISOString();
  const routeList = CRITICAL_ROUTES.map((route) => `- \`${route}\``).join("\n");

  return `# P5 Manual UI Checklist

> Generated: ${generatedAt}
> Phase: P5A — Parallel Manual UI QA Pack (no deploy)

## Critical routes to spot-check

${routeList}

---

## Desktop kontrol

${checkbox("Ana sayfa hero kırılıyor mu?")}
${checkbox("Header/menu çalışıyor mu?")}
${checkbox("Dil değişimi çalışıyor mu?")}
${checkbox("Free tools grid taşma yapıyor mu?")}
${checkbox("Premium tools sayfası yavaş/ağır görünüyor mu?")}
${checkbox("Pricing sayfası ödeme vaadi yanlış mı?")}
${checkbox("Problem slug ödeme butonu gösteriyor mu? (`/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi`)")}
${checkbox("Tool input alanları mobil/desktop uyumlu mu?")}
${checkbox("Result panel boş/taşmış/kırık mı?")}
${checkbox("Trust/Formula Gate badge yanlış gösteriliyor mu?")}

---

## Mobile kontrol (390px)

${checkbox("390px genişlikte yatay taşma var mı?")}
${checkbox("Header hamburger çalışıyor mu?")}
${checkbox("Kartlar üst üste biniyor mu?")}
${checkbox("Form inputları küçük mü? (min 44px touch target)")}
${checkbox("CTA butonları taşma yapıyor mu?")}
${checkbox("Premium/free ayrımı net mi?")}
${checkbox("RTL Arapça sayfada layout bozuluyor mu? (`/ar` veya Arapça locale varsa)")}

---

## Browser kontrol

${checkbox("Console error var mı?")}
${checkbox("Network 404 var mı?")}
${checkbox("Hydration error var mı?")}
${checkbox("Chunk load error var mı?")}
${checkbox("Payment route yanlış tetikleniyor mu?")}
${checkbox("API 500 var mı?")}

---

## Problem slug — özel kontrol

Route: \`/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi\`

${checkbox("Safe review state görünüyor mu?")}
${checkbox("Formula Gate Onaylı badge YOK mu?")}
${checkbox("Aktif Hesapla/Calculate CTA YOK mu?")}
${checkbox("Ödeme/subscribe CTA YOK mu?")}

---

## Free payment — özel kontrol

${checkbox("Free tool sayfalarında subscribe/checkout CTA yok mu?")}
${checkbox("Free tools grid kartlarında payment badge yok mu?")}
${checkbox("Pricing sayfası free tier için yanıltıcı vaat içermiyor mu?")}

---

## Notlar

| Route | Desktop | Mobile | Console | Network | Not |
|-------|---------|--------|---------|---------|-----|
| /tr | | | | | |
| /tr/premium-tools | | | | | |
| problem slug | | | | | |

`;
}

function main() {
  console.log("=== check:p5-manual-ui ===\n");

  const markdown = buildChecklist();
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, markdown, "utf8");

  console.log(`output: ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(`lines: ${markdown.split("\n").length}`);
  console.log("\ncheck:p5-manual-ui PASS");
}

main();
