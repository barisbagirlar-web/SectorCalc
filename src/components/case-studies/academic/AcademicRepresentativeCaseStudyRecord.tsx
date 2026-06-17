import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AcademicDatabaseChrome } from "@/components/case-studies/academic/AcademicDatabaseChrome";
import {
  getCaseStudyToolHref,
  type CaseStudyEntry,
} from "@/lib/case-studies/case-study-types";

type Props = {
  readonly entry: CaseStudyEntry;
  readonly locale: string;
};

export async function AcademicRepresentativeCaseStudyRecord({ entry, locale }: Props) {
  const t = await getTranslations("caseStudies.database");
  const tCase = await getTranslations("caseStudies");
  const toolHref = getCaseStudyToolHref(entry);

  return (
    <AcademicDatabaseChrome
      locale={locale}
      breadcrumb={[
        { label: t("breadcrumbHome"), href: "/" },
        { label: t("breadcrumbCurrent"), href: "/case-studies" },
        { label: entry.title },
      ]}
    >
      <div className="record-meta">
        <table className="record-meta-table">
          <tbody>
            <tr>
              <th>{t("metaRecordId")}</th>
              <td>{entry.slug}</td>
            </tr>
            <tr>
              <th>{t("colIndustry")}</th>
              <td>{entry.sectorLabel}</td>
            </tr>
            <tr>
              <th>{t("metaEvidenceLevel")}</th>
              <td>{t("representativeLabel")}</td>
            </tr>
            <tr>
              <th>{t("metaRelatedTool")}</th>
              <td>{entry.toolTitle}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <article className="record-body">
        <h1 className="record-title">{entry.title}</h1>
        <p className="record-subtitle">{tCase("representativeNote")}</p>

        <section className="record-section">
          <h2>{tCase("problem")}</h2>
          <p>{entry.problem}</p>
        </section>

        <section className="record-section">
          <h2>{tCase("inputSet")}</h2>
          <ul className="record-tools">
            {entry.inputSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="record-section">
          <h2>{tCase("hiddenLoss")}</h2>
          <p>{entry.hiddenLoss}</p>
          <p>{entry.lossTypeLabel}</p>
        </section>

        <section className="record-section">
          <h2>{tCase("calculationResult")}</h2>
          <p>{entry.calculationResult}</p>
          <p>{entry.calculationLogic}</p>
        </section>

        <section className="record-section">
          <h2>{tCase("suggestedAction")}</h2>
          <p>{entry.suggestedAction}</p>
          <p>
            {tCase("estimatedImpact")}: {entry.expectedImpact}
          </p>
        </section>

        <section className="record-section">
          <h2>{tCase("methodologyNote")}</h2>
          <p>{entry.methodologyNote}</p>
          <ul className="record-tools">
            {entry.assumptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="record-section">
          <h2>{t("metaRelatedTool")}</h2>
          <p>
            <Link href={toolHref}>{entry.toolTitle}</Link>
          </p>
        </section>

        <p className="record-footnote">{entry.disclaimer}</p>
      </article>

      <div className="record-nav">
        <Link href="/case-studies">{t("backToIndex")}</Link>
      </div>
    </AcademicDatabaseChrome>
  );
}
