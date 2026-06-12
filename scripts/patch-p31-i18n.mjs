#!/usr/bin/env node
/**
 * P31 — patch decision engine / disclaimer / standards / feedback i18n keys.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const PATCH = {
  en: {
    disclaimer: {
      standard: {
        title: "Usage agreement",
        body: "This calculation provides a preliminary assessment based on your inputs and deterministic methodology. Results do not replace quotes, investment, engineering, tax, legal, or safety decisions. For critical decisions, verify with your own data, qualified experts, and applicable regulations.",
      },
      elevated: {
        title: "Important usage notice",
        body: "This tool models commercial or compliance-sensitive exposure. Outputs are indicative only and must be validated against your contracts, payroll records, and local rules before action.",
      },
      engineering: {
        title: "Engineering reference notice",
        body: "This tool provides standard-referenced pre-calculation only. Final design, safety, and conformity decisions require authorized engineering review.",
      },
    },
    standards: {
      selectorTitle: "Engineering standard context",
      selectorLabel: "Reference standard system",
      selectorNote: "Default follows region; you may switch reference systems for comparison.",
      engineeringWarning:
        "This tool provides standard-referenced pre-calculation only. Final design, safety, and conformity decisions require authorized engineering review.",
      systems: {
        AWS: "AWS",
        ISO_EN: "ISO / EN",
        JIS: "JIS",
        UNC_UNF: "UNC / UNF",
        ISO_METRIC: "ISO metric",
        ASME_BPVC: "ASME BPVC",
        PED_EN_13445: "PED / EN 13445",
        ASTM_AISI: "ASTM / AISI",
        EN_DIN: "EN / DIN",
        ASME_Y14_5: "ASME Y14.5",
        ISO_GPS: "ISO GPS",
        AISC: "AISC",
        EUROCODE: "Eurocode",
      },
    },
    calculationFeedback: {
      prompt: "See an error in this result?",
      cta: "Send a suggestion or correction",
      modalTitle: "Calculation feedback",
      close: "Close",
      issueTypeLabel: "Issue type",
      messageLabel: "Description",
      emailLabel: "Email (optional)",
      submit: "Send feedback",
      submitting: "Sending…",
      success: "Thank you — your note was queued for review.",
      issueTypes: {
        "wrong-result": "Incorrect result",
        "formula-suggestion": "Formula suggestion",
        "unit-error": "Unit error",
        "translation-error": "Translation error",
        other: "Other",
      },
      error: { submitFailed: "Could not send feedback. Try again shortly." },
    },
    resultLayers: {
      quickTab: "Quick result",
      deepTab: "Detailed trace",
      deepTitle: "Detailed explanation",
    },
    developerShowcase: {
      meta: {
        title: "Developer showcase | SectorCalc",
        description: "Semantic reference for AI-readable SectorCalc calculator discovery.",
      },
      eyebrow: "Semantic reference",
      title: "SectorCalc developer showcase",
      intro:
        "This page explains how SectorCalc tools expose structured inputs, outputs, and JSON-LD for AI agents. It is a public reference — not a private API endpoint.",
      semantic: {
        title: "JSON-LD structure",
        body: "Calculator routes expose schema.org actions and software application metadata.",
        item1: "WebSite + Organization on core pages",
        item2: "CalculateAction on calculator detail routes",
        item3: "Premium analyzers include decision-report metadata where applicable",
      },
      resources: {
        title: "Public resources",
        library: "Calculator library",
        note: "No secrets, admin routes, or entitlement bypass are exposed here.",
      },
    },
  },
  tr: {
    disclaimer: {
      standard: {
        title: "Kullanım bildirimi",
        body: "Bu hesaplama, girilen verilere ve deterministik hesaplama metodolojisine göre ön değerlendirme sağlar. Sonuçlar; teklif, yatırım, mühendislik, vergi, hukuk veya güvenlik kararı yerine geçmez. Kritik kararlarda kendi verileriniz, yetkili uzman kontrolü ve geçerli mevzuat/standartlar esas alınmalıdır.",
      },
      elevated: {
        title: "Önemli kullanım uyarısı",
        body: "Bu araç ticari veya uyumluluk hassasiyeti taşıyan bir exposure modeli sunar. Çıktılar yalnızca göstergedir; aksiyon öncesi sözleşme, bordro ve yerel kurallarla doğrulanmalıdır.",
      },
      engineering: {
        title: "Mühendislik referans bildirimi",
        body: "Bu araç standard referanslı ön hesaplama sağlar. Nihai tasarım, güvenlik ve uygunluk kararı yetkili mühendislik kontrolü gerektirir.",
      },
    },
    standards: {
      selectorTitle: "Mühendislik standard bağlamı",
      selectorLabel: "Referans standard sistemi",
      selectorNote: "Varsayılan bölgeye göre gelir; karşılaştırma için değiştirebilirsiniz.",
      engineeringWarning:
        "Bu araç standard referanslı ön hesaplama sağlar. Nihai tasarım, güvenlik ve uygunluk kararı yetkili mühendislik kontrolü gerektirir.",
      systems: {
        AWS: "AWS",
        ISO_EN: "ISO / EN",
        JIS: "JIS",
        UNC_UNF: "UNC / UNF",
        ISO_METRIC: "ISO metrik",
        ASME_BPVC: "ASME BPVC",
        PED_EN_13445: "PED / EN 13445",
        ASTM_AISI: "ASTM / AISI",
        EN_DIN: "EN / DIN",
        ASME_Y14_5: "ASME Y14.5",
        ISO_GPS: "ISO GPS",
        AISC: "AISC",
        EUROCODE: "Eurocode",
      },
    },
    calculationFeedback: {
      prompt: "Bu sonuçta hata mı gördünüz?",
      cta: "Öneri veya düzeltme gönder",
      modalTitle: "Hesaplama geri bildirimi",
      close: "Kapat",
      issueTypeLabel: "Konu tipi",
      messageLabel: "Açıklama",
      emailLabel: "E-posta (opsiyonel)",
      submit: "Geri bildirim gönder",
      submitting: "Gönderiliyor…",
      success: "Teşekkürler — notunuz inceleme kuyruğuna alındı.",
      issueTypes: {
        "wrong-result": "Sonuç hatalı",
        "formula-suggestion": "Formül önerisi",
        "unit-error": "Birim hatası",
        "translation-error": "Çeviri hatası",
        other: "Diğer",
      },
      error: { submitFailed: "Geri bildirim gönderilemedi. Kısa süre sonra tekrar deneyin." },
    },
    resultLayers: {
      quickTab: "Hızlı sonuç",
      deepTab: "Detaylı iz",
      deepTitle: "Detaylı açıklama",
    },
    developerShowcase: {
      meta: {
        title: "Geliştirici vitrin | SectorCalc",
        description: "AI ajanları için SectorCalc hesaplayıcı keşfi semantic referansı.",
      },
      eyebrow: "Semantic referans",
      title: "SectorCalc geliştirici vitrini",
      intro:
        "Bu sayfa SectorCalc araçlarının yapılandırılmış girdi/çıktı ve JSON-LD yapısını açıklar. Public referanstır — gizli API değildir.",
      semantic: {
        title: "JSON-LD yapısı",
        body: "Hesaplayıcı rotaları schema.org action ve uygulama metadata'sı sunar.",
        item1: "Çekirdek sayfalarda WebSite + Organization",
        item2: "Hesaplayıcı detay rotalarında CalculateAction",
        item3: "Premium analizlerde uygun olduğunda karar raporu metadata'sı",
      },
      resources: {
        title: "Public kaynaklar",
        library: "Hesaplayıcı kütüphanesi",
        note: "Secret, admin rotası veya entitlement bypass burada yoktur.",
      },
    },
  },
};

function deepMerge(base, patch) {
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = deepMerge(base[key] ?? {}, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

for (const locale of LOCALES) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  const patch = PATCH[locale] ?? PATCH.en;
  const merged = deepMerge(messages, patch);
  writeFileSync(path, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log(`patched messages/${locale}.json`);
}

console.log("P31 i18n patch complete");
