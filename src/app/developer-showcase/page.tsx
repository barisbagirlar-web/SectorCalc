export const dynamic = "force-dynamic";
import { getTranslations } from "@/lib/i18n-stub";

import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildDeveloperShowcaseSchema } from "@/lib/features/semantic/build-developer-showcase-schema";
import { buildHomeJsonLd } from "@/lib/features/semantic/build-home-jsonld";
import { pickLocaleText } from "@/lib/features/semantic/semantic-locale-utils";
import { listSemanticToolContracts } from "@/lib/features/semantic/semantic-tool-reader";
import { absoluteUrl } from "@/lib/features/semantic/site-url";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations("developerShowcase");
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/developer-showcase",
    locale: locale as "en",
  });
}

export default async function DeveloperShowcasePage({ params }: PageProps) {
  const locale = "en";
  
  const t = await getTranslations();
  const tools = listSemanticToolContracts()
    .filter((tool) => tool.isPublic)
    .sort((a, b) => a.toolSlug.localeCompare(b.toolSlug));

  const jsonLd = [...buildHomeJsonLd(locale).slice(0, 2), buildDeveloperShowcaseSchema(locale)];

  return (
    <PageLayout>
      <SemanticJsonLd data={jsonLd} />
      <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{"eyebrow"}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{"title"}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">{"intro"}</p>
        </Container>
      </section>

      <section className="py-10">
        <Container className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
            <h2 className="text-lg font-semibold text-slate-900">{"semantic.title"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{"semantic.body"}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>{"semantic.item1"}</li>
              <li>{"semantic.item2"}</li>
              <li>{"semantic.item3"}</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">{"resources.title"}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={absoluteUrl("/llms.txt")} className="font-medium text-blue-700 hover:underline">
                  llms.txt
                </a>
              </li>
              <li>
                <a href={absoluteUrl("/ai.txt")} className="font-medium text-blue-700 hover:underline">
                  ai.txt
                </a>
              </li>
              <li>
                <a href={absoluteUrl("/sitemap.xml")} className="font-medium text-blue-700 hover:underline">
                  sitemap.xml
                </a>
              </li>
              <li>
                <Link href="/calculator-library" className="font-medium text-blue-700 hover:underline">
                  {"resources.library"}
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">{"resources.note"}</p>
          </article>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-10">
        <Container>
          <h2 className="text-xl font-semibold text-slate-900">{"index.title"}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-700">{"index.body"}</p>
          <p className="mt-3 text-xs text-slate-500">
            index.count: {tools.length}
          </p>
          <div className="mt-6 space-y-4">
            {tools.map((tool) => (
              <article
                key={`${tool.tier}:${tool.toolSlug}`}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {pickLocaleText(tool.title, locale)}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                      {tool.tier} · {tool.archetype}
                    </p>
                  </div>
                  <Link
                    href={tool.urlPath}
                    className="text-sm font-medium text-blue-700 hover:underline"
                  >
                    {tool.toolSlug}
                  </Link>
                </div>
                <p className="mt-3 text-sm text-slate-700">{pickLocaleText(tool.description, locale)}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">input</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {tool.inputParameters.map((param) => (
                        <li key={param.key}>
                          <span className="font-medium">{param.key}</span>:{" "}
                          {pickLocaleText(param.label, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">output</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {tool.outputParameters.map((param) => (
                        <li key={param.key}>
                          <span className="font-medium">{param.key}</span>:{" "}
                          {pickLocaleText(param.label, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
