import { Link } from "@/i18n/routing";
import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  academicRoleTranslationKey,
  getAcademicAdvisoryBoardMembers,
  resolveAcademicTeamProfilePath,
} from "@/lib/infrastructure/seo/academic-team-pages";

export async function AcademicAdvisoryBoardSection() {
  const t = await getTranslations("seoAuthority");
  const members = getAcademicAdvisoryBoardMembers();

  return (
    <section
      className="border-t border-gray-100 bg-white py-10 sm:py-12"
      aria-labelledby="academic-advisory-board-heading"
    >
      <div className="mx-auto max-w-5xl px-4">
        <h2 id="academic-advisory-board-heading" className="text-xl font-semibold text-text-primary sm:text-2xl">
          {t("aboutAdvisoryBoardTitle")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
          {t("aboutAdvisoryBoardLead")}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((person) => {
            const roleLabel = t(academicRoleTranslationKey(person.role));
            const teamPath = resolveAcademicTeamProfilePath(person);
            const cardBody = (
              <>
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-deep-navy"
                  aria-hidden="true"
                >
                  {person.name
                    .split(" ")
                    .filter((part) => /^[A-Za-z]/.test(part))
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("")}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-text-primary">{person.name}</h3>
                  <p className="mt-0.5 text-xs text-text-secondary">{person.affiliation}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                    {roleLabel}
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    {t("mathSciNetMrBadge", { mrId: person.mrId })}
                  </p>
                </div>
              </>
            );

            if (teamPath) {
              return (
                <li key={person.id}>
                  <Link
                    href={teamPath}
                    className="group flex min-h-[44px] items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-deep-navy/20 hover:shadow-sm"
                  >
                    {cardBody}
                  </Link>
                </li>
              );
            }

            return (
              <li key={person.id}>
                <a
                  href={person.profileUrl ?? person.mathSciNetUrl}
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="group flex min-h-[44px] items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-deep-navy/20 hover:shadow-sm"
                >
                  {cardBody}
                  <ExternalLink
                    className="ml-auto h-4 w-4 shrink-0 text-text-secondary opacity-70"
                    aria-hidden="true"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
