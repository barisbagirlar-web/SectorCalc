import { getTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { listPublishedCaseStudies } from "@/lib/features/case-studies/published-case-study-locale";

export type AcademicBreadcrumbItem = {
  readonly label: string;
  readonly href?: "/" | "/case-studies";
};

type AcademicDatabaseChromeProps = {
  readonly locale: string;
  readonly breadcrumb: readonly AcademicBreadcrumbItem[];
  readonly children: React.ReactNode;
};

export async function AcademicDatabaseChrome({
  locale,
  breadcrumb,
  children,
}: AcademicDatabaseChromeProps) {
  const t = await getTranslations("caseStudies.database");
  const totalCases = listPublishedCaseStudies(locale).length;
  const updatedOn = new Date().toLocaleDateString(locale);

  return (
    <div className="academic-database">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        {breadcrumb.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            {index > 0 ? <span className="sep">/</span> : null}
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </span>
        ))}
      </nav>

      <div className="authority-bar">
        <div className="authority-line-1">{t("authorityLine1")}</div>
        <div className="authority-line-2">
          {t("authorityLine2", { date: updatedOn, total: totalCases })}
        </div>
      </div>

      {children}
    </div>
  );
}
