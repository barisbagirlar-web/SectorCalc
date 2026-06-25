import { getTranslations } from "next-intl/server";
// @ts-nocheck
import type { Metadata } from "next";
import { BetaPartnerForm } from "@/components/benchmarks/BetaPartnerForm";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return createPageMetadata({
    title: "title",
    description: "description",
    path: "/beta-partner",
  });
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BetaPartnerPage({ params }: PageProps) {
  const locale = "en";
  
  const t = await getTranslations();

  return (
    <PageLayout>
      <PageHero
        eyebrow={"hero.eyebrow"}
        title={"hero.title"}
        subtitle={"hero.subtitle"}
      />

      <section className="sc-beta-partner py-10 md:py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="space-y-8">
              <article>
                <h2 className="text-lg font-bold text-deep-navy">{"who.title"}</h2>
                <ul className="mt-3 space-y-2 text-sm text-body-charcoal">
                  <li>{"who.item1"}</li>
                  <li>{"who.item2"}</li>
                  <li>{"who.item3"}</li>
                  <li>{"who.item4"}</li>
                </ul>
              </article>

              <article>
                <h2 className="text-lg font-bold text-deep-navy">{"data.title"}</h2>
                <ul className="mt-3 space-y-2 text-sm text-body-charcoal">
                  <li>{"data.item1"}</li>
                  <li>{"data.item2"}</li>
                  <li>{"data.item3"}</li>
                </ul>
              </article>

              <article>
                <h2 className="text-lg font-bold text-deep-navy">{"benefits.title"}</h2>
                <ul className="mt-3 space-y-2 text-sm text-body-charcoal">
                  <li>{"benefits.item1"}</li>
                  <li>{"benefits.item2"}</li>
                  <li>{"benefits.item3"}</li>
                </ul>
              </article>
            </div>

            <div className="rounded-lg border border-slate/20 bg-white p-5 sm:p-8">
              <h2 className="text-lg font-bold text-deep-navy">{"form.heading"}</h2>
              <p className="mt-2 text-sm text-body-charcoal">{"form.intro"}</p>
              <div className="mt-6">
                <BetaPartnerForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
