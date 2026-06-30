import { ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import type { AcademicReference } from "@/lib/seo/academic-references";

export type AcademicTeamProfileSectionProps = {
  readonly profile: AcademicReference;
  readonly roleLabel: string;
  readonly bio: string;
  readonly academicProfileHeading: string;
  readonly mathSciNetProfileHeading: string;
  readonly mathSciNetMrLink: string;
  readonly externalProfileLabel: string;
};

export function AcademicTeamProfileSection({
  profile,
  roleLabel,
  bio,
  academicProfileHeading,
  mathSciNetProfileHeading,
  mathSciNetMrLink,
  externalProfileLabel,
}: AcademicTeamProfileSectionProps) {
  const initials = profile.name
    .split(" ")
    .filter((part) => part.length > 0 && /^[A-Za-z]/.test(part))
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <PageLayout>
      <section className="bg-white py-16 sm:py-24">
        <Container size="wide">
          <article className="mx-auto max-w-3xl rounded-xl border border-gray-100 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-deep-navy"
                aria-hidden="true"
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{roleLabel}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                  {profile.name}
                </h1>
                <p className="mt-2 text-sm text-text-secondary">{profile.affiliation}</p>
                <a
                  href={profile.mathSciNetUrl}
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-navy underline underline-offset-2"
                >
                  {mathSciNetMrLink}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="mt-8 space-y-6 border-t border-gray-100 pt-8">
              <section>
                <h2 className="text-lg font-semibold text-text-primary">{academicProfileHeading}</h2>
                <p className="mt-3 text-base leading-relaxed text-text-secondary">{bio}</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-text-primary">{mathSciNetProfileHeading}</h2>
                <p className="mt-3">
                  <a
                    href={profile.mathSciNetUrl}
                    target="_blank"
                    rel="author noopener noreferrer"
                    className="break-all text-sm font-medium text-deep-navy underline underline-offset-2"
                  >
                    {profile.mathSciNetUrl}
                  </a>
                </p>
              </section>

              {profile.profileUrl ? (
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="author noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-sm font-semibold text-deep-navy underline underline-offset-2"
                >
                  {externalProfileLabel}
                </a>
              ) : null}
            </div>
          </article>
        </Container>
      </section>
    </PageLayout>
  );
}
