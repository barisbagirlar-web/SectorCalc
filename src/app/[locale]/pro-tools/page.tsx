import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { PremiumCatalogSearch } from "@/components/catalog/PremiumCatalogSearch";
import type {
  SearchablePremiumTool,
  SearchablePremiumCategory,
} from "@/components/catalog/PremiumCatalogSearch";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { listPremiumCatalogCategories } from "@/lib/premium/premium-category-resolver";
import { buildPremiumCatalogTools } from "@/lib/catalog/premium-catalog-source";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { buildPremiumToolsCrawlGroups, buildCoreHubCrawlGroups } from "@/lib/seo/crawl-index";
import { shouldRenderCrawlIndexForLocale } from "@/lib/i18n/catalog-labels-i18n";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

function buildCollectionPageJsonLd(locale: string) {
  const base = "https://sectorcalc.com";
  const path = locale === "en" ? "/pro-tools" : `/${locale}/pro-tools`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      locale === "tr"
        ? "Pro Hesaplayıcılar | SectorCalc"
        : "Pro Calculators | SectorCalc",
    description:
      locale === "tr"
        ? "İşletme, üretim, mühendislik ve finansal kararlarınız için tasarlanmış gelişmiş profesyonel Pro karar analiz aracı dizini."
        : "Advanced professional Pro decision analysis tool directory designed for business, manufacturing, engineering, and financial decisions.",
    url: `${base}${path}`,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "SectorCalc",
      url: base,
    },
  };
}

