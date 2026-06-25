import { getTranslations } from "next-intl/server";
// @ts-nocheck
import type { Metadata } from "next";
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
import Link  from "next/link";
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
    metaTitle: "Pro & Premium Karar Hesaplayıcıları | SectorCalc",
    metaDesc: "İşletme, üretim, mühendislik ve finansal kararlarınız için 193 gelişmiş Pro karar analiz aracını keşfedin.",
    heroTitle: "Premium Pro Karar Araçları",
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
    metaTitle: "Pro & Premium Decision Calculators | SectorCalc",
    metaDesc: "Discover 193 advanced Pro decision analysis tools for business, manufacturing, engineering, and financial decisions.",
    heroTitle: "Premium Pro Decision Tools",
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
  const locale = "en";
  const t = await getTranslations();
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;
  return createPageMetadata({
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/premium-tools",
    locale: locale as "en",
  });
}

export default async function PremiumToolsPage({ params }: PageProps) {
  const locale = "en";
  

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

  const t = await getTranslations();
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
      "title",
      locale,
    ),
    buildCollectionPageJsonLd(locale),
  ];

  const totalPremium = premiumCatalogTools.length;
  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;

  return (
    <PageLayout>
      <div className="bg-[#F0EEE6]">
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto w-full max-w-6xl px-4 lg:px-8 pt-8 pb-4"
      >
        <ol className="flex items-center gap-2 text-sm font-medium text-slate-500" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="hover:text-slate-900 transition-colors" itemProp="item">
              <span itemProp="name">{c.breadcrumbHome}</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-slate-900 font-semibold" itemProp="name" aria-current="page">{c.breadcrumbCurrent}</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      {/* Claude Design Hero Block */}
      <section className="border-b border-[#1A1915]/10 bg-[#F0EEE6] pt-8 pb-12">
        <Container className="max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C45A2C]/20 bg-[#C45A2C]/5 px-3 py-1 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C45A2C] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C45A2C]">{c.heroBadge}</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-5">
            {c.heroTitle}
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed font-sans mb-8">
            {c.heroLead} <span className="inline sm:block sm:mt-1 text-base text-slate-500">{c.heroSub}</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-[#C45A2C] px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#A64B24] transition-all">
              {c.ctaPricing}
            </Link>
            <Link href="/free-tools" className="inline-flex items-center justify-center rounded-lg bg-[#FAF9F5] border border-[#1A1915]/10 px-6 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 transition-all">
              {c.ctaFree}
            </Link>
          </div>

          <div className="mt-12 mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#1A1915]/5 pt-8">
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-3xl font-medium text-[#C45A2C]">{totalPremium}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.statsTools}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-3xl font-medium text-slate-900">18</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.statsSectors}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-3xl font-medium text-slate-900">✓</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.statsReports}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Catalog Search & Grid section */}
      <section className="bg-[#F0EEE6] py-16 border-b border-[#1A1915]/10" id="tools-list">
        <Container size="wide" className="min-w-0">
          <div className="mb-12 max-w-4xl mx-auto text-center flex flex-col items-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-6">{c.intentLabel}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left w-full">
              {c.intents.map((intent) => (
                <a
                  key={intent.cat}
                  href="#catalog-grid-results"
                  className="flex items-center gap-3 rounded-xl border border-[#1A1915]/10 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:border-[#C45A2C] hover:text-[#C45A2C] transition-colors shadow-sm"
                >
                  <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-[#C45A2C]/40" aria-hidden="true" />
                  {intent.label}
                </a>
              ))}
            </div>
          </div>
          
          <div className="bg-transparent rounded-2xl overflow-hidden">
            <PremiumCatalogSearch tools={searchableTools} categories={searchableCategories} />
          </div>
        </Container>
      </section>

      {/* Ultra Premium SEO Content */}
      <div className="bg-[#F0EEE6]">
        <Container className="max-w-5xl py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
            <div>
              <p className="font-mono text-sm font-semibold tracking-widest text-[#C45A2C] mb-4">{c.howEyebrow}</p>
              <h2 className="font-serif text-3xl font-bold text-slate-900 leading-tight mb-8">{c.howTitle}</h2>
              <div className="space-y-8">
                {c.howSteps.map((step) => (
                  <div key={step.num} className="relative pl-10 border-l-2 border-slate-100">
                    <span className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-500">
                      {step.num}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <p className="font-mono text-sm font-semibold tracking-widest text-[#C45A2C] mb-4">{c.audienceEyebrow}</p>
              <h2 className="font-serif text-3xl font-bold text-slate-900 leading-tight mb-8">{c.audienceTitle}</h2>
              <div className="grid gap-6">
                {c.audiences.map((aud) => (
                  <div key={aud.title} className="rounded-xl border border-slate-100 bg-slate-50 p-6 hover:border-[#C45A2C]/30 transition-colors">
                    <h3 className="text-base font-bold text-slate-900 mb-2">{aud.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{aud.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 mb-32 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <p className="font-mono text-sm font-semibold tracking-widest text-slate-400 mb-4">{c.fvpEyebrow}</p>
              <h2 className="font-serif text-3xl font-bold mb-12">{c.fvpTitle}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                <div className="rounded-2xl bg-white/5 p-8 border border-white/10">
                  <div className="inline-flex items-center gap-2 mb-6">
                    <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                    <h3 className="text-xl font-semibold">{c.fvpFreeLabel}</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 uppercase tracking-wider">{c.fvpFreeTag}</p>
                  <ul className="space-y-4">
                    {c.fvpFreeItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <span className="mt-1 text-slate-500">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="rounded-2xl bg-[#C45A2C]/10 p-8 border border-[#C45A2C]/20">
                  <div className="inline-flex items-center gap-2 mb-6">
                    <span className="h-2 w-2 rounded-full bg-[#C45A2C] animate-pulse"></span>
                    <h3 className="text-xl font-semibold text-white">{c.fvpProLabel}</h3>
                  </div>
                  <p className="text-sm text-[#C45A2C] mb-6 uppercase tracking-wider font-bold">{c.fvpProTag}</p>
                  <ul className="space-y-4">
                    {c.fvpProItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white font-medium">
                        <span className="mt-1 text-[#C45A2C]">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <Link href="/pricing" className="inline-flex items-center justify-center w-full rounded-lg bg-[#C45A2C] px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#A64B24] transition-all">
                      {c.fvpCta}
                    </Link>
                    <p className="mt-4 text-center text-xs text-slate-400">{c.fvpNote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
            <div className="lg:col-span-5">
              <p className="font-mono text-sm font-semibold tracking-widest text-[#C45A2C] mb-4">{c.trustEyebrow}</p>
              <h2 className="font-serif text-3xl font-bold text-slate-900 leading-tight mb-6">{c.trustTitle}</h2>
              <div className="prose prose-slate prose-sm text-slate-600">
                <p>
                  SectorCalc Pro platformunda yer alan her bir analiz aracı endüstri standartlarına (ISO, ASME, IEC) 
                  ve kabul görmüş finansal metodolojilere (GAAP) dayanmaktadır. Sistem kara kutu değildir; formül ve algoritma tamamen açıktır.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid gap-4">
                {c.trustItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-xs mt-0.5">✓</span>
                    <span className="text-sm font-medium text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-24 pb-12">
            <div className="text-center mb-16">
              <p className="font-mono text-sm font-semibold tracking-widest text-[#C45A2C] mb-4">{c.faqEyebrow}</p>
              <h2 className="font-serif text-3xl font-bold text-slate-900">{c.faqTitle}</h2>
            </div>
            
            <div className="mx-auto max-w-3xl divide-y divide-slate-100">
              {c.faqs.map((faq, i) => (
                <details key={i} className="group py-6" open={i === 0}>
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                    <span className="text-lg">{faq.q}</span>
                    <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 group-open:bg-[#C45A2C]/10 group-open:text-[#C45A2C] transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path className="group-open:hidden" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        <path className="hidden group-open:block" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 leading-relaxed pr-12">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </div>
      </div>
    </PageLayout>
  );
}
