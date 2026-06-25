import { getTranslations } from "next-intl/server";
// @ts-nocheck
import type { Metadata } from "next";
import Link  from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectorCatalogExplorer } from "@/components/catalog/SectorCatalogExplorer";
import { Container } from "@/components/ui/Container";
import {
  DEFAULT_FREE_TRAFFIC_CATEGORY,
  getCachedFreeTrafficCatalogGroups,
} from "@/lib/catalog/cached-catalog-groups";
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { buildLocalizedBreadcrumbJsonLd } from "@/lib/seo/localized-breadcrumbs";
import { buildFreeToolsCrawlGroups, buildCoreHubCrawlGroups } from "@/lib/seo/crawl-index";
import { shouldRenderCrawlIndexForLocale } from "@/lib/i18n/catalog-labels-i18n";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumToolsHref } from "@/lib/tools/tool-links";

type PageProps = { params: Promise<{ locale: string }> };

export const revalidate = 3600;
export const dynamic = "force-static";

// ─── NEW: CollectionPage schema ───────────────────────────────────────────────

function buildCollectionPageJsonLd(locale: string) {
  const base = "https://sectorcalc.com";
  const path = locale === "en" ? "/free-tools" : `/${locale}/free-tools`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      locale === "tr"
        ? "Ücretsiz Hesaplayıcılar | SectorCalc"
        : "Free Calculators | SectorCalc",
    description:
      locale === "tr"
        ? "İşletme, üretim, finans, enerji, lojistik ve inşaat kararlarını desteklemek için tasarlanmış ücretsiz profesyonel hesaplayıcı dizini."
        : "Free professional calculator directory for business, manufacturing, finance, energy, logistics and construction decisions.",
    url: `${base}${path}`,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "SectorCalc",
      url: base,
    },
  };
}

// ─── NEW: Inline copy map (TR / EN) ──────────────────────────────────────────