const COPY = {
  tr: {
    breadcrumbHome: "Ana Sayfa",
    breadcrumbCurrent: "Pro Hesaplayıcılar",
    heroBadge: "Pro / Premium Karar Araçları",
    heroLead: "İşletme, üretim, mühendislik ve finansal kararlarınız için 193 gelişmiş Pro karar analiz aracı.",
    heroSub: "SectorCalc Pro; hassas girdi parametreleri, tolerans aralıkları, senaryo karşılaştırmaları, karar analizi ve PDF rapor çıktısı sunan endüstriyel standartta bir karar destek platformudur.",
    ctaFree: "Ücretsiz hesaplayıcıları inceleyin",
    ctaPricing: "Fiyatlandırma planlarını karşılaştırın",
    statsTools: "aktif pro araç",
    statsSectors: "endüstri sektörü",
    statsReports: "karara hazır PDF raporu",
    intentLabel: "Çözmek istediğiniz premium karar problemi nedir?",
    intents: [
      { label: "Üretim hattında OEE, israf ve duruş kayıplarını hesaplamak istiyorum", cat: "Lean & OEE" },
      { label: "CNC işleme, makine saat ücreti ve fason teklif marjı hesaplamak istiyorum", cat: "Mühendislik & Teklif" },
      { label: "Proje finansmanı, yatırım geri dönüşü (ROI) ve amortisman hesaplamak istiyorum", cat: "Yatırım & Finans" },
      { label: "Sürdürülebilirlik, ESG ve tesis karbon ayak izi analizi yapmak istiyorum", cat: "Enerji & Karbon" },
      { label: "Tedarik zinciri maliyetleri, rota optimizasyonu ve lojistik analiz yapmak istiyorum", cat: "Rota & Lojistik" },
      { label: "Saha metrajı, malzeme mukavemeti ve saha planlama hesapları yapmak istiyorum", cat: "İnşaat & Saha" },
    ],
    howTitle: "SectorCalc Pro karar araçları nasıl çalışır?",
    howEyebrow: "Metodoloji & Karar Desteği",
    howSteps: [
      { num: "01", title: "Hassas parametreleri girin", desc: "Sektörel standartlara uygun tolerans, saatlik oranlar ve detaylı girdi parametrelerini belirleyin." },
      { num: "02", title: "Karar algoritmalarını çalıştırın", desc: "Kara kutu olmayan, arka planda çalışan ve formülü açıkça gösterilen mühendislik ve finans kurallarını tetikleyin." },
      { num: "03", title: "Senaryoları karşılaştırın", desc: "İyimser, kötümser ve nötr senaryoları yan yana simüle ederek marj ve verimlilik risklerini analiz edin." },
      { num: "04", title: "PDF karar raporu alın", desc: "Müşterilerinize sunmaya veya yönetim kuruluna iletmeye hazır, profesyonel analiz raporunu PDF olarak indirin." },
    ],
    audienceTitle: "SectorCalc Pro kimler için tasarlandı?",
    audienceEyebrow: "Kullanıcı Profilleri",
    audiences: [
      { title: "Fabrika ve Üretim Müdürleri", desc: "OEE kayıplarını minimize etmek, kapasite planlamak ve makine-insan saat maliyetlerini optimize etmek için." },
      { title: "CFO ve Finans Yöneticileri", desc: "Doğru amortisman, teklif marjı kontrolü, mali risk analizi ve yatırım karlılığı hesapları için." },
      { title: "Mühendis ve Teknik Liderler", desc: "Tasarım sınırları, standart zaman hesaplamaları ve tesis tüketim verimliliği optimizasyonu için." },
      { title: "İş Geliştirme ve Satış Ekipleri", desc: "Fiyatlandırma teklifleri hazırlarken marj risklerini en aza indirgemek ve şeffaf teklif tabloları oluşturmak için." },
      { title: "Yönetim Danışmanları ve Analistler", desc: "Müşterilerine sunacakları fizibilite çalışmalarını ve israf (muda) analizlerini doğrulamak için." },
      { title: "Lojistik ve Operasyon Liderleri", desc: "Navlun, depo ve tedarik zinciri optimizasyon hesaplarında hassas kararlar almak için." },
      { title: "Enerji ve Sürdürülebilirlik Uzmanları", desc: "ESG uyumluluğu, karbon emisyonu ve tesis enerji yoğunluğu hesaplamaları için." },
      { title: "Müteahhitler ve Saha Koordinatörleri", desc: "Büyük ölçekli saha metrajları ve yapısal tasarım tolerans kontrolleri için." },
    ],
    fvpTitle: "Free ve Pro sürüm özellikleri arasındaki farklar nelerdir?",
    fvpEyebrow: "Özellik Karşılaştırması",
    fvpFreeLabel: "Ücretsiz Araçlar",
    fvpProLabel: "Pro Karar Araçları",
    fvpFreeTag: "Hızlı Ön Hesaplama",
    fvpProTag: "Profesyonel Karar Raporu",
    fvpFreeItems: [
      "Anlık hızlı hesaplama çıktısı",
      "Temel formül gösterimi",
      "Tekil araç bazında basit arayüz",
      "Kayıt veya oturum gerektirmez",
    ],
    fvpProItems: [
      "Gelişmiş input seti ve tolerans kontrolü",
      "Senaryo karşılaştırması ve duyarlılık analizi",
      "Profesyonel PDF karar raporu indirme",
      "Sektörel yorum ve karar destek özetleri",
    ],
    fvpCta: "Hemen Pro Erişimi Etkinleştirin",
    fvpNote: "193 Pro araca anında ve sınırsız erişim",
    internalTitle: "SectorCalc ile devam edin",
    internalEyebrow: "Hızlı Erişim",
    internalLinks: [
      { label: "Ücretsiz hesaplayıcılar", sub: "Hızlı ön hesaplama ve temel formül araçları", href: "/free-tools" },
      { label: "Sektörlere göre araçlar", sub: "Sektörel kırılımda gruplanmış hesaplayıcı dizini", href: "/industries" },
      { label: "Fiyatlandırma planları", sub: "Abonelik ve kredi bazlı erişim seçenekleri", href: "/pricing" },
      { label: "Formül referansları", sub: "Araçlarda kullanılan formüller ve bilimsel kaynaklar", href: "/methodology" },
      { label: "PDF örnek raporu", sub: "Pro araçlardan üretilen örnek karar raporunu inceleyin", href: "/reports/sample-decision-report" },
      { label: "Kurumsal çözümler", sub: "Çoklu hesap yönetimi ve özel API entegrasyonu", href: "/enterprise" },
    ],
    trustTitle: "Mühendislik ve finansal hesaplama güvencesi",
    trustEyebrow: "Güven ve Doğruluk",
    trustItems: [
      "Bilimsel ve sektörel standartlar (ISO, ASME, IEC, GAAP) baz alınarak tasarlanmıştır.",
      "Tüm hesaplama formülleri ve mantığı şeffaf bir şekilde paylaşılır, gizli hesap yoktur.",
      "Formüllerin doğruluğu otomatik test senaryoları ve oracler tarafından sürekli denetlenir.",
      "Girdileriniz ve rapor verileriniz yüksek güvenlikli sunucularda barındırılır.",
      "Sonuçlar karar sürecinizi destekler; hiçbir araç yatırım veya yasal danışmanlık içermez.",
      "Tolerans ve sınır dışı parametre girdilerinde sistem sizi otomatik olarak uyarır.",
    ],
    faqTitle: "Pro hesaplayıcılar hakkında sıkça sorulanlar",
    faqEyebrow: "Soru & Cevap",
    faqs: [
      {
        q: "Pro araçlar ücretsiz olanlardan nasıl ayrışır?",
        a: "Pro araçlar, işletmenizin kritik kararlarında kullanabileceğiniz gelişmiş girdiler, tolerans sınırları, senaryo karşılaştırması ve PDF rapor çıktısı sunar.",
      },
      {
        q: "Hesaplama sonuçlarını rapor olarak nasıl alabilirim?",
        a: "Hesaplamanızı tamamladıktan sonra 'PDF Raporu İndir' butonuna tıklayarak, girdi parametreleri, formül açıklamaları ve sonuç grafiklerini içeren kurumsal tasarımlı bir PDF rapor oluşturabilirsiniz.",
      },
      {
        q: "Hesaplamalarda kullanılan formüllere güvenebilir miyim?",
        a: "Evet. SectorCalc üzerindeki tüm Pro formülleri küresel mühendislik standartlarına, finans kurallarına ve akademik metodolojilere dayanmaktadır. Formüller şeffaftır ve her aracın altında açıkça gösterilmektedir.",
      },
      {
        q: "Birden fazla senaryoyu nasıl karşılaştırırım?",
        a: "Pro arayüzlerde yer alan 'Senaryo Ekle' veya 'Karşılaştır' özelliği sayesinde, girdi parametrelerini değiştirerek alternatif senaryolar oluşturabilir ve bunları yan yana analiz edebilirsiniz.",
      },
      {
        q: "Hizmet iptali ve abonelik koşulları nelerdir?",
        a: "Pro aboneliğinizi dilediğiniz an üye panelinizden tek tıkla iptal edebilirsiniz. İptal durumunda fatura dönemi sonuna kadar Pro erişiminiz devam eder.",
      },
    ],
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Pro Calculators",
    heroBadge: "Pro / Premium Decision Tools",
    heroLead: "193 advanced Pro decision analysis tools for business, manufacturing, engineering, and financial decisions.",
    heroSub: "SectorCalc Pro is an industrial-grade decision support platform offering precise input parameters, tolerance ranges, scenario comparisons, decision analysis, and PDF report export.",
    ctaFree: "Explore free calculators",
    ctaPricing: "Compare pricing plans",
    statsTools: "active pro tools",
    statsSectors: "industry sectors",
    statsReports: "decision-ready PDF reports",
    intentLabel: "What premium decision problem do you need to solve?",
    intents: [
      { label: "Calculate OEE, scrap, and downtime losses on a production line", cat: "Lean & OEE" },
      { label: "Calculate CNC machining, machine hour rates, and subcontracting quote margins", cat: "Engineering & Quotes" },
      { label: "Calculate project financing, return on investment (ROI), and amortization", cat: "Investment & Finance" },
      { label: "Analyze sustainability, ESG, and facility carbon footprint", cat: "Energy & Carbon" },
      { label: "Analyze supply chain costs, route optimization, and logistics", cat: "Route & Logistics" },
      { label: "Perform site quantity takeoffs, material strength, and site planning calculations", cat: "Construction & Field" },
    ],
    howTitle: "How do SectorCalc Pro decision tools work?",
    howEyebrow: "Methodology & Decision Support",
    howSteps: [
      { num: "01", title: "Enter precise parameters", desc: "Set tolerances, hourly rates, and detailed inputs based on industrial standards." },
      { num: "02", title: "Run decision algorithms", desc: "Trigger fully transparent, open-formula engineering and financial logic." },
      { num: "03", title: "Compare scenarios", desc: "Simulate optimistic, pessimistic, and neutral scenarios to evaluate margin and efficiency risks." },
      { num: "04", title: "Export PDF decision report", desc: "Download presentation-ready PDF reports to share with clients or management." },
    ],
    audienceTitle: "Who is SectorCalc Pro designed for?",
    audienceEyebrow: "User Profiles",
    audiences: [
      { title: "Plant & Production Managers", desc: "To minimize OEE losses, plan capacity, and optimize machine-man hour costs." },
      { title: "CFOs & Finance Managers", desc: "For precise depreciation, quotation margin checks, financial risk analysis, and investment feasibility." },
      { title: "Engineers & Technical Leads", desc: "For design boundaries, standard time calculations, and facility efficiency optimization." },
      { title: "Business Dev & Sales Teams", desc: "To minimize margin risks and prepare transparent quote tables for clients." },
      { title: "Management Consultants & Analysts", desc: "To validate feasibility studies and waste (muda) analyses for clients." },
      { title: "Logistics & Operations Leaders", desc: "To make critical decisions in freight, warehouse, and supply chain calculations." },
      { title: "Energy & Sustainability Specialists", desc: "For ESG compliance, carbon footprinting, and facility energy intensity." },
      { title: "Contractors & Field Coordinators", desc: "For large-scale construction takeoffs and structural tolerance checks." },
    ],
    fvpTitle: "What is the difference between Free and Pro tiers?",
    fvpEyebrow: "Feature Comparison",
    fvpFreeLabel: "Free Tools",
    fvpProLabel: "Pro Decision Tools",
    fvpFreeTag: "Quick Pre-calculation",
    fvpProTag: "Professional Decision Report",
    fvpFreeItems: [
      "Instant quick calculation outputs",
      "Basic formula display",
      "Simple single-tool interface",
      "No registration or login required",
    ],
    fvpProItems: [
      "Advanced inputs and tolerance boundaries",
      "Scenario comparisons and sensitivity analysis",
      "Professional PDF report downloads",
      "Detailed decision summaries and industry comments",
    ],
    fvpCta: "Activate Pro Access Now",
    fvpNote: "Instant and unlimited access to all 193 Pro tools",
    internalTitle: "Continue with SectorCalc",
    internalEyebrow: "Quick Access",
    internalLinks: [
      { label: "Free calculators", sub: "Quick pre-calculations and basic formula tools", href: "/free-tools" },
      { label: "Tools by industry", sub: "Calculator index grouped by industry sectors", href: "/industries" },
      { label: "Pricing plans", sub: "Subscription and credit-based access plans", href: "/pricing" },
      { label: "Formula references", sub: "Formulas and scientific references used in tools", href: "/methodology" },
      { label: "Sample PDF report", sub: "View a sample decision report generated by Pro tools", href: "/reports/sample-decision-report" },
      { label: "Enterprise solutions", sub: "Multi-user account management and custom API integration", href: "/enterprise" },
    ],
    trustTitle: "Engineering and financial calculation assurance",
    trustEyebrow: "Trust & Accuracy",
    trustItems: [
      "Designed based on global scientific and industry standards (ISO, ASME, IEC, GAAP).",
      "All calculation formulas and logic are transparently shared, no hidden algorithms.",
      "Formula accuracy is constantly verified by automated test suites and oracles.",
      "Your inputs and generated report data are hosted on highly secure servers.",
      "Results support your decisions; no tool constitutes investment or legal advice.",
      "The system automatically alerts you when parameters fall outside tolerances.",
    ],
    faqTitle: "Frequently asked questions about Pro calculators",
    faqEyebrow: "Q&A",
    faqs: [
      {
        q: "How do Pro tools differ from free ones?",
        a: "Pro tools provide advanced input parameters, tolerance ranges, scenario comparison, and PDF report downloads that you can use for critical business decisions.",
      },
      {
        q: "How do I get my calculation results as a report?",
        a: "Once you complete your calculation, click the 'Download PDF Report' button to generate a beautifully formatted corporate PDF report including inputs, formulas, and results.",
      },
      {
        q: "Can I trust the formulas used in calculations?",
        a: "Yes. All Pro formulas on SectorCalc are based on global engineering standards, financial frameworks, and academic methodologies. They are fully transparent and listed on each tool page.",
      },
      {
        q: "How do I compare multiple scenarios?",
        a: "With the 'Add Scenario' or 'Compare' feature on Pro interfaces, you can change input parameters to simulate alternative scenarios and analyze them side-by-side.",
      },
      {
        q: "What are the subscription cancellation terms?",
        a: "You can cancel your Pro subscription anytime with a single click in your member dashboard. Your Pro access remains active until the end of the billing period.",
      },
    ],
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "premiumCategoryCatalog" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/premium-tools",
    locale: locale as AppLocale,
  });
}

