import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  filterCaseStudiesForDatabase,
  formatEuroAmount,
  getPrimaryResultRow,
  resolveCaseStudySavingsEur,
  type CaseStudyDatabaseFilters,
  type CaseStudySavingsBand,
} from "@/lib/features/case-studies/academic-database";
import {
  buildCaseStudyIndexJsonLd,
  buildCaseStudyIndexSummaryLine,
} from "@/lib/features/case-studies/case-study-seo";
import { listMergedPublishedCaseStudies } from "@/lib/features/case-studies/firestore-case-studies";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { addLocaleToPath } from "@/lib/infrastructure/i18n/locale-routing";
import { getLocalizedDuration } from "@/lib/features/case-studies/academic-format";
import "@/styles/academic-case-studies-database.css";

export const revalidate = 86400;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    industry?: string;
    country?: string;
    year?: string;
    savings?: string;
  }>;
};

function isSavingsBand(value: string | undefined): value is CaseStudySavingsBand {
  return value === "0-100k" || value === "100k-500k" || value === "500k-1m" || value === "1m+";
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const query = await searchParams;
  const hasFilters = query.industry || query.country || query.year || query.savings;
  const t = await getTranslations({ locale, namespace: "caseStudies.database" });
  const meta = createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/case-studies",
    locale: locale as AppLocale,
  });
  if (hasFilters) {
    meta.robots = { index: false, follow: true };
  }
  return meta;
}

export default async function CaseStudiesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("caseStudies.database");
  const indexSummaryLabels = {
    lineSavingsOnly: (values: { company: string; savings: string }) =>
      t("indexSummaryLineSavingsOnly", values),
    lineWithMetric: (values: {
      company: string;
      metric: string;
      before: string;
      after: string;
      savings: string;
    }) => t("indexSummaryLineWithMetric", values),
  };
  const studies = await listMergedPublishedCaseStudies(locale);
  const filters: CaseStudyDatabaseFilters = {
    industry: query.industry ?? "",
    country: query.country ?? "",
    year: query.year ?? "",
    savings: isSavingsBand(query.savings) ? query.savings : "",
  };
  const filteredStudies = filterCaseStudiesForDatabase(studies, filters);

  const industries = [...new Set(studies.map((study) => study.industry))].filter(Boolean).sort();
  const countries = [...new Set(studies.map((study) => study.country).filter(Boolean))].sort(
    (a, b) => String(a).localeCompare(String(b), locale),
  );
  const years = [...new Set(studies.map((study) => study.publishedAt.slice(0, 4)))].filter(Boolean).sort();

  const updatedOn = new Date().toLocaleDateString(locale);
  const totalCases = studies.length;

  return (
    <PageLayout>
      <div className="academic-database">
        <header className="header">
          <div className="header-inner">
            <Link href="/" className="header-title">
              {t("headerTitle")}
            </Link>
          </div>
          <div className="header-line" />
        </header>

        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/">{t("breadcrumbHome")}</Link>
          <span className="sep">/</span>
          <span>{t("breadcrumbCurrent")}</span>
        </nav>

        <div className="filter-area">
          <form
            method="GET"
            action={addLocaleToPath("/case-studies", locale as SupportedLocale)}
            className="filter-form"
          >
            <div className="filter-group">
              <label htmlFor="industry">{t("filterIndustry")}</label>
              <select
                name="industry"
                id="industry"
                className="filter-select"
                defaultValue={filters.industry}
              >
                <option value="">{t("filterAll")}</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="country">{t("filterCountry")}</label>
              <select
                name="country"
                id="country"
                className="filter-select"
                defaultValue={filters.country}
              >
                <option value="">{t("filterAll")}</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="year">{t("filterYear")}</label>
              <select name="year" id="year" className="filter-select" defaultValue={filters.year}>
                <option value="">{t("filterAll")}</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="savings">{t("filterSavings")}</label>
              <select name="savings" id="savings" className="filter-select" defaultValue={filters.savings}>
                <option value="">{t("filterSavingsAll")}</option>
                <option value="0-100k">{t("filterSavings0To100k")}</option>
                <option value="100k-500k">{t("filterSavings100kTo500k")}</option>
                <option value="500k-1m">{t("filterSavings500kTo1m")}</option>
                <option value="1m+">{t("filterSavings1mPlus")}</option>
              </select>
            </div>
            <div className="filter-actions">
              <input type="submit" value={t("filterApply")} className="filter-submit" />
              <a href="/data/case-studies.csv" className="filter-csv">
                {t("filterCsv")}
              </a>
            </div>
          </form>
          <div className="filter-line" />
        </div>

        <section className="index-snippet-summary" aria-labelledby="case-studies-snippet-heading">
          <h1 id="case-studies-snippet-heading" className="index-snippet-heading">
            {t("indexSummaryHeading")}
          </h1>
          <p className="sc-featured-answer__answer index-snippet-intro">{t("indexSummaryIntro")}</p>
          <ul className="sc-featured-answer__list index-snippet-list">
            {studies.map((study) => (
              <li key={study.slug}>
                <Link href={`/case-studies/${study.slug}`}>
                  {buildCaseStudyIndexSummaryLine(study, locale, indexSummaryLabels)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("colIndex")}</th>
                <th>{t("colCompany")}</th>
                <th>{t("colCity")}</th>
                <th>{t("colCountry")}</th>
                <th>{t("colIndustry")}</th>
                <th>{t("colProjectDuration")}</th>
                <th>{t("colBefore")}</th>
                <th>{t("colAfter")}</th>
                <th>{t("colSavings")}</th>
                <th>{t("colYear")}</th>
                <th>{t("colDetail")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudies.length === 0 ? (
                <tr>
                  <td colSpan={11} className="empty-row">
                    {t("noResults")}
                  </td>
                </tr>
              ) : (
                filteredStudies.map((study, index) => {
                  const primaryResult = getPrimaryResultRow(study);
                  const savingsEur = resolveCaseStudySavingsEur(study);
                  const year = study.publishedAt.slice(0, 4);

                  return (
                    <tr key={study.id ?? study.slug}>
                      <td>{index + 1}</td>
                      <td>{study.testimonial?.company ?? t("unspecified")}</td>
                      <td>{study.city ?? t("emDash")}</td>
                      <td>{study.country ?? t("unspecified")}</td>
                      <td>{study.industry}</td>
                      <td>{study.projectDuration ? getLocalizedDuration(study.projectDuration, locale) : t("emDash")}</td>
                      <td className="numeric">{primaryResult?.before ?? t("emDash")}</td>
                      <td className="numeric">{primaryResult?.after ?? t("emDash")}</td>
                      <td className="numeric">{formatEuroAmount(savingsEur, locale)}</td>
                      <td>{year}</td>
                      <td>
                        <Link href={`/case-studies/${study.slug}`} className="table-link">
                          {t("detailLink")}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <JsonLd data={buildCaseStudyIndexJsonLd(studies, locale, t("indexSummaryHeading"))} />

        <div className="authority-bar">
          <div className="authority-line-1">{t("authorityLine1")}</div>
          <div className="authority-line-2">
            {t("authorityLine2", { date: updatedOn, total: totalCases })}
          </div>
        </div>

        <footer className="footer">
          <div className="footer-line" />
          <div className="footer-text">
            <div>{t("footerLine1")}</div>
            <div>{t("footerLine2")}</div>
            <div>
              {t("footerContact")}{" "}
              <a href="mailto:info@sectorcalc.com" className="footer-link">
                info@sectorcalc.com
              </a>
            </div>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
}