const COPY = {
  tr: {
    breadcrumbHome: "Ana Sayfa",
    breadcrumbCurrent: "Ücretsiz Hesaplayıcılar",
    heroBadge: "Ücretsiz hesaplayıcılar",
    heroLead:
      "İşletme, üretim, finans, enerji, lojistik ve inşaat hesaplamaları için profesyonel araçları tek dizinde bulun.",
    heroSub:
      "SectorCalc; maliyet, marj, fire, OEE, nakit akışı, stok, rota ve saha hesaplarını hızlıca yapmanız için tasarlanmış global hesaplama platformudur. Kayıt gerekmez.",
    ctaPro: "Premium karar araçlarını inceleyin",
    ctaIndustries: "Sektöre göre araçları görüntüleyin",
    statsTools: "ücretsiz araç",
    statsSectors: "endüstri sektörü",
    statsNoReg: "kayıt gereksinimi",
    intentLabel: "Hangi hesaplama problemini çözmek istiyorsunuz?",
    intents: [
      { label: "Teklif fiyatı veya kâr marjı hesaplamak istiyorum", cat: "Maliyet & Marj" },
      { label: "Üretimde fire, kapasite veya OEE hesaplamak istiyorum", cat: "Malzeme, Fire & OEE" },
      { label: "Enerji tüketimi veya karbon etkisini görmek istiyorum", cat: "Enerji & Karbon" },
      { label: "Stok, rota veya lojistik maliyetini hesaplamak istiyorum", cat: "Rota & Lojistik" },
      { label: "İnşaat, saha veya metraj hesabı yapmak istiyorum", cat: "İnşaat & Saha" },
      { label: "Finansal getiri, kredi veya bütçe hesaplamak istiyorum", cat: "Günlük Pratik" },
    ],
    howTitle: "SectorCalc hesaplayıcıları nasıl çalışır?",
    howEyebrow: "Metodoloji",
    howSteps: [
      { num: "01", title: "Girdileri seçin", desc: "Her hesaplayıcı yalnızca o hesaplama için gerekli girdileri ister. Gereksiz alan yoktur." },
      { num: "02", title: "Formülü görün", desc: "Hesaplama mantığı ve kullanılan formül açık biçimde gösterilir. Kara kutu yoktur." },
      { num: "03", title: "Sonucu yorumlayın", desc: "Çıktı yalnızca sayı olarak değil, karar bağlamıyla sunulur." },
      { num: "04", title: "Gerekirse Pro araca geçin", desc: "Senaryo karşılaştırması, PDF çıktı veya detaylı karar özeti gerekiyorsa Pro araçlar kullanılabilir." },
    ],
    audienceTitle: "Bu ücretsiz hesaplayıcılar kimler için?",
    audienceEyebrow: "Hedef kitle",
    audiences: [
      { title: "Üretim ve imalat işletmeleri", desc: "OEE, fire, kapasite ve makine verimliliği hesapları için." },
      { title: "CNC, atölye ve küçük üreticiler", desc: "Standart zaman, bant dengeleme ve mekanik tasarım hesapları için." },
      { title: "Finans ve iş geliştirme ekipleri", desc: "NPV, IRR, WACC ve yatırım değerleme hesapları için." },
      { title: "Lojistik ve tedarik operasyonları", desc: "Navlun, gümrük, hacimsel ağırlık ve tedarik zinciri maliyeti için." },
      { title: "İnşaat ve saha ekipleri", desc: "Metraj, yapı elemanı boyutlandırma ve saha planlama için." },
      { title: "E-ticaret ve satış ekipleri", desc: "Platform komisyonu, kâr marjı ve nakliye maliyet hesapları için." },
      { title: "Danışmanlar, analistler ve girişimciler", desc: "Hızlı ön hesaplama ve karar desteği için." },
      { title: "Enerji ve tesis yöneticileri", desc: "LCOE, tüketim analizi ve karbon ayak izi hesapları için." },
    ],
    fvpTitle: "Ücretsiz araçlar ne sağlar, Pro araçlar neyi derinleştirir?",
    fvpEyebrow: "Karar desteği seviyeleri",
    fvpFreeLabel: "Ücretsiz Araçlar",
    fvpProLabel: "Pro Araçlar",
    fvpFreeTag: "Şu an kullandığınız",
    fvpProTag: "Daha ciddi kararlar için",
    fvpFreeItems: [
      "Hızlı hesaplama — anlık sonuç",
      "Temel formül ve açık hesaplama mantığı",
      "Tek araç bazlı çıktı",
      "Kayıt gerekmez",
    ],
    fvpProItems: [
      "Gelişmiş input seti ve parametre kontrolü",
      "Senaryo karşılaştırması",
      "Detaylı karar özeti ve sektörel yorum",
      "PDF ve rapor çıktısı",
    ],
    fvpCta: "Premium hesaplayıcıları inceleyin",
    fvpNote: "Kredi kartı gerekmez · İstediğiniz zaman iptal edin",
    internalTitle: "SectorCalc içinde devam edin",
    internalEyebrow: "Platform içi navigasyon",
    internalLinks: [
      { label: "Premium hesaplayıcıları inceleyin", sub: "Detaylı karar araçları, senaryo analizi, PDF çıktı", href: "/pro-tools" },
      { label: "Sektörlere göre araçları görüntüleyin", sub: "18 endüstri sektörü, özelleştirilmiş hesap setleri", href: "/industries" },
      { label: "Fiyatlandırma planlarını karşılaştırın", sub: "Kredi bazlı model, Pro ve kurumsal seçenekler", href: "/pricing" },
      { label: "Formül kütüphanesini görüntüleyin", sub: "Hesaplamalarda kullanılan metodoloji ve referanslar", href: "/methodology" },
      { label: "Karar özeti nasıl çalışır?", sub: "Pro araç çıktı yapısı ve yorum rehberi", href: "/docs" },
      { label: "Kurumsal ve ekip kullanımı", sub: "Çok kullanıcılı hesap, API erişimi, özel araç setleri", href: "/enterprise" },
    ],
    trustTitle: "Hesaplama güveni için tasarlandı",
    trustEyebrow: "Kullanım güvencesi",
    trustItems: [
      "Açık formül mantığı — her hesaplamada kullanılan yöntem görünür.",
      "Net input-output yapısı — yalnızca gerekli girdiler istenir, fazlası değil.",
      "Kategori bazlı araç gruplama — doğru hesaplayıcıyı bulmak için hiyerarşik yapı.",
      "Free ve Pro ayrımının görünür olması — hangi araçta ne bekleneceği açıkça belirtilir.",
      "Yanıltıcı sonuç vaadi yok — hesaplayıcılar karar desteği sağlar, danışmanlık yerine geçmez.",
      "Profesyonel karar süreçleri için destekleyici çıktı — kesin sonuç garantisi verilmez.",
    ],
    faqTitle: "Ücretsiz hesaplayıcılar hakkında",
    faqEyebrow: "Sık sorulan sorular",
    faqs: [
      {
        q: "SectorCalc ücretsiz hesaplayıcıları ne için kullanılır?",
        a: "SectorCalc ücretsiz hesaplayıcıları; maliyet, marj, üretim, enerji, lojistik, inşaat ve finans hesaplarını hızlıca yapmak için kullanılır. Kayıt gerekmez.",
      },
      {
        q: "Hesaplayıcılar profesyonel kullanım için uygun mu?",
        a: "Evet. Araçlar işletme, üretim, finans, lojistik ve saha ekiplerinin ön hesaplama ihtiyacını karşılayacak şekilde yapılandırılmıştır. Kritik kararlarda sonuçlar başlangıç noktası olarak değerlendirilmeli; gerektiğinde ilgili uzmanlara başvurulmalıdır.",
      },
      {
        q: "Ücretsiz araçlar ile Pro araçlar arasındaki fark nedir?",
        a: "Ücretsiz araçlar hızlı hesaplama ve temel formül çıktısı sağlar. Pro araçlar daha gelişmiş input seti, senaryo karşılaştırması, detaylı karar özeti, sektörel yorum ve PDF rapor çıktısı sunar.",
      },
      {
        q: "Hangi hesaplayıcıyı kullanmam gerektiğini nasıl anlarım?",
        a: "Kategori kutularını kullanarak hesaplama probleminize en yakın alanı seçebilirsiniz. Arama çubuğuna araç adı veya hesaplama türü yazarak da doğrudan bulabilirsiniz.",
      },
      {
        q: "SectorCalc sonuçları danışmanlık yerine geçer mi?",
        a: "Hayır. SectorCalc hesaplama ve karar desteği sağlar; finansal, hukuki veya mühendislik danışmanlığının yerini almaz. Çıktılar, bilgili bir uygulayıcı tarafından bağlam içinde değerlendirilmelidir.",
      },
    ],
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Free Calculators",
    heroBadge: "Free calculators",
    heroLead:
      "Find professional tools for business, manufacturing, finance, energy, logistics and construction calculations — all in one directory.",
    heroSub:
      "SectorCalc is a global calculation platform designed for rapid cost, margin, scrap, OEE, cash flow, inventory, routing and field calculations. No registration required.",
    ctaPro: "Explore premium decision tools",
    ctaIndustries: "Browse tools by industry",
    statsTools: "free tools",
    statsSectors: "industry sectors",
    statsNoReg: "signup required",
    intentLabel: "What calculation problem do you need to solve?",
    intents: [
      { label: "Calculate a quote price or profit margin", cat: "Cost & Margin" },
      { label: "Calculate scrap, capacity or OEE in manufacturing", cat: "Materials, Scrap & OEE" },
      { label: "Estimate energy consumption or carbon impact", cat: "Energy & Carbon" },
      { label: "Calculate inventory, routing or logistics cost", cat: "Routing & Logistics" },
      { label: "Measure quantities for construction or field work", cat: "Construction & Field" },
      { label: "Calculate financial returns, loans or budget", cat: "Daily Practical" },
    ],
    howTitle: "How do SectorCalc calculators work?",
    howEyebrow: "Methodology",
    howSteps: [
      { num: "01", title: "Enter your inputs", desc: "Each calculator asks only for the inputs required for that specific calculation. No unnecessary fields." },
      { num: "02", title: "See the formula", desc: "The calculation logic and formula used is shown openly. No black boxes." },
      { num: "03", title: "Interpret the result", desc: "Output is presented not just as a number but with decision context." },
      { num: "04", title: "Upgrade to Pro if needed", desc: "If you need scenario comparison, PDF export or a detailed decision summary, Pro tools are available." },
    ],
    audienceTitle: "Who are these free calculators for?",
    audienceEyebrow: "Target audience",
    audiences: [
      { title: "Manufacturing & production businesses", desc: "OEE, scrap, capacity and machine efficiency calculations." },
      { title: "CNC, workshop and small manufacturers", desc: "Standard time, line balancing and mechanical design calculations." },
      { title: "Finance and business development teams", desc: "NPV, IRR, WACC and investment valuation calculations." },
      { title: "Logistics and supply chain operations", desc: "Freight, customs, volumetric weight and supply chain cost." },
      { title: "Construction and field teams", desc: "Quantity takeoff, structural sizing and site planning." },
      { title: "E-commerce and sales teams", desc: "Platform fees, profit margin and shipping cost calculations." },
      { title: "Consultants, analysts and entrepreneurs", desc: "Fast pre-calculations and decision support." },
      { title: "Energy and facilities managers", desc: "LCOE, consumption analysis and carbon footprint calculations." },
    ],
    fvpTitle: "What do free tools provide — and what do Pro tools add?",
    fvpEyebrow: "Decision support levels",
    fvpFreeLabel: "Free Tools",
    fvpProLabel: "Pro Tools",
    fvpFreeTag: "What you're using now",
    fvpProTag: "For more critical decisions",
    fvpFreeItems: [
      "Fast calculation — instant result",
      "Basic formula with transparent logic",
      "Single-tool output",
      "No registration required",
    ],
    fvpProItems: [
      "Advanced input set and parameter control",
      "Scenario comparison",
      "Detailed decision summary with sector interpretation",
      "PDF and report export",
    ],
    fvpCta: "Explore premium calculators",
    fvpNote: "No credit card required · Cancel anytime",
    internalTitle: "Continue inside SectorCalc",
    internalEyebrow: "Platform navigation",
    internalLinks: [
      { label: "Explore premium calculators", sub: "Advanced decision tools, scenario analysis, PDF export", href: "/pro-tools" },
      { label: "View tools by industry", sub: "18 industry sectors, tailored calculation sets", href: "/industries" },
      { label: "Compare pricing plans", sub: "Credit-based model, Pro and enterprise options", href: "/pricing" },
      { label: "View the formula library", sub: "Methodology and references used in calculations", href: "/methodology" },
      { label: "How does the decision summary work?", sub: "Pro tool output structure and interpretation guide", href: "/docs" },
      { label: "Enterprise and team usage", sub: "Multi-user accounts, API access, custom tool sets", href: "/enterprise" },
    ],
    trustTitle: "Designed for calculation confidence",
    trustEyebrow: "Usage assurance",
    trustItems: [
      "Transparent formula logic — the method used in each calculation is visible.",
      "Clear input-output structure — only the inputs needed are requested, nothing more.",
      "Category-based tool grouping — hierarchical structure to find the right calculator.",
      "Free and Pro distinction is visible — what to expect from each tier is clearly stated.",
      "No misleading result promises — calculators provide decision support, not consulting.",
      "Supportive output for professional decision processes — no guarantee of exact results.",
    ],
    faqTitle: "About the free calculators",
    faqEyebrow: "Frequently asked questions",
    faqs: [
      {
        q: "What are SectorCalc free calculators used for?",
        a: "SectorCalc free calculators are used for quick calculations in cost, margin, manufacturing, energy, logistics, construction and finance. They serve the pre-calculation needs of business, production and finance teams. No registration required.",
      },
      {
        q: "Are the calculators suitable for professional use?",
        a: "Yes. The tools are structured to meet the pre-calculation needs of business, manufacturing, finance, logistics and field teams. For critical decisions, results should be treated as a starting point — consult relevant experts when needed.",
      },
      {
        q: "What is the difference between free tools and Pro tools?",
        a: "Free tools provide fast calculations and basic formula output. Pro tools add a more advanced input set, scenario comparison, detailed decision summary, sector interpretation and PDF report export.",
      },
      {
        q: "How do I know which calculator to use?",
        a: "Use the category cards to select the area closest to your calculation problem. You can also type a tool name or calculation type in the search bar to find it directly.",
      },
      {
        q: "Do SectorCalc results replace professional consulting?",
        a: "No. SectorCalc provides calculation and decision support; it does not replace financial, legal or engineering consulting. Outputs should be evaluated in context by a knowledgeable practitioner.",
      },
    ],
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return createPageMetadata({
    title: "metaTitle",
    description: "metaDescription",
    path: "/free-tools",
    locale: locale as "en",
  });
}

export default async function FreeToolsPage({ params }: PageProps) {
  const locale = "en";
  
  const tCatalog = await getTranslations();
  const t = await getTranslations();

  const groups = getCachedFreeTrafficCatalogGroups(
    locale,
    (meta: FreeTrafficCategoryMeta) => ({
      label: meta.labelKey,
      description: meta.descriptionKey,
    }),
    "decisionAnalyzerNote",
    "openCalculator"
  );

  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "freeTools", path: "/free-tools" },
      ],
      locale
    ),
    buildItemListJsonLd(
      groups.flatMap((group) =>
        group.items.map((item) => ({
          name: item.title,
          path: item.href,
        }))
      ),
      tCatalog("freeTools.title"),
      locale
    ),
    buildCollectionPageJsonLd(locale),
  ];

  const totalFree = groups.reduce((acc, g) => acc + g.items.length, 0);

  const c = COPY[locale as keyof typeof COPY] ?? COPY.en;

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
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

      {/* Hero SEO block */}
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">
            {c.heroBadge}
          </p>
          <h1 className="sc-pro-title sc-pro-title--compact">{tCatalog("freeTools.title")}</h1>
          <p className="sc-pro-lead max-w-2xl">{c.heroLead}</p>
          <p className="mt-2 text-sm text-slate-500 max-w-xl leading-relaxed">{c.heroSub}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/pro-tools" className="text-sm font-medium text-sc-copper hover:underline underline-offset-2 flex items-center gap-1">
              {c.ctaPro} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/industries" className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline underline-offset-2 flex items-center gap-1">
              {c.ctaIndustries} <span aria-hidden="true">→</span>
            </Link>
          </div>
          {/* Stats bar */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-semibold tracking-tight text-slate-900">{totalFree}</span>
              <span className="text-xs text-slate-400">{c.statsTools}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-200" aria-hidden="true" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-semibold tracking-tight text-slate-900">18</span>
              <span className="text-xs text-slate-400">{c.statsSectors}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-200" aria-hidden="true" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-semibold tracking-tight text-sc-copper">0</span>
              <span className="text-xs text-slate-400">{c.statsNoReg}</span>
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
              href="#catalog-grid-results"
              className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-500 hover:border-orange-200 hover:bg-orange-50/60 hover:text-[#C45A2C] transition-colors leading-snug"
            >
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-200" aria-hidden="true" />
              {intent.label}
            </a>
          ))}
        </div>
      </section>

      {/* Catalog section */}
      <section className="sc-pro-section sc-pro-section--border" id="tools-list">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <SectorCatalogExplorer
            groups={groups}
            variant="free-tools"
            defaultGroupId={DEFAULT_FREE_TRAFFIC_CATEGORY}
          />
          <div className="sc-discovery-footer">
            <p className="sc-discovery-footer__lead">{tCatalog("discoveryFooter.freeToolsLead")}</p>
            <Link href={getPremiumToolsHref() as any} prefetch={false} className="sc-discovery-footer__link">
              {tCatalog("discoveryFooter.freeToolsCta")}
            </Link>
          </div>
        </Container>
      </section>

      {/* Post-catalog SEO content blocks */}
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-5">

        {/* How it works */}
        <section aria-labelledby="how-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">{c.howEyebrow}</p>
          <h2 id="how-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.howTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
            {c.howSteps.map((step) => (
              <div key={step.num} className="bg-white px-5 py-5">
                <p className="mb-2 font-mono text-xs font-semibold text-sc-copper opacity-70 tracking-wider">{step.num}</p>
                <p className="mb-1.5 text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section aria-labelledby="audience-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">{c.audienceEyebrow}</p>
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

        {/* Free vs Pro */}
        <section aria-labelledby="fvp-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">{c.fvpEyebrow}</p>
          <h2 id="fvp-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.fvpTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 mb-5">
            <div className="bg-white px-6 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 flex items-center gap-2">
                {c.fvpFreeLabel}
                <span className="rounded px-2 py-0.5 text-[10px] font-semibold bg-orange-50 text-sc-copper">{c.fvpFreeTag}</span>
              </p>
              <ul className="flex flex-col gap-2.5">
                {c.fvpFreeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-sc-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
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
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-sc-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/pro-tools" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C45A2C] transition-colors">
              {c.fvpCta} <span aria-hidden="true">→</span>
            </Link>
            <span className="text-xs text-slate-400">{c.fvpNote}</span>
          </div>
        </section>

        {/* Internal link hub */}
        <section aria-labelledby="internal-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">{c.internalEyebrow}</p>
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">{c.trustEyebrow}</p>
          <h2 id="trust-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">{c.trustTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {c.trustItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4">
                <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-sc-copper opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                <p className="text-xs text-slate-500 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="py-12 border-t border-slate-100 pb-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">{c.faqEyebrow}</p>
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
              groups={[...buildCoreHubCrawlGroups(), ...buildFreeToolsCrawlGroups()]}
            />
          </Container>
        </section>
      ) : null}
    </PageLayout>
  );
}
