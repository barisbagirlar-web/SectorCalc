#!/usr/bin/env node
/**
 * SectorCalc — English-Only Lexicon Guard (root-source enforcement)
 */
import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";

const TR_LEXICON = new Set([
  "denetim","skor","skoru","verim","verimlilik","kayip","kaybi","maliyet","hesaplama","hesaplayici",
  "israf","avci","avcisi","parasal","karsilik","oran","orani","kar","zarar","gelir","gider","fiyat",
  "tutar","vergi","faiz","kredi","taksit","butce","nakit","borc","alacak","stok","uretim","isci",
  "iscilik","makine","enerji","sure","suresi","hiz","agirlik","hacim","yogunluk","basinc","sicaklik",
  "gerilim","mukavemet","tork","civata","somun","kesme","delme","kalinlik","cap","uzunluk","genislik",
  "yukseklik","alan","cevrim","durus","kesinti","bakim","ariza","adet","toplam","birim","katsayi",
  "katsayisi","yatirim","getiri","geri","odeme","kazanc","kazanilan","musteri","siparis","teslim",
  "kalite","hata","fire","devir","kapasite","dolum","seviye","agirligi","hizi",
  "baski","destek","yapisi","ve","post","proses","parti","optimizasyonu","yuvalama","talasli","imalat","basabas","noktasi"
]);

const ALLOWLIST = new Set([
  "muda","kaizen","kanban","poka","yoke","gemba","heijunka","jidoka","andon","takt","hansei",
  "oee","fmea","iso","asme","gum","roi","ebitda","cnc","5s","kpi","smed","tpm","rpn","mtbf","mttr",
  "fire", "cap", "post"
]);

const foldTr = (s) => s.toLowerCase()
  .replace(/ş/g,"s").replace(/ç/g,"c").replace(/ğ/g,"g")
  .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ü/g,"u");

function offendingTokens(slug) {
  const bad = [];
  for (const raw of slug.split("-")) {
    if (!raw || /^\d+$/.test(raw) || /^\d+[a-z]+$/.test(raw)) continue;
    if (ALLOWLIST.has(raw.toLowerCase())) continue;
    if (/[şçğıİöüŞÇĞÖÜ]/.test(raw)) { bad.push(`${raw} (turkish char)`); continue; }
    const f = foldTr(raw);
    if (TR_LEXICON.has(f)) bad.push(`${raw} (turkish word)`);
  }
  return bad;
}

const files = [
  ...globSync(path.join(process.cwd(), "generated/schemas/**/*.json")),
  ...globSync(path.join(process.cwd(), "src/**/tool-schemas/**/*.json")),
  ...globSync(path.join(process.cwd(), "src/lib/features/premium-schema/schemas/**/*.ts")),
];

let allSlugs = new Set();

for (const file of files) {
  let slug = "";
  if (file.endsWith(".json")) {
    try { 
      const data = JSON.parse(fs.readFileSync(file, "utf8")); 
      slug = data.slug || data.id || path.basename(file).replace(/(-schema)?\.json$/, "");
    } catch { continue; }
  } else if (file.endsWith(".ts")) {
    slug = path.basename(file).replace(/\.ts$/, "");
  }
  if (slug) allSlugs.add(slug);
}

// Add slugs from registries
try {
  const premium = JSON.parse(fs.readFileSync(path.join(process.cwd(), "premium-slugs.json"), "utf8"));
  premium.forEach(s => allSlugs.add(s));
} catch(e) {}
try {
  const free = JSON.parse(fs.readFileSync(path.join(process.cwd(), "free-slugs.json"), "utf8"));
  free.forEach(s => allSlugs.add(s));
} catch(e) {}


const violations = [];
for (const slug of allSlugs) {
  const bad = offendingTokens(String(slug));
  if (bad.length) violations.push({ slug, bad });
}

console.log(`\n=== English-Only Lexicon Guard ===`);
console.log(`Taranan: ${allSlugs.size} benzersiz slug | İhlal: ${violations.length} slug\n`);
for (const v of violations) console.log(`✗ ${v.slug}\n    ${v.bad.join(", ")}`);

if (violations.length) {
  console.error(`\n❌ ${violations.length} Türkçe slug. English-only ihlali. Build durduruldu.`);
  process.exit(1);
}
console.log("✅ Tüm slug'lar English-only.");
