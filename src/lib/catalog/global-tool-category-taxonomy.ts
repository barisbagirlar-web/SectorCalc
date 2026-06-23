export type GlobalToolCategorySlug =
  | "lean-production"
  | "quality-six-sigma"
  | "process-chemical"
  | "cnc-additive-manufacturing"
  | "metal-plastics-forming"
  | "project-construction-management"
  | "digital-factory-automation"
  | "maintenance-reliability"
  | "hse-ergonomics"
  | "procurement-supply-chain"
  | "workforce-hr"
  | "finance-sales-working-capital"
  | "sustainability-resource-esg"
  | "food-cold-chain-hygiene"
  | "textile-print-lab"
  | "electrical-power-systems"
  | "mechanical-hvac-energy-loss"
  | "packaging-local-business"
  | "global-compliance-trade"
  | "technology-ai-cloud-cyber";

export type GlobalToolCategory = {
  readonly slug: GlobalToolCategorySlug;
  readonly trTitle: string;
  readonly enTitle: string;
  readonly iconKey: string;
  readonly summary: string;
  readonly premiumSeedCount: number;
};

const GLOBAL_CATEGORIES: readonly GlobalToolCategory[] = [
  {
    slug: "lean-production",
    trTitle: "Yalın Üretim ve Hat Verimliliği",
    enTitle: "Lean Production & Line Efficiency",
    iconKey: "flow",
    summary: "SMED, Kanban, VSM, Kaizen, Andon ve hat dengeleme araçları.",
    premiumSeedCount: 21
  },
  {
    slug: "quality-six-sigma",
    trTitle: "Kalite, SPC ve Altı Sigma",
    enTitle: "Quality, SPC & Six Sigma",
    iconKey: "quality",
    summary: "Cpk/Ppk, MSA, HTEA, SPC, Taguchi, RTY ve kalite proje seçimi.",
    premiumSeedCount: 8
  },
  {
    slug: "process-chemical",
    trTitle: "Proses, Kimya ve Akışkanlar",
    enTitle: "Process, Chemical & Fluids",
    iconKey: "flask",
    summary: "Parti verimi, kütle dengesi, pompa kaybı, harmanlama ve emniyet ventili.",
    premiumSeedCount: 6
  },
  {
    slug: "cnc-additive-manufacturing",
    trTitle: "CNC, 3B Baskı ve İleri İmalat",
    enTitle: "CNC, 3D Printing & Advanced Manufacturing",
    iconKey: "cnc",
    summary: "CNC süre, takım ömrü, 3B baskı, talaş, bağlama aparatı ve işleme stratejileri.",
    premiumSeedCount: 12
  },
  {
    slug: "metal-plastics-forming",
    trTitle: "Sac Metal, Döküm, Plastik ve Şekillendirme",
    enTitle: "Sheet Metal, Casting, Plastics & Forming",
    iconKey: "metal",
    summary: "Nesting fire, döküm verimi, enjeksiyon çevrimi, pres kuvveti ve büküm geri esneme.",
    premiumSeedCount: 6
  },
  {
    slug: "project-construction-management",
    trTitle: "Proje, Şantiye ve İnşaat Yönetimi",
    enTitle: "Project, Site & Construction Management",
    iconKey: "build",
    summary: "EVM, CPM, kaynak seviyesi, sözleşme riski, hakediş, mobilizasyon ve şantiye kararları.",
    premiumSeedCount: 10
  },
  {
    slug: "digital-factory-automation",
    trTitle: "Dijital Fabrika ve Otomasyon",
    enTitle: "Digital Factory & Automation",
    iconKey: "automation",
    summary: "IoT, dijital ikiz, cobot, AGV, enerji izleme ve kağıtsız üretim ROI araçları.",
    premiumSeedCount: 6
  },
  {
    slug: "maintenance-reliability",
    trTitle: "Bakım, Arıza ve Güvenilirlik",
    enTitle: "Maintenance & Reliability",
    iconKey: "maintenance",
    summary: "MTBF/MTTR, yedek parça, koruyucu bakım, RCA ve kritiklik matrisi.",
    premiumSeedCount: 5
  },
  {
    slug: "hse-ergonomics",
    trTitle: "İSG, Ergonomi ve Risk Maliyeti",
    enTitle: "HSE, Ergonomics & Risk Cost",
    iconKey: "shield",
    summary: "Kaza maliyeti, İSG yatırımı, gürültü/titreşim ve ergonomi kayıpları.",
    premiumSeedCount: 4
  },
  {
    slug: "procurement-supply-chain",
    trTitle: "Tedarik, Satınalma ve Lojistik",
    enTitle: "Procurement, Supply Chain & Logistics",
    iconKey: "truck",
    summary: "Tedarikçi TCO, taşıma modu, MOQ, ithal/yerli risk, depo ve tersine lojistik.",
    premiumSeedCount: 9
  },
  {
    slug: "workforce-hr",
    trTitle: "İş Gücü, Vardiya ve İnsan Kaynağı",
    enTitle: "Workforce, Shift & HR Cost",
    iconKey: "people",
    summary: "Turnover, vardiya, prim, eğitim ROI ve fazla mesai/yeni işe alım kararı.",
    premiumSeedCount: 5
  },
  {
    slug: "finance-sales-working-capital",
    trTitle: "Finans, Satış ve İşletme Sermayesi",
    enTitle: "Finance, Sales & Working Capital",
    iconKey: "finance",
    summary: "CLV/CAC, churn, kanal kârlılığı, garanti, nakit döngüsü, hedging, leasing, vade ve fiyat esnekliği.",
    premiumSeedCount: 9
  },
  {
    slug: "sustainability-resource-esg",
    trTitle: "Sürdürülebilirlik, Kaynak ve ESG",
    enTitle: "Sustainability, Resources & ESG",
    iconKey: "leaf",
    summary: "Su, atık, ISO 50001, döngüsel ekonomi, GES/RES, CBAM ve Scope emisyonları.",
    premiumSeedCount: 7
  },
  {
    slug: "food-cold-chain-hygiene",
    trTitle: "Gıda, Soğuk Zincir ve Hijyen",
    enTitle: "Food, Cold Chain & Hygiene",
    iconKey: "food",
    summary: "Raf ömrü, reçete maliyeti, HACCP, soğuk zincir, restoran tabak maliyeti ve hijyen kimyasalı.",
    premiumSeedCount: 6
  },
  {
    slug: "textile-print-lab",
    trTitle: "Tekstil, Baskı ve Laboratuvar",
    enTitle: "Textile, Printing & Laboratory",
    iconKey: "lab",
    summary: "Kumaş serim, dikim hattı, boya/apre, baskı fire ve laboratuvar analiz maliyeti.",
    premiumSeedCount: 5
  },
  {
    slug: "electrical-power-systems",
    trTitle: "Elektrik, Pano ve Güç Sistemleri",
    enTitle: "Electrical, Panel & Power Systems",
    iconKey: "electric",
    summary: "Pano ısı yükü, kablo kesiti, kompanzasyon, jeneratör ve UPS kapasite seçimi.",
    premiumSeedCount: 4
  },
  {
    slug: "mechanical-hvac-energy-loss",
    trTitle: "Mekanik, HVAC ve Enerji Kayıpları",
    enTitle: "Mechanical, HVAC & Energy Loss",
    iconKey: "energy",
    summary: "Kaynak maliyeti, lehim, yapıştırıcı, ısı yükü, kanal, yalıtım, buhar, eşanjör, vakum ve hidrolik sistemler.",
    premiumSeedCount: 10
  },
  {
    slug: "packaging-local-business",
    trTitle: "Ambalaj ve Yerel İşletme Araçları",
    enTitle: "Packaging & Local Business Tools",
    iconKey: "box",
    summary: "Ambalaj hacmi, malzeme değişimi, palet konfigürasyonu ve oto servis teklif tutarlılığı.",
    premiumSeedCount: 4
  },
  {
    slug: "global-compliance-trade",
    trTitle: "Global Uyum, Ticaret ve Vergi",
    enTitle: "Global Compliance, Trade & Tax",
    iconKey: "globe",
    summary: "Veri/gizlilik, IFRS/SOX, AML/KYC, tedarik zinciri riski, transfer pricing, FTA ve ülke risk primi.",
    premiumSeedCount: 7
  },
  {
    slug: "technology-ai-cloud-cyber",
    trTitle: "Teknoloji, AI, Bulut ve Siber Risk",
    enTitle: "Technology, AI, Cloud & Cyber Risk",
    iconKey: "chip",
    summary: "Bulut maliyeti, SaaS sivil risk, AI token, otomasyon ROI, EU AI Act, EOR, lokalizasyon ve siber güvenlik.",
    premiumSeedCount: 8
  }
];

