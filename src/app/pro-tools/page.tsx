import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
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
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { buildPremiumToolsCrawlGroups, buildCoreHubCrawlGroups } from "@/lib/seo/crawl-index";
import { shouldRenderCrawlIndexForLocale } from "@/lib/i18n/catalog-labels-i18n";
import { buildItemListJsonLd } from "@/lib/seo/schema-mesh";
import { resolveToolCategory } from "@/lib/catalog/resolve-tool-category";
import { getGlobalCategoryBySlug } from "@/lib/catalog/global-tool-category-taxonomy";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

function loadToolList() {
  const p = path.join(process.cwd(), "data", "pro-tools", "_merged.json");
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return [];
  }
}

function buildCollectionPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pro & Premium Decision Calculators | SectorCalc",
    description:
      "Advanced professional decision analysis tool directory designed for business, manufacturing, engineering, and financial decisions.",
    url: "https://sectorcalc.com/pro-tools",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "SectorCalc",
      url: "https://sectorcalc.com",
    },
  };
}

const META = {
  title: "Pro & Premium Decision Calculators | SectorCalc",
  description:
    "Advanced professional decision analysis tools for business, manufacturing, engineering, and financial decisions.",
} as const;

const HERO = {
  badge: "Pro / Premium Decision Tools",
  lead: "Advanced professional decision analysis tools for business, manufacturing, engineering, and financial decisions.",
  sub: "SectorCalc Pro delivers an industrial-grade decision support platform with precision input parameters, tolerance ranges, scenario comparisons, decision analysis, and PDF report output.",
  ctaFree: "Explore free calculators",
  ctaIndustries: "Browse tools by industry",
} as const;

const STATS = {
  tools: "active pro tools",
  sectors: "industry sectors",
} as const;

const INTENTS = {
  label: "What premium decision problem do you need to solve?",
  items: [
    { label: "Calculate OEE, waste and downtime losses on a production line", cat: "Lean & OEE" },
    { label: "Calculate CNC machining, machine hour rate, and subcontract margin", cat: "Engineering & Quoting" },
    { label: "Calculate project finance, ROI and depreciation", cat: "Investment & Finance" },
    { label: "Analyze sustainability, ESG and facility carbon footprint", cat: "Energy & Carbon" },
    { label: "Analyze supply chain costs, route optimization and logistics", cat: "Route & Logistics" },
    { label: "Calculate site quantities, material strength and field planning", cat: "Construction & Field" },
  ],
} as const;

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: META.title,
    description: META.description,
    path: "/pro-tools",
    locale: "en",
  });
}