export default async function PremiumToolsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const rawCategories = listPremiumCatalogCategories(locale);
  const premiumCatalogTools = buildPremiumCatalogTools(locale);

  const searchableTools: SearchablePremiumTool[] = premiumCatalogTools.map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    categorySlug: item.categoryId,
    categoryLabel: item.categoryLabel,
    routePath: item.routePath,
    isActive: item.isActive,
    searchTerms: item.searchTerms,
    aliases: item.aliases,
    keywords: item.keywords,
  }));

  const searchableCategories: SearchablePremiumCategory[] = rawCategories
    .filter((c) => c.premiumToolCount > 0)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      count: c.premiumToolCount,
    }));

  const t = await getTranslations("premiumCategoryCatalog");
  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "premiumTools", path: "/pro-tools" },
      ],
      locale,
    ),
    buildItemListJsonLd(
      premiumCatalogTools.map((item) => ({
        name: item.title,
        path: item.routePath ?? `/pro-tools/${item.slug}`,
      })),
      t("title"),
      locale,
    ),
    buildCollectionPageJsonLd(locale),
  ];

  const totalPremium = premiumCatalogTools.length;
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav
        aria-label={locale === "tr" ? "Sayfa yolu" : "Breadcrumb"}
        className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-5 pt-4 pb-0"
      >
        <ol className="flex items-center gap-1.5 text-xs text-slate-400" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="hover:text-slate-600 transition-colors" itemProp="item">
              <span itemProp="name">{c.breadcrumbHome}</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true" className="text-slate-300">›</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-slate-600 font-medium" itemProp="name" aria-current="page">{c.breadcrumbCurrent}</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      {/* Hero SEO block with Claude Accent Styling */}
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C45A2C]">
            {c.heroBadge}
          </p>
          <h1 className="sc-pro-title sc-pro-title--compact font-serif text-3xl font-bold text-premium-velvet">
            {t("title")}
          </h1>
          <p className="sc-pro-lead max-w-2xl text-slate-700 mt-2">{c.heroLead}</p>
          <p className="mt-2 text-sm text-slate-500 max-w-xl leading-relaxed">{c.heroSub}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/free-tools" className="text-sm font-medium text-[#C45A2C] hover:underline underline-offset-2 flex items-center gap-1">
              {c.ctaFree} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline underline-offset-2 flex items-center gap-1">
              {c.ctaPricing} <span aria-hidden="true">→</span>
            </Link>
          </div>
          {/* Stats bar */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-semibold tracking-tight text-slate-900">{totalPremium}</span>
              <span className="text-xs text-slate-400">{c.statsTools}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-200" aria-hidden="true" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-semibold tracking-tight text-slate-900">18</span>
              <span className="text-xs text-slate-400">{c.statsSectors}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-200" aria-hidden="true" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-semibold tracking-tight text-[#C45A2C]">✓</span>
              <span className="text-xs text-slate-400">{c.statsReports}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Intent block */}
      <section aria-label={c.intentLabel} className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-5 py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{c.intentLabel}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {c.intents.map((intent) => (
            <a
              key={intent.cat}
              href="#tools-list"
              className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-500 hover:border-orange-200 hover:bg-orange-50/60 hover:text-[#C45A2C] transition-colors leading-snug"
            >
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-300" aria-hidden="true" />
              {intent.label}
            </a>
          ))}
        </div>
      </section>

      {/* Catalog Search & Grid section */}
      <section className="sc-pro-section sc-pro-section--border" id="tools-list">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <PremiumCatalogSearch tools={searchableTools} categories={searchableCategories} />
        </Container>
      </section>

      {/* Post-catalog SEO content blocks */}
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-5">

        {/* How it works */}
        <section aria-labelledby="how-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C45A2C]">{c.howEyebrow}</p>
          <h2 id="how-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.howTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
            {c.howSteps.map((step) => (
              <div key={step.num} className="bg-white px-5 py-5">
                <p className="mb-2 font-mono text-xs font-semibold text-[#C45A2C] tracking-wider">{step.num}</p>
                <p className="mb-1.5 text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section aria-labelledby="audience-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C45A2C]">{c.audienceEyebrow}</p>
          <h2 id="audience-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.audienceTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {c.audiences.map((aud) => (
              <div key={aud.title} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="mb-1 text-sm font-semibold text-slate-900">{aud.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{aud.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Free vs Pro comparative table */}
        <section aria-labelledby="fvp-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C45A2C]">{c.fvpEyebrow}</p>
          <h2 id="fvp-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.fvpTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 mb-5">
            <div className="bg-white px-6 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 flex items-center gap-2">
                {c.fvpFreeLabel}
                <span className="rounded px-2 py-0.5 text-[10px] font-semibold bg-orange-50 text-[#C45A2C]">{c.fvpFreeTag}</span>
              </p>
              <ul className="flex flex-col gap-2.5">
                {c.fvpFreeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#C45A2C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white px-6 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 flex items-center gap-2">
                {c.fvpProLabel}
                <span className="rounded px-2 py-0.5 text-[10px] font-semibold bg-slate-900 text-white">{c.fvpProTag}</span>
              </p>
              <ul className="flex flex-col gap-2.5">
                {c.fvpProItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#C45A2C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C45A2C] transition-colors">
              {c.fvpCta} <span aria-hidden="true">→</span>
            </Link>
            <span className="text-xs text-slate-400">{c.fvpNote}</span>
          </div>
        </section>

        {/* Internal link hub */}
        <section aria-labelledby="internal-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C45A2C]">{c.internalEyebrow}</p>
          <h2 id="internal-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.internalTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {c.internalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href as any}
                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 hover:border-orange-200 hover:bg-orange-50/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-[#C45A2C] transition-colors">{link.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{link.sub}</p>
                </div>
                <svg className="h-4 w-4 flex-shrink-0 text-slate-300 group-hover:text-[#C45A2C] group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust block */}
        <section aria-labelledby="trust-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C45A2C]">{c.trustEyebrow}</p>
          <h2 id="trust-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.trustTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {c.trustItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4">
                <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#C45A2C] opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                <p className="text-xs text-slate-500 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="py-12 border-t border-slate-100 pb-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#C45A2C]">{c.faqEyebrow}</p>
          <h2 id="faq-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.faqTitle}</h2>
          <div className="flex flex-col gap-1.5">
            {c.faqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <summary className="flex cursor-pointer select-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-slate-900 hover:text-[#C45A2C] transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <svg className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="px-5 pb-4 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-100">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>

      {shouldRenderCrawlIndexForLocale(locale) ? (
        <section className="sc-pro-section sc-pro-section--border">
          <Container className="sc-pro-container">
            <CrawlIndexLinkList
              groups={[...buildCoreHubCrawlGroups(), ...buildPremiumToolsCrawlGroups(locale)]}
            />
          </Container>
        </section>
      ) : null}
    </PageLayout>
  );
}