const FORBIDDEN_CATEGORY_SLUGS = new Set(["uncategorized", "misc", "other", "genel"]);

export function listGlobalCategorySlugs(): readonly GlobalToolCategorySlug[] {
  return GLOBAL_CATEGORIES.map((category) => category.slug);
}

export function getGlobalCategoryBySlug(slug: string): GlobalToolCategory | undefined {
  if (FORBIDDEN_CATEGORY_SLUGS.has(slug)) {
    return undefined;
  }
  return GLOBAL_CATEGORIES.find((category) => category.slug === slug);
}

export function listGlobalCategories(): readonly GlobalToolCategory[] {
  return GLOBAL_CATEGORIES;
}

export function resolveGlobalCategoryTitle(
  category: Pick<GlobalToolCategory, "trTitle" | "enTitle">,
  locale: string,
): string {
  if (locale === "tr") {
    return category.trTitle;
  }
  return category.enTitle;
}

export function assertValidGlobalCategorySlug(slug: string): GlobalToolCategorySlug {
  if (FORBIDDEN_CATEGORY_SLUGS.has(slug)) {
    throw new Error(`Forbidden category slug: ${slug}`);
  }
  const category = getGlobalCategoryBySlug(slug);
  if (!category) {
    throw new Error(`Unknown global category slug: ${slug}`);
  }
  return category.slug;
}
