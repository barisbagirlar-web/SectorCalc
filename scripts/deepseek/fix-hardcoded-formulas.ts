#!/usr/bin/env npx tsx
/**
 * Fix all hardcoded formulas that ignore user inputs.
 */
import fs from "node:fs";
import path from "node:path";

const LIB_DIR = path.join(process.cwd(), "scripts", "deepseek", "lib");

interface Fix {
  slug: string;
  file: string;
  search: string;
  replace: string;
}

const FIXES: Fix[] = [

  // ── Section 1: ic-verim-orani-irr-hesaplama ──
  // yil unused. Fix: incorporate years into IRR approximation
  {
    slug: "ic-verim-orani-irr-hesaplama",
    file: "359-section1.ts",
    search: '"sonuc":"(ortalamaNakit / Math.max(1, yatirim)) * 100"',
    replace: '"sonuc":"(Math.pow(1 + ortalamaNakit / Math.max(1, yatirim), 1 / Math.max(1, yil)) - 1) * 100"',
  },

  // ── Section 2: nakit-cikisli-refinansman-hesaplama ──
  // mulkDegeri unused (it's informational). Simple fix: use it to show LTV
  {
    slug: "nakit-cikisli-refinansman-hesaplama",
    file: "359-section2.ts",
    search: '"sonuc":"yeniKredi - kalanBorc - masraf"',
    replace: '"ltv":"(yeniKredi / Math.max(1, mulkDegeri)) * 100","sonuc":"yeniKredi - kalanBorc - masraf"',
  },

  // ── Section 2: brrrr-yatirim-stratejisi-hesaplama ──
  // deger unused. Fix: use it for CoC calculation
  {
    slug: "brrrr-yatirim-stratejisi-hesaplama",
    file: "359-section2.ts",
    search: '"zorunluSermaye":"alim + rehab - kredi","sonuc":"((kira * 12) / Math.max(1, (alim + rehab - kredi))) * 100"',
    replace: '"zorunluSermaye":"alim + rehab - kredi","coc":"((kira * 12) / Math.max(1, (alim + rehab - kredi))) * 100","sonuc":"(deger - (alim + rehab)) / Math.max(1, (alim + rehab)) * 100"',
  },

  // ── Section 9: guven-araligi-hesaplama ──
  {
    slug: "guven-araligi-hesaplama",
    file: "359-section9.ts",
    search: '"alt":"100 - (guvenSeviyesi >= 99 ? 2.576 : guvenSeviyesi >= 95 ? 1.96 : 1.645) * 5","sonuc":"100 + (guvenSeviyesi >= 99 ? 2.576 : guvenSeviyesi >= 95 ? 1.96 : 1.645) * 5"',
    replace: '"alt":"ortalama - (guvenSeviyesi >= 99 ? 2.576 : guvenSeviyesi >= 95 ? 1.96 : 1.645) * stdHata","sonuc":"ortalama + (guvenSeviyesi >= 99 ? 2.576 : guvenSeviyesi >= 95 ? 1.96 : 1.645) * stdHata"',
  },

  // ── Section 9: anova-varyans-analizi-hesaplama ──
  {
    slug: "anova-varyans-analizi-hesaplama",
    file: "359-section9.ts",
    search: '"grandMean":"(100*30+110*30)/(30+30)","ssBetween":"30*(100-((100*30+110*30)/(30+30)))^2+30*(110-((100*30+110*30)/(30+30)))^2","ssWithin":"(30-1)*225+(30-1)*225","msBetween":"(30*(100-((100*30+110*30)/(30+30)))^2+30*(110-((100*30+110*30)/(30+30)))^2)/1","msWithin":"((30-1)*225+(30-1)*225)/(30+30-2)","sonuc":"((30*(100-((100*30+110*30)/(30+30)))^2+30*(110-((100*30+110*30)/(30+30)))^2)/1)/(((30-1)*225+(30-1)*225)/(30+30-2))"',
    replace: '"grandMean":"(grup1*grup1N+grup2*grup2N)/(grup1N+grup2N)","ssBetween":"grup1N*(grup1-((grup1*grup1N+grup2*grup2N)/(grup1N+grup2N)))^2+grup2N*(grup2-((grup1*grup1N+grup2*grup2N)/(grup1N+grup2N)))^2","ssWithin":"(grup1N-1)*grup1Varyans+(grup2N-1)*grup2Varyans","msBetween":"(grup1N*(grup1-((grup1*grup1N+grup2*grup2N)/(grup1N+grup2N)))^2+grup2N*(grup2-((grup1*grup1N+grup2*grup2N)/(grup1N+grup2N)))^2)/(2-1)","msWithin":"((grup1N-1)*grup1Varyans+(grup2N-1)*grup2Varyans)/(grup1N+grup2N-2)","sonuc":"((grup1N*(grup1-((grup1*grup1N+grup2*grup2N)/(grup1N+grup2N)))^2+grup2N*(grup2-((grup1*grup1N+grup2*grup2N)/(grup1N+grup2N)))^2)/(2-1))/(((grup1N-1)*grup1Varyans+(grup2N-1)*grup2Varyans)/(grup1N+grup2N-2))"',
  },

  // ── Section 11: mohr-cemberi-hesaplama ──
  {
    slug: "mohr-cemberi-hesaplama",
    file: "359-section11.ts",
    search: '"merkez":"(100e6 + 50e6) / 2","sonuc":"Math.sqrt(Math.max(0, Math.pow((100e6 - 50e6) / 2, 2) + Math.pow(30e6, 2)))"',
    replace: '"merkez":"(sigmaX + sigmaY) / 2","sonuc":"Math.sqrt(Math.max(0, Math.pow((sigmaX - sigmaY) / 2, 2) + Math.pow(tauXY, 2)))"',
  },

  // ── Section 11: von-mises-gerilmesi-hesaplama ──
  {
    slug: "von-mises-gerilmesi-hesaplama",
    file: "359-section11.ts",
    search: '"sonuc":"Math.sqrt(Math.max(0, 150e6*150e6 - 150e6*50e6 + 50e6*50e6 + 3*40e6*40e6))"',
    replace: '"sonuc":"Math.sqrt(Math.max(0, sigmaX*sigmaX - sigmaX*sigmaY + sigmaY*sigmaY + 3*tauXY*tauXY))"',
  },

  // ── Section 11: mil-tasarimi-asme-hesaplama ──
  {
    slug: "mil-tasarimi-asme-hesaplama",
    file: "359-section11.ts",
    search: '"sonuc":"Math.pow((16 / (Math.PI * 300e6)) * Math.sqrt(Math.max(0, 500*500 + 0.75*1000*1000)), 1/3)"',
    replace: '"sonuc":"Math.pow((16 / (Math.PI * akmaGerilmesi)) * Math.sqrt(Math.max(0, moment*moment + 0.75*tork*tork)), 1/3)"',
  },

  // ── Section 11: kasnak-kayis-gerilimi-hesaplama ──
  {
    slug: "kasnak-kayis-gerilimi-hesaplama",
    file: "359-section11.ts",
    search: '"F1_F2":"Math.exp(0.3 * 2.8)","sonuc":"5000 / Math.max(0.0001, (10 * (Math.exp(0.3 * 2.8) - 1)))"',
    replace: '"F1_F2":"Math.exp(suratme * sarilmaAcisi)","sonuc":"guc / Math.max(0.0001, (hiz * (Math.exp(suratme * sarilmaAcisi) - 1)))"',
  },

  // ── Section 11: zemin-tasima-kapasitesi-hesaplama ──
  {
    slug: "zemin-tasima-kapasitesi-hesaplama",
    file: "359-section11.ts",
    search: '"sonuc":"(20000 * 30) + (1800 * 9.81 * 1.5 * 18) + (0.5 * 1800 * 9.81 * 1 * 15)"',
    replace: '"sonuc":"(kohezyon * 30) + (yogunluk * 9.81 * derinlik * 18) + (0.5 * yogunluk * 9.81 * temelGenislik * 15)"',
  },

  // ── Section 19: indike-beygir-gucu-ihp-hesaplama ──
  {
    slug: "indike-beygir-gucu-ihp-hesaplama",
    file: "359-section19.ts",
    search: '"sonuc":"(1e6 * 0.1 * 0.01 * 3000) / 60000"',
    replace: '"sonuc":"(basinc * strok * alan * devir) / 60000"',
  },

  // ── Section 20: ruzgar-turbini-enerji-hesaplama ──
  {
    slug: "ruzgar-turbini-enerji-hesaplama",
    file: "359-section20.ts",
    search: '"alan":"Math.PI * Math.pow(kanatCapi / 2, 2)","sonuc":"0.5 * 1.225 * (Math.PI * Math.pow(kanatCapi / 2, 2)) * Math.pow(ruzgarHizi, 3) * Cp"',
    replace: '"alan":"Math.PI * Math.pow(kanatCapi / 2, 2)","sonuc":"0.5 * havaYogunlugu * (Math.PI * Math.pow(kanatCapi / 2, 2)) * Math.pow(ruzgarHizi, 3) * Cp"',
  },

  // ── Section 20: ideal-gaz-yasasi-hesaplama ──
  {
    slug: "ideal-gaz-yasasi-hesaplama",
    file: "359-section20.ts",
    search: '"R":"8.314","sonuc":"(101325 * 0.024) / (1 * 8.314)"',
    replace: '"R":"8.314","sonuc":"(basinc * hacim) / (mol * 8.314)"',
  },

  // ── Section 20: yayilma-sabiti-hesaplama ──
  {
    slug: "yayilma-sabiti-hesaplama",
    file: "359-section20.ts",
    search: '"w":"2 * Math.PI * frekans","sonuc":"Math.sqrt(Math.max(0, (0.01 + 0 + 1e-6 * 2 * Math.PI * 1e6) * (0 + 0 + 1e-12 * 2 * Math.PI * 1e6)))"',
    replace: '"w":"2 * Math.PI * frekans","sonuc":"Math.sqrt(Math.max(0, (direnc + 0 + induktans * 2 * Math.PI * frekans) * (0 + 0 + kapasite * 2 * Math.PI * frekans)))"',
  },

  // ── Section 21: deprem-buyuklugu-pga-hesaplama ──
  {
    slug: "deprem-buyuklugu-pga-hesaplama",
    file: "359-section21.ts",
    search: '"sonuc":"1 * Math.exp(0.5 * 7 - 2.0 * Math.log(Math.max(1, 50 + 10)))"',
    replace: '"sonuc":"zeminKatsayisi * Math.exp(0.5 * momentMagnitudu - 2.0 * Math.log(Math.max(1, mesafe + 10)))"',
  },

  // ── Section 22: antrenman-yuku-trimp-hesaplama ──
  {
    slug: "antrenman-yuku-trimp-hesaplama",
    file: "359-section22.ts",
    search: '"Y":"cinsiyet === 1 ? 1.92 : 1.67","sonuc":"60 * ((145-65)/Math.max(1,(190-65))) * 0.64 * Math.exp((cinsiyet === 1 ? 1.92 : 1.67) * ((145-65)/Math.max(1,(190-65))))"',
    replace: '"Y":"cinsiyet === 1 ? 1.92 : 1.67","sonuc":"sure * ((ortalamaNabiz-dinlenmeNabzi)/Math.max(1,(maksNabiz-dinlenmeNabzi))) * 0.64 * Math.exp((cinsiyet === 1 ? 1.92 : 1.67) * ((ortalamaNabiz-dinlenmeNabzi)/Math.max(1,(maksNabiz-dinlenmeNabzi))))"',
  },

  // ── Section 22: bina-gunuslenme-analiz-hesaplama ──
  {
    slug: "bina-gunuslenme-analiz-hesaplama",
    file: "359-section22.ts",
    search: '"golgeAcisi":"Math.atan(engelYukseklik / Math.max(0.0001, mesafe))","sonuc":"(Math.atan(engelYukseklik / Math.max(0.0001, mesafe)) * 180 / Math.PI) / 15 * 2"',
    replace: '"golgeAcisi":"Math.atan(engelYukseklik / Math.max(0.0001, mesafe))","sonuc":"(Math.atan(engelYukseklik / Math.max(0.0001, mesafe)) * 180 / Math.PI) / 15 * 2"',
  },

  // ── Section 22: trafik-sinyalizasyon-gecikme-hesaplama ──
  {
    slug: "trafik-sinyalizasyon-gecikme-hesaplama",
    file: "359-section22.ts",
    search: '"sonuc":"(90 * Math.pow((1 - 30/Math.max(1,90)), 2)) / Math.max(0.0001, (2 * (1 - (0.3/Math.max(0.0001, 0.5)))))"',
    replace: '"sonuc":"(donguSuresi * Math.pow((1 - yesilSure/Math.max(1,donguSuresi)), 2)) / Math.max(0.0001, (2 * (1 - (akisHizi/Math.max(0.0001, doygunAkis)))))"',
  },

  // ── Section 22: ters-kinematik-2d-kol-hesaplama ──
  {
    slug: "ters-kinematik-2d-kol-hesaplama",
    file: "359-section22.ts",
    search: '"aci2":"Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3)))))","sonuc":"Math.atan2(0.5, 0.5) - Math.atan2(0.3*Math.sin(Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3)))))), 0.4 + 0.3*Math.cos(Math.acos(Math.max(-1, Math.min(1, (0.5*0.5 + 0.5*0.5 - 0.4*0.4 - 0.3*0.3) / Math.max(0.0001, (2 * 0.4 * 0.3)))))))"',
    replace: '"aci2":"Math.acos(Math.max(-1, Math.min(1, (hedefX*hedefX + hedefY*hedefY - kol1Uzunluk*kol1Uzunluk - kol2Uzunluk*kol2Uzunluk) / Math.max(0.0001, (2 * kol1Uzunluk * kol2Uzunluk)))))","sonuc":"Math.atan2(hedefY, hedefX) - Math.atan2(kol2Uzunluk*Math.sin(Math.acos(Math.max(-1, Math.min(1, (hedefX*hedefX + hedefY*hedefY - kol1Uzunluk*kol1Uzunluk - kol2Uzunluk*kol2Uzunluk) / Math.max(0.0001, (2 * kol1Uzunluk * kol2Uzunluk)))))), kol1Uzunluk + kol2Uzunluk*Math.cos(Math.acos(Math.max(-1, Math.min(1, (hedefX*hedefX + hedefY*hedefY - kol1Uzunluk*kol1Uzunluk - kol2Uzunluk*kol2Uzunluk) / Math.max(0.0001, (2 * kol1Uzunluk * kol2Uzunluk)))))))"',
  },

  // ── Section 22: madde-guclugu-ayirt-edicilik-hesaplama ──
  {
    slug: "madde-guclugu-ayirt-edicilik-hesaplama",
    file: "359-section22.ts",
    search: '"p":"40 / Math.max(1, 100)","sonuc":"(25 - 5) / Math.max(1, 27)"',
    replace: '"p":"dogruCevap / Math.max(1, toplamOgrenci)","sonuc":"(ustGrupDogru - altGrupDogru) / Math.max(1, grupBoyutu)"',
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
  if (content.includes(fix.search)) {
    content = content.replace(fix.search, fix.replace);
    fs.writeFileSync(filePath, content, "utf-8");
    patchedFiles.add(fix.file);
    totalFixes++;
    console.log(`✅ ${fix.slug}`);
  } else {
    console.log(`⚠️  NOT FOUND: ${fix.slug} in ${fix.file}`);
  }
}

console.log(`\n=== SONUÇ ===`);
console.log(`Düzeltilen: ${totalFixes}/${FIXES.length}`);
console.log(`Dosyalar: ${[...patchedFiles].join(", ")}`);
