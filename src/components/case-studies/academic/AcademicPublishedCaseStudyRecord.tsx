import { getTranslations } from "@/lib/i18n-stub";
import { Link } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  formatEuroAmount,
  resolveCaseStudySavingsEur,
} from "@/lib/features/case-studies/academic-database";
import {
  formatAcademicDate,
  getLocalizedDuration,
  renderCaseStudyBodyContent,
} from "@/lib/features/case-studies/academic-format";
import { buildCaseStudyJsonLd } from "@/lib/features/case-studies/case-study-seo";
import type { CaseStudy } from "@/lib/features/case-studies/types";
import { resolveGeneratedToolPath } from "@/lib/features/tools/paths";
import { AcademicDatabaseChrome } from "@/components/case-studies/academic/AcademicDatabaseChrome";

type Props = {
  readonly study: CaseStudy;
  readonly locale: string;
};

export async function AcademicPublishedCaseStudyRecord({ study, locale }: Props) {
  const t = await getTranslations("caseStudies.database");
  const tCase = await getTranslations("caseStudies");
  const savingsEur = resolveCaseStudySavingsEur(study);
  const company = study.testimonial?.company ?? t("unspecified");
  const challengeContent = renderCaseStudyBodyContent(study.challenge);
  const solutionContent = renderCaseStudyBodyContent(study.solution);

  return (
    <AcademicDatabaseChrome
      locale={locale}
      breadcrumb={[
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbCurrent"), href: "/case-studies" },
        { label: company },
      ]}
    >
      <div className="record-meta">
        <table className="record-meta-table">
          <tbody>
            <tr>
              <th>{t("metaRecordId")}</th>
              <td>{study.id ?? study.slug}</td>
            </tr>
            <tr>
              <th>{t("colCompany")}</th>
              <td>{company}</td>
            </tr>
            <tr>
              <th>{t("colCity")}</th>
              <td>{study.city ?? t("emDash")}</td>
            </tr>
            <tr>
              <th>{t("colCountry")}</th>
              <td>{study.country ?? t("unspecified")}</td>
            </tr>
            <tr>
              <th>{t("colIndustry")}</th>
              <td>{study.industry}</td>
            </tr>
            <tr>
              <th>{t("colProjectDuration")}</th>
              <td>{getLocalizedDuration(study.projectDuration ?? "", locale) || t("emDash")}</td>
            </tr>
            <tr>
              <th>{t("metaPublished")}</th>
              <td>{formatAcademicDate(study.publishedAt, locale)}</td>
            </tr>
            <tr>
              <th>{t("metaReadTime")}</th>
              <td>{tCase("readTime", { count: study.readTime })}</td>
            </tr>
            <tr>
              <th>{t("colSavings")}</th>
              <td>{formatEuroAmount(savingsEur, locale)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <article className="record-body">
        <h1 className="record-title">{study.title}</h1>
        <p className="record-subtitle">{study.subtitle}</p>

        <section className="record-section">
          <h2>{tCase("challengeHeading")}</h2>
          {challengeContent.mode === "html" ? (
            <div
              className="record-rich-text"
              dangerouslySetInnerHTML={{ __html: challengeContent.html ?? "" }}
            />
          ) : (
            challengeContent.paragraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))
          )}
        </section>

        <section className="record-section">
          <h2>{tCase("solutionHeading")}</h2>
          {solutionContent.mode === "html" ? (
            <div
              className="record-rich-text"
              dangerouslySetInnerHTML={{ __html: solutionContent.html ?? "" }}
            />
          ) : (
            solutionContent.paragraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))
          )}
        </section>

        <section className="record-section">
          <h2>{tCase("resultsHeading")}</h2>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("resultsMetric")}</th>
                  <th>{t("colBefore")}</th>
                  <th>{t("colAfter")}</th>
                </tr>
              </thead>
              <tbody>
                {study.results.map((result) => (
                  <tr key={result.metric}>
                    <td>{result.metric}</td>
                    <td className="numeric">{result.before}</td>
                    <td className="numeric">{result.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="record-section">
          <h2>{tCase("toolsUsed")}</h2>
          <ul className="record-tools">
            {study.tools.map((tool) => (
              <li key={tool}>
                <Link href={resolveGeneratedToolPath(tool)}>{tool.replace(/-/g, " ")}</Link>
              </li>
            ))}
          </ul>
        </section>

        {study.testimonial ? (
          <section className="record-section">
            <h2>{t("sectionStatement")}</h2>
            <blockquote className="record-blockquote">
              <p>&ldquo;{study.testimonial.quote}&rdquo;</p>
              <footer className="record-attribution">
                {study.testimonial.author}, {study.testimonial.title}, {study.testimonial.company}
              </footer>
            </blockquote>
          </section>
        ) : null}

        <p className="record-footnote">{tCase("publishedDisclaimer")}</p>
      </article>

      <div className="record-nav">
        <Link href="/case-studies">{t("backToIndex")}</Link>
      </div>

      <JsonLd data={buildCaseStudyJsonLd(study, locale)} />
    </AcademicDatabaseChrome>
  );
}
