#!/usr/bin/env node
/** Applies homepage positioning i18n + spec overrides to all 6 locale message files. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const PATCH = JSON.parse(
  readFileSync(join(import.meta.dirname, "data/homepage-positioning-i18n.json"), "utf8")
);

const META_OVERRIDES = {
  // tr locale removed — Turkish content has been cleaned
  en: {
    title: "SectorCalc | Industry, Manufacturing and Business Calculators",
    description:
      "SectorCalc offers free and premium industry calculators for manufacturing, workshops, engineering, business costs, waste, margin, energy, inventory, routing, labor and operational losses.",
  },
  de: {
    title: "SectorCalc | Branchen-, Produktions- und Unternehmensrechner",
    description:
      "SectorCalc bietet kostenlose und Premium-Branchenrechner für Produktion, Werkstätten, Technik, Geschäftskosten, Ausschuss, Marge, Energie, Lager, Routen, Personal und operative Verluste.",
  },
  fr: {
    title: "SectorCalc | Calculateurs sectoriels pour industrie, production et entreprises",
    description:
      "SectorCalc propose des calculateurs sectoriels gratuits et premium pour la production, les ateliers, l'ingénierie, les coûts, le rebut, la marge, l'énergie, les stocks, les routes, la main-d'œuvre et les pertes opérationnelles.",
  },
  es: {
    title: "SectorCalc | Calculadoras sectoriales para industria, producción y empresas",
    description:
      "SectorCalc ofrece calculadoras sectoriales gratuitas y premium para fabricación, talleres, ingeniería, costes, merma, margen, energía, inventario, rutas, mano de obra y pérdidas operativas.",
  },
  ar: {
    title: "SectorCalc | حاسبات قطاعية للصناعة والإنتاج والأعمال",
    description:
      "SectorCalc يقدّم حاسبات قطاعية مجانية ومميزة للتصنيع والورش والهندسة وتكاليف الأعمال والهدر والهامش والطاقة والمخزون والمسارات والعمالة والخسائر التشغيلية.",
  },
};

const HERO_OVERRIDES = {
  // tr locale removed — Turkish content has been cleaned
  en: {
    highlight: "INDUSTRY CALCULATOR PLATFORM",
    headline: "See critical business, manufacturing and technical calculations in one place",
    subtitle:
      "SectorCalc provides free and premium industry calculators for manufacturing, workshops, engineering, construction, logistics, energy, finance and operations. It helps make cost, waste, margin, inventory, routing, labor, energy and technical calculations more visible and comparable.",
    supporting:
      "Basic measurement and conversion calculators are free. For quotes, scrap, shop rate, OEE, carbon, inventory, payroll, downtime and operational loss, premium industry calculators add more inputs and a decision summary.",
    ctaPrimary: "Open free industry calculators",
    ctaSecondary: "Browse premium calculators",
    panelTitle: "Industry calculation domains",
    panelItems: {
      production: "Production and manufacturing",
      industrial: "Industry and workshops",
      technical: "Technical and engineering calculations",
      construction: "Construction and field work",
      logistics: "Logistics and shipping",
      energy: "Energy and carbon",
      finance: "Finance and HR",
      scrapMargin: "Scrap, margin and operational loss",
    },
  },
  de: {
    headline: "Kritische Produktions-, Unternehmens- und Technikberechnungen an einem Ort",
  },
  fr: {
    headline:
      "Visualisez les calculs critiques de production, d'entreprise et techniques au même endroit",
  },
  es: {
    headline: "Vea los cálculos críticos de producción, empresa y técnica en un solo lugar",
  },
  ar: {
    headline: "اعرض حسابات الإنتاج والأعمال والحسابات الفنية المهمة في مكان واحد",
  },
};

const SECTION_OVERRIDES = {
  // tr locale removed — Turkish content has been cleaned
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

for (const locale of Object.keys(PATCH)) {
  const path = join(ROOT, "messages", `${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  const block = structuredClone(PATCH[locale].homepageHybrid);

  block.meta = { ...block.meta, ...META_OVERRIDES[locale] };
  if (HERO_OVERRIDES[locale]) {
    block.hero = deepMerge(block.hero, HERO_OVERRIDES[locale]);
  }
  if (SECTION_OVERRIDES[locale]) {
    deepMerge(block, SECTION_OVERRIDES[locale]);
  }

  data.homepageHybrid = block;
  data.catalogExplorer.search.placeholder.homepage = PATCH[locale].searchPlaceholder;

  const footerTaglines = {
    // tr locale removed
    en: "Free and premium industry calculators for manufacturing, workshops, engineering and business operations.",
    de: "Kostenlose und Premium-Branchenrechner für Produktion, Werkstätten, Technik und Unternehmensabläufe.",
    fr: "Calculateurs sectoriels gratuits et premium pour l'industrie, les ateliers, l'ingénierie et les opérations.",
    es: "Calculadoras sectoriales gratuitas y premium para fabricación, talleres, ingeniería y operaciones.",
    ar: "حاسبات قطاعية مجانية ومميزة للتصنيع والورش والهندسة وعمليات الأعمال.",
  };
  if (footerTaglines[locale]) {
    data.enterpriseFooter.tagline = footerTaglines[locale];
  }

  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Patched messages/${locale}.json`);
}
