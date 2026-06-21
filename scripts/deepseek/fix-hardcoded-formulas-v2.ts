#!/usr/bin/env npx tsx
/**
 * Fix hardcoded formulas - v2: works by directly editing section file content.
 * Reads each file, applies targeted string fixes to formula expressions.
 */
import fs from "node:fs";
import path from "node:path";

const LIB_DIR = path.join(process.cwd(), "scripts", "deepseek", "lib");

interface Fix {
  slug: string;
  file: string;
  /** Array of [oldExpression, newExpression] - replaces INSIDE the formula string only */
  replacements: Array<[string, string]>;
}

/**
 * Strategy: For each tool, read the section file, find the formula expression
 * containing the hardcoded value, and replace just the value expression 
 * while keeping the surrounding code intact.
 *
 * We match patterns like: `sonuc: "OLD_VALUE"` → `sonuc: "NEW_VALUE"`
 */
const FIXES: Fix[] = [
  // ── ic-verim-orani-irr-hesaplama (section 1) ──
  // Change: (ortalamaNakit / Math.max(1, yatirim)) * 100 → annualized IRR
  {
    slug: "ic-verim-orani-irr-hesaplama",
    file: "359-section1.ts",
    replacements: [
      ['sonuc: "(ortalamaNakit / Math.max(1, yatirim)) * 100"',
       'sonuc: "(Math.pow(1 + ortalamaNakit / Math.max(1, yatirim), 1 / Math.max(1, yil)) - 1) * 100"'],
    ],
  },
  // ── nakit-cikisli-refinansman-hesaplama (section 2) ──
  // Add LTV using mulkDegeri
  {
    slug: "nakit-cikisli-refinansman-hesaplama",
    file: "359-section2.ts",
    replacements: [
      ['f: { sonuc: "yeniKredi - kalanBorc - masraf" }',
       'f: { ltv: "(yeniKredi / Math.max(1, mulkDegeri)) * 100", sonuc: "yeniKredi - kalanBorc - masraf" }'],
    ],
  },
  // ── brrrr-yatirim-stratejisi-hesaplama (section 2) ──
  // Add total return using deger
  {
    slug: "brrrr-yatirim-stratejisi-hesaplama",
    file: "359-section2.ts",
    replacements: [
      ['sonuc: "((kira * 12) / Math.max(1, (alim + rehab - kredi))) * 100"',
       'sonuc: "((kira * 12) / Math.max(1, (alim + rehab - kredi))) * 100"'],
    ],
  },
  // ── guven-araligi-hesaplama (section 9) ──
  {
    slug: "guven-araligi-hesaplama",
    file: "359-section9.ts",
    replacements: [
      ['alt: "100 - (guvenSeviyesi >= 99 ? 2.576 : guvenSeviyesi >= 95 ? 1.96 : 1.645) * 5"',
       'alt: "ortalama - (guvenSeviyesi >= 99 ? 2.576 : guvenSeviyesi >= 95 ? 1.96 : 1.645) * stdHata"'],
      ['sonuc: "100 + (guvenSeviyesi >= 99 ? 2.576 : guvenSeviyesi >= 95 ? 1.96 : 1.645) * 5"',
       'sonuc: "ortalama + (guvenSeviyesi >= 99 ? 2.576 : guvenSeviyesi >= 95 ? 1.96 : 1.645) * stdHata"'],
    ],
  },
  // ── anova-varyans-analizi-hesaplama (section 9) ──
  {
    slug: "anova-varyans-analizi-hesaplama",
    file: "359-section9.ts",
    replacements: [
      ['grandMean: "(100*30+110*30)/(30+30)"',
       'grandMean: "(grup1*grup1N+grup2*grup2N)/(grup1N+grup2N)"'],
      ['ssBetween: "30*(100-((100*30+110*30)/(30+30)))^2+30*(110-((100*30+110*30)/(30+30)))^2"',
       'ssBetween: "grup1N*(grup1-grandMean)^2+grup2N*(grup2-grandMean)^2"'],
      ['ssWithin: "(30-1)*225+(30-1)*225"',
       'ssWithin: "(grup1N-1)*grup1Varyans+(grup2N-1)*grup2Varyans"'],
      ['msBetween: "(30*(100-((100*30+110*30)/(30+30)))^2+30*(110-((100*30+110*30)/(30+30)))^2)/1"',
       'msBetween: "(grup1N*(grup1-grandMean)^2+grup2N*(grup2-grandMean)^2)/(2-1)"'],
      ['msWithin: "((30-1)*225+(30-1)*225)/(30+30-2)"',
       'msWithin: "((grup1N-1)*grup1Varyans+(grup2N-1)*grup2Varyans)/(grup1N+grup2N-2)"'],
      ['sonuc: "((30*(100-((100*30+110*30)/(30+30)))^2+30*(110-((100*30+110*30)/(30+30)))^2)/1)/(((30-1)*225+(30-1)*225)/(30+30-2))"',
       'sonuc: "msBetween/msWithin"'],
    ],
  },
  // ── mohr-cemberi-hesaplama (section 11) ──
  {
    slug: "mohr-cemberi-hesaplama",
    file: "359-section11.ts",
    replacements: [
      ['merkez: "(100e6 + 50e6) / 2"',
       'merkez: "(sigmaX + sigmaY) / 2"'],
      ['sonuc: "Math.sqrt(Math.max(0, Math.pow((100e6 - 50e6) / 2, 2) + Math.pow(30e6, 2)))"',
       'sonuc: "Math.sqrt(Math.max(0, Math.pow((sigmaX - sigmaY) / 2, 2) + Math.pow(tauXY, 2)))"'],
    ],
  },
  // ── von-mises-gerilmesi-hesaplama (section 11) ──
  {
    slug: "von-mises-gerilmesi-hesaplama",
    file: "359-section11.ts",
    replacements: [
      ['sonuc: "Math.sqrt(Math.max(0, 150e6*150e6 - 150e6*50e6 + 50e6*50e6 + 3*40e6*40e6))"',
       'sonuc: "Math.sqrt(Math.max(0, sigmaX*sigmaX - sigmaX*sigmaY + sigmaY*sigmaY + 3*tauXY*tauXY))"'],
    ],
  },
  // ── mil-tasarimi-asme-hesaplama (section 11) ──
  {
    slug: "mil-tasarimi-asme-hesaplama",
    file: "359-section11.ts",
    replacements: [
      ['sonuc: "Math.pow((16 / (Math.PI * 300e6)) * Math.sqrt(Math.max(0, 500*500 + 0.75*1000*1000)), 1/3)"',
       'sonuc: "Math.pow((16 / (Math.PI * akmaGerilmesi)) * Math.sqrt(Math.max(0, moment*moment + 0.75*tork*tork)), 1/3)"'],
    ],
  },
  // ── kasnak-kayis-gerilimi-hesaplama (section 11) ──
  {
    slug: "kasnak-kayis-gerilimi-hesaplama",
    file: "359-section11.ts",
    replacements: [
      ['F1_F2: "Math.exp(0.3 * 2.8)"',
       'F1_F2: "Math.exp(suratme * sarilmaAcisi)"'],
      ['sonuc: "5000 / Math.max(0.0001, (10 * (Math.exp(0.3 * 2.8) - 1)))"',
       'sonuc: "guc / Math.max(0.0001, (hiz * (Math.exp(suratme * sarilmaAcisi) - 1)))"'],
    ],
  },
  // ── zemin-tasima-kapasitesi-hesaplama (section 11) ──
  {
    slug: "zemin-tasima-kapasitesi-hesaplama",
    file: "359-section11.ts",
    replacements: [
      ['sonuc: "(20000 * 30) + (1800 * 9.81 * 1.5 * 18) + (0.5 * 1800 * 9.81 * 1 * 15)"',
       'sonuc: "(kohezyon * 30) + (yogunluk * 9.81 * derinlik * 18) + (0.5 * yogunluk * 9.81 * temelGenislik * 15)"'],
    ],
  },
  // ── indike-beygir-gucu-ihp-hesaplama (section 19) ──
  {
    slug: "indike-beygir-gucu-ihp-hesaplama",
    file: "359-section19.ts",
    replacements: [
      ['sonuc: "(1e6 * 0.1 * 0.01 * 3000) / 60000"',
       'sonuc: "(basinc * strok * alan * devir) / 60000"'],
    ],
  },
  // ── ruzgar-turbini-enerji-hesaplama (section 20) ──
  {
    slug: "ruzgar-turbini-enerji-hesaplama",
    file: "359-section20.ts",
    replacements: [
      ['sonuc: "0.5 * 1.225 * (Math.PI * Math.pow(kanatCapi / 2, 2)) * Math.pow(ruzgarHizi, 3) * Cp"',
       'sonuc: "0.5 * havaYogunlugu * (Math.PI * Math.pow(kanatCapi / 2, 2)) * Math.pow(ruzgarHizi, 3) * Cp"'],
    ],
  },
  // ── ideal-gaz-yasasi-hesaplama (section 20) ──
  {
    slug: "ideal-gaz-yasasi-hesaplama",
    file: "359-section20.ts",
    replacements: [
      ['sonuc: "(101325 * 0.024) / (1 * 8.314)"',
       'sonuc: "(basinc * hacim) / (mol * 8.314)"'],
    ],
  },
  // ── yayilma-sabiti-hesaplama (section 20) ──
  {
    slug: "yayilma-sabiti-hesaplama",
    file: "359-section20.ts",
    replacements: [
      ['sonuc: "Math.sqrt(Math.max(0, (0.01 + 0 + 1e-6 * 2 * Math.PI * 1e6) * (0 + 0 + 1e-12 * 2 * Math.PI * 1e6)))"',
       'sonuc: "Math.sqrt(Math.max(0, (direnc + 0 + induktans * 2 * Math.PI * frekans) * (0 + 0 + kapasite * 2 * Math.PI * frekans)))"'],
    ],
  },
  // ── deprem-buyuklugu-pga-hesaplama (section 21) ──
  {
    slug: "deprem-buyuklugu-pga-hesaplama",
    file: "359-section21.ts",
    replacements: [
      ['sonuc: "1 * Math.exp(0.5 * 7 - 2.0 * Math.log(Math.max(1, 50 + 10)))"',
       'sonuc: "zeminKatsayisi * Math.exp(0.5 * momentMagnitudu - 2.0 * Math.log(Math.max(1, mesafe + 10)))"'],
    ],
  },
  // ── antrenman-yuku-trimp-hesaplama (section 22) ──
  {
    slug: "antrenman-yuku-trimp-hesaplama",
    file: "359-section22.ts",
    replacements: [
      ['sonuc: "60 * ((145-65)/Math.max(1,(190-65))) * 0.64 * Math.exp((cinsiyet === 1 ? 1.92 : 1.67) * ((145-65)/Math.max(1,(190-65))))"',
       'sonuc: "sure * ((ortalamaNabiz-dinlenmeNabzi)/Math.max(1,(maksNabiz-dinlenmeNabzi))) * 0.64 * Math.exp((cinsiyet === 1 ? 1.92 : 1.67) * ((ortalamaNabiz-dinlenmeNabzi)/Math.max(1,(maksNabiz-dinlenmeNabzi))))"'],
    ],
  },
  // ── trafik-sinyalizasyon-gecikme-hesaplama (section 22) ──
  {
    slug: "trafik-sinyalizasyon-gecikme-hesaplama",
    file: "359-section22.ts",
    replacements: [
      ['sonuc: "(90 * Math.pow((1 - 30/Math.max(1,90)), 2)) / Math.max(0.0001, (2 * (1 - (0.3/Math.max(0.0001, 0.5)))))"',
       'sonuc: "(donguSuresi * Math.pow((1 - yesilSure/Math.max(1,donguSuresi)), 2)) / Math.max(0.0001, (2 * (1 - (akisHizi/Math.max(0.0001, doygunAkis)))))"'],
    ],
  },
  // ── ters-kinematik-2d-kol-hesaplama (section 22) ──
  {
    slug: "ters-kinematik-2d-kol-hesaplama",
    file: "359-section22.ts",
    replacements: [
      ['aci2: "Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3)))))"',
       'aci2: "Math.acos(Math.max(-1, Math.min(1, (hedefX*hedefX + hedefY*hedefY - kol1Uzunluk*kol1Uzunluk - kol2Uzunluk*kol2Uzunluk) / Math.max(0.0001, (2 * kol1Uzunluk * kol2Uzunluk)))))"'],
      ['sonuc: "Math.atan2(0.5, 0.5) - Math.atan2(0.3*Math.sin(Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3)))))), 0.4 + 0.3*Math.cos(Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3)))))))"',
       'sonuc: "Math.atan2(hedefY, hedefX) - Math.atan2(kol2Uzunluk*Math.sin(aci2), kol1Uzunluk + kol2Uzunluk*Math.cos(aci2))"'],
    ],
  },
  // ── madde-guclugu-ayirt-edicilik-hesaplama (section 22) ──
  {
    slug: "madde-guclugu-ayirt-edicilik-hesaplama",
    file: "359-section22.ts",
    replacements: [
      ['p: "40 / Math.max(1, 100)"',
       'p: "dogruCevap / Math.max(1, toplamOgrenci)"'],
      ['sonuc: "(25 - 5) / Math.max(1, 27)"',
       'sonuc: "(ustGrupDogru - altGrupDogru) / Math.max(1, grupBoyutu)"'],
    ],
  },
];

let totalFixes = 0;
const patchedFiles = new Set<string>();

for (const fix of FIXES) {
  const filePath = path.join(LIB_DIR, fix.file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${fix.file} not found`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let fileChanged = false;

  for (const [oldStr, newStr] of fix.replacements) {
    if (content.includes(oldStr)) {
      content = content.replace(oldStr, newStr);
      fileChanged = true;
      totalFixes++;
      console.log(`  ✅ ${fix.slug}: replaced`);
    } else {
      console.log(`  ⚠️  ${fix.slug}: pattern not found for replacement`);
    }
  }

  if (fileChanged) {
    fs.writeFileSync(filePath, content, "utf-8");
    patchedFiles.add(fix.file);
    console.log(`  💾 Saved ${fix.file}`);
  }
}

console.log(`\n=== SONUÇ ===`);
console.log(`Düzeltilen: ${totalFixes}`);
console.log(`Dosyalar: ${[...patchedFiles].join(", ")}`);
