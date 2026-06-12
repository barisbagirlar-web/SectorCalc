#!/usr/bin/env node
/** Clean homeAbout + aboutPage copy — fixes partial glossary corruption on AR. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const PATCH = {
  ar: {
    homeAbout: {
      title: "من نحن",
      paragraph1:
        "غالباً ما يتسرب الربح من الشركات عبر تكاليف غير ملحوظة وليس عبر المبيعات. التسعير الخاطئ وأخطاء الحساب والهدر وفقدان الكفاءة وضعف انضباط العروض يآكل الهامش بصمت مع الوقت.",
      paragraph2:
        "صُمم SectorCalc لجعل هذه الخسائر غير المرئية قابلة للقياس. يرفع قرارات التكلفة والعروض والكفاءة والمخاطر إلى أساس أسرع وأكثر شفافية وموثوقية.",
      beliefTitle: "إيماننا الأساسي",
      beliefSubtitle: "الدقة في الحساب هي أساس الأداء الموثوق.",
      highlightPrimary: "منصة لكشف الخسائر المخفية،",
      highlightSecondary: "وتحويل الحساب إلى دعم قرار موثوق.",
      cta: "تعرّف على SectorCalc عن قرب",
      ctaAria: "اقرأ صفحة من نحن في SectorCalc",
    },
    aboutPage: {
      seoTitle: "حول SectorCalc | الحساب الصناعي ودعم القرار",
      seoDescription:
        "يساعد SectorCalc الشركات على كشف الخسائر المخفية وقياس المخاطر التشغيلية وتحويل الحسابات الصناعية إلى دعم قرار موثوق.",
      hero: {
        eyebrow: "حول SectorCalc",
        title: "نحوّل الحساب إلى قرارات يمكن الوثوق بها.",
        lead: "SectorCalc منصة عالمية للحساب الصناعي ودعم القرار تساعد الشركات على كشف الخسائر المخفية والتصرف بثقة.",
      },
      why: {
        title: "لماذا وُجد SectorCalc",
        body: "معظم الخسائر التشغيلية لا تظهر على الفاتورة. تختبئ في التسعير والهدر وزمن الإعداد وانخفاض الكفاءة وضعف انضباط العروض، وتآكل الهوامش بهدوء لسنوات.",
      },
      what: {
        title: "ما هو SectorCalc",
        body: "مجموعة مركزة من الحاسبات القطاعية وتقارير القرار تحوّل المدخلات التشغيلية الخام إلى أرقام واضحة قابلة للدفاع — ليست جدولاً إضافياً ولا ERP ثقيلاً.",
      },
      problem: {
        title: "المشكلة التي نحلها",
        body: "تتخذ الفرق قرارات التكلفة والعروض والمخاطر بمعلومات ناقصة. يجعل SectorCalc غير المرئي قابلاً للقياس حتى تستند القرارات إلى أدلة لا إلى التخمين.",
      },
      how: {
        title: "كيف يعمل نظامنا",
        body: "تقدّم المدخلات التي تعرفها؛ يحدد النظام ما هو مطلوب ويشغّل حسابات حتمية خاضعة للحوكمة ويتحقق من كل نتيجة مقابل الثوابت والمعايير قبل عرضها.",
      },
      different: {
        title: "ما يميزنا",
        body: "كل نتيجة تحمل ملخص حساب شفافاً ومعايير إقليمية استرشادية وافتراضات موثقة يمكن لفريقك مراجعتها قبل اتخاذ القرار.",
      },
      who: {
        title: "لمن صُمم",
        body: "أصحاب الأعمال والمقدّرون وفرق الميدان والاستشاريون الذين يحتاجون إجابات سريعة وموثوقة دون فريق تسعير كامل أو برنامج مؤسسي معقد.",
      },
      building: {
        title: "ما نبنيه",
        body: "معيار عالمي لذكاء الحساب القطاعي يتوسع عبر الصناعات مع إبقاء كل صيغة خاضعة للحوكمة والتدقيق والثقة.",
      },
      manifesto: {
        primary: "منصة لكشف الخسائر المخفية،",
        secondary: "وتحويل الحساب إلى دعم قرار موثوق.",
      },
    },
  },
  de: {
    aboutPage: {
      how: {
        body: "Sie liefern die Eingaben, die Sie kennen; das System ermittelt, was erforderlich ist, führt deterministische Berechnungen unter Governance aus und validiert jedes Ergebnis anhand von Invarianten und Benchmarks, bevor es angezeigt wird.",
      },
    },
    region: { global: "Global · USD" },
    pilotCnc: { phase2: { label: "MarginCore · Phase 2" } },
    homeDashboard: { grid: { sectorCount: "{count} Module" } },
  },
  fr: {
    aboutPage: {
      how: {
        body: "Vous fournissez les entrées que vous connaissez ; le système détermine ce qui est requis, exécute des calculs déterministes gouvernés et valide chaque résultat par rapport aux invariants et aux repères avant affichage.",
      },
    },
    region: { global: "Global · USD" },
    pilotCnc: { phase2: { label: "MarginCore · Phase 2" } },
    homeDashboard: { grid: { sectorCount: "{count} modules métier" } },
  },
  es: {
    aboutPage: {
      how: {
        body: "Usted aporta las entradas que conoce; el sistema resuelve lo requerido, ejecuta cálculos deterministas gobernados y valida cada resultado frente a invariantes y referencias antes de mostrarlo.",
      },
    },
    region: { global: "Global · USD" },
  },
};

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] = deepMerge(target[key] ?? {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

for (const [locale, block] of Object.entries(PATCH)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  deepMerge(messages, block);
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Patched homeAbout/aboutPage → messages/${locale}.json`);
}
