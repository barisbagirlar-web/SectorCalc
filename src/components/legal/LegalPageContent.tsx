import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

interface LegalSection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

interface LegalPageContentProps {
  title: string;
  intro: string;
  sections: LegalSection[];
  footerNote?: ReactNode;
}

export function LegalPageContent({
  title,
  intro,
  sections,
  footerNote,
}: LegalPageContentProps) {
  return (
    <section className="bg-bg-subtle py-12 md:py-16">
      <Container size="narrow">
        <article className="rounded-2xl border border-border-subtle bg-white p-6 shadow-card sm:p-10">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">{intro}</p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-bold text-text-primary">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.list ? (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          {footerNote ? (
            <div className="mt-10 border-t border-border-subtle pt-6 text-sm text-slate">
              {footerNote}
            </div>
          ) : null}
        </article>
      </Container>
    </section>
  );
}