export default async function ProToolsPage() {
  const locale = "en";

  const mergedTools = loadToolList();

  const tools: SearchablePremiumTool[] = mergedTools.map((tool: any) => {
    const categorySlug = resolveToolCategory({
      slug: tool.tool_id,
      title: tool.tool_name,
      description: tool.category,
      premiumSchemaCategory: tool.category,
    });
    const categoryObj = getGlobalCategoryBySlug(categorySlug);
    const categoryLabel = categoryObj ? categoryObj.enTitle : (tool.category || "");

    return {
      slug: tool.tool_id,
      title: tool.tool_name,
      description: `${tool.category} — ${tool.engine_rules?.standards?.join(", ") || ""} referenced.`,
      categorySlug,
      categoryLabel,
      routePath: `/pro-tools/${tool.tool_id}`,
      isActive: true,
      searchTerms: [tool.tool_id.toLowerCase(), tool.tool_name.toLowerCase(), tool.category.toLowerCase(), categoryLabel.toLowerCase()],
      aliases: [],
      keywords: tool.engine_rules?.standards || [],
    };
  });

  const categoriesMap = new Map<string, { title: string; count: number }>();
  tools.forEach((t) => {
    const slug = t.categorySlug;
    const existing = categoriesMap.get(slug);
    if (existing) {
      existing.count++;
    } else {
      categoriesMap.set(slug, { title: t.categoryLabel || "", count: 1 });
    }
  });

  const categories: SearchablePremiumCategory[] = [...categoriesMap.entries()].map(([slug, item]) => ({
    slug,
    title: item.title,
    count: item.count,
  }));

  const totalPremium = tools.length;


  const jsonLd = [
    await buildLocalizedBreadcrumbJsonLd(
      [
        { key: "home", path: "/" },
        { key: "premiumTools", path: "/pro-tools" },
      ],
      locale
    ),
    buildItemListJsonLd(
      tools.map((tool) => ({
        name: tool.title,
        path: tool.routePath ?? `/pro-tools/${tool.slug}`,
      })),
      "Pro & Premium Decision Calculators",
      locale
    ),
    buildCollectionPageJsonLd(),
  ];

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
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true" className="text-slate-300">›</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-slate-600 font-medium" itemProp="name" aria-current="page">Pro Calculators</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">
            {HERO.badge}
          </p>
          <h1 className="sc-pro-title sc-pro-title--compact">Pro & Premium Decision Calculators</h1>
          <p className="sc-pro-lead max-w-2xl">{HERO.lead}</p>
          <p className="mt-2 text-sm text-slate-500 max-w-xl leading-relaxed">{HERO.sub}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/free-tools" className="text-sm font-medium text-sc-copper hover:underline underline-offset-2 flex items-center gap-1">
              {HERO.ctaFree} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/industries" className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline underline-offset-2 flex items-center gap-1">
              {HERO.ctaIndustries} <span aria-hidden="true">→</span>
            </Link>
          </div>
          {/* Stats bar */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-semibold tracking-tight text-slate-900">{totalPremium}</span>
              <span className="text-xs text-slate-400">{STATS.tools}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-200" aria-hidden="true" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-semibold tracking-tight text-slate-900">18</span>
              <span className="text-xs text-slate-400">{STATS.sectors}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Intent / Quick navigation */}
      <section aria-label={INTENTS.label} className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-5 py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{INTENTS.label}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {INTENTS.items.map((intent) => (
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

      {/* Catalog Search & Grid */}
      <section className="bg-[#F0EEE6] py-16 border-b border-[#1A1915]/10" id="tools-list">
        <Container size="wide" className="min-w-0">
          <div className="bg-transparent rounded-2xl overflow-hidden">
            <PremiumCatalogSearch tools={tools} categories={categories} />
          </div>
        </Container>
      </section>

      {/* Post-catalog SEO content */}
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-5">

        {/* How it works */}
        <section aria-labelledby="how-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">Methodology & Decision Support</p>
          <h2 id="how-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">How do SectorCalc Pro decision tools work?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
            {[
              { num: "01", title: "Enter precision parameters", desc: "Set sector-standard tolerances, hourly rates, and detailed input parameters." },
              { num: "02", title: "Run decision algorithms", desc: "Trigger engineering and financial rules that are transparent — no black boxes." },
              { num: "03", title: "Compare scenarios", desc: "Simulate optimistic, pessimistic, and neutral scenarios side by side." },
              { num: "04", title: "Get a PDF decision report", desc: "Download a professional analysis report ready for clients or management." },
            ].map((step) => (
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">User Profiles</p>
          <h2 id="audience-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">Who are SectorCalc Pro tools designed for?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { title: "Plant & Production Managers", desc: "Minimize OEE losses, plan capacity, and optimize machine-labor hour costs." },
              { title: "CFOs & Finance Executives", desc: "Accurate depreciation, margin control, financial risk analysis, and investment profitability." },
              { title: "Engineers & Technical Leaders", desc: "Design limits, standard time calculations, and facility consumption efficiency." },
              { title: "Business Development & Sales", desc: "Minimize margin risk when preparing pricing proposals and transparent quote tables." },
              { title: "Management Consultants & Analysts", desc: "Validate feasibility studies and waste (muda) analyses for clients." },
              { title: "Logistics & Operations Leaders", desc: "Precision decisions for freight, warehouse, and supply chain optimization." },
              { title: "Energy & Sustainability Specialists", desc: "ESG compliance, carbon emissions, and facility energy intensity calculations." },
              { title: "Contractors & Site Coordinators", desc: "Large-scale site quantity takeoffs and structural design tolerance checks." },
            ].map((aud) => (
              <div key={aud.title} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="mb-1 text-sm font-semibold text-slate-900">{aud.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{aud.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Free vs Pro comparison */}
        <section aria-labelledby="fvp-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">Feature Comparison</p>
          <h2 id="fvp-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">Free vs Pro — what are the differences?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 mb-5">
            <div className="bg-white px-6 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 flex items-center gap-2">
                Free Tools
                <span className="rounded px-2 py-0.5 text-[10px] font-semibold bg-orange-50 text-sc-copper">Quick Pre-Calculation</span>
              </p>
              <ul className="flex flex-col gap-2.5">
                {["Instant quick calculation output", "Basic formula display", "Single-tool interface", "No registration or login required"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-sc-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white px-6 py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 flex items-center gap-2">
                Pro Decision Tools
                <span className="rounded px-2 py-0.5 text-[10px] font-semibold bg-slate-900 text-white">Professional Decision Report</span>
              </p>
              <ul className="flex flex-col gap-2.5">
                {["Advanced input set with tolerance control", "Scenario comparison and sensitivity analysis", "Professional PDF decision report download", "Sector-specific interpretation and decision summaries"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-sc-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C45A2C] transition-colors">
              Activate Pro Access <span aria-hidden="true">→</span>
            </Link>
            <span className="text-xs text-slate-400">Instant and unlimited access to {totalPremium} Pro tools</span>
          </div>
        </section>

        {/* Internal link hub */}
        <section aria-labelledby="internal-title" className="py-12 border-t border-slate-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">Quick Access</p>
          <h2 id="internal-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">Continue with SectorCalc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { label: "Free calculators", sub: "Quick pre-calculation and basic formula tools", href: "/free-tools" },
              { label: "Tools by industry", sub: "Calculators grouped by industry sector", href: "/industries" },
              { label: "Pricing plans", sub: "Subscription and credit-based access options", href: "/pricing" },
              { label: "Formula references", sub: "Formulas and scientific sources used in tools", href: "/methodology" },
              { label: "Sample decision report", sub: "Example Pro tool output and report structure", href: "/reports/sample-decision-report" },
            ].map((link) => (
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">Trust & Accuracy</p>
          <h2 id="trust-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">Engineering and financial calculation assurance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "Designed based on scientific and industry standards (ISO, ASME, IEC, GAAP).",
              "All calculation formulas and logic are shared transparently — no hidden calculations.",
              "Formula accuracy is continuously audited by automated test scenarios and oracles.",
              "Your inputs and report data are hosted on high-security servers.",
              "Results support your decision process; no tool provides investment or legal advice.",
              "The system automatically warns you when tolerance or out-of-range parameters are entered.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4">
                <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-sc-copper opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                <p className="text-xs text-slate-500 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="py-12 border-t border-slate-100 pb-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sc-copper opacity-80">FAQ</p>
          <h2 id="faq-title" className="mb-6 text-xl font-semibold text-slate-900 tracking-tight">Frequently asked questions about Pro calculators</h2>
          <div className="flex flex-col gap-1.5">
            {[
              { q: "How do Pro tools differ from free ones?", a: "Pro tools offer advanced inputs, tolerance limits, scenario comparison, and PDF report output for critical business decisions." },
              { q: "How can I get calculation results as a report?", a: "After completing your calculation, click the 'Download PDF Report' button to generate a professionally designed PDF containing input parameters, formula explanations, and result charts." },
              { q: "Can I trust the formulas used in the calculations?", a: "Yes. All Pro formulas on SectorCalc are based on global engineering standards, financial rules, and academic methodologies. Formulas are transparent and clearly displayed under each tool." },
              { q: "How do I compare multiple scenarios?", a: "The Pro interface includes 'Add Scenario' or 'Compare' features, allowing you to modify input parameters, create alternative scenarios, and analyze them side by side." },
              { q: "What are the cancellation and subscription terms?", a: "You can cancel your Pro subscription with one click from your member panel at any time. Your Pro access continues until the end of the billing period." },
            ].map((faq, i) => (
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
              groups={[...buildCoreHubCrawlGroups(), ...buildPremiumToolsCrawlGroups()]}
            />
          </Container>
        </section>
      ) : null}
    </PageLayout>
  );
}
