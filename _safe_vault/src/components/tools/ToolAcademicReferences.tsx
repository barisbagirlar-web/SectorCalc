import { useTranslations } from "next-intl";
import { INDUSTRIAL_ACADEMIC_CITATIONS } from "@/config/academic-citations";

export function ToolAcademicReferences() {
  const t = useTranslations("seoAuthority");

  return (
    <div className="mt-8 border-t border-border-subtle pt-4 text-xs text-text-secondary">
      <p className="mb-1 font-medium text-text-primary">{t("academicReferencesTitle")}</p>
      <ul className="list-disc space-y-0.5 pl-4">
        {INDUSTRIAL_ACADEMIC_CITATIONS.map((citation) => (
          <li key={citation.id}>
            <a
              href={citation.doiUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="underline underline-offset-2 hover:text-deep-navy"
            >
              {citation.authors} ({citation.year}). {citation.title}. {citation.publisher}.
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
