export const dynamic = "force-dynamic";
import { getTranslations } from "@/lib/i18n-stub";

import type { Metadata } from "next";
import { BetaPartnerForm } from "@/components/benchmarks/BetaPartnerForm";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("betaPartner");
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/beta-partner",
  });
}

export default async function BetaPartnerPage({ params }: PageProps) {
  const locale = "en";
  
  const t = await getTranslations("betaPartner");

  return (
    <PageLayout>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <section className="sc-beta-partner py-10 md:py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="space-y-8">
              <article>
                <h2 className="text-lg font-bold text-deep-navy">{t("who.title")}</h2>
                <ul className="mt-3 space-y-2 text-sm text-body-charcoal">
                  <li>{t("who.item1")}</li>
                  <li>{t("who.item2")}</li>
                  <li>{t("who.item3")}</li>
                  <li>{t("who.item4")}</li>
                </ul>
              </article>

              <article>
                <h2 className="text-lg font-bold text-deep-navy">{t("data.title")}</h2>
                <ul className="mt-3 space-y-2 text-sm text-body-charcoal">
                  <li>{t("data.item1")}</li>
                  <li>{t("data.item2")}</li>
                  <li>{t("data.item3")}</li>
                </ul>
              </article>

              <article>
                <h2 className="text-lg font-bold text-deep-navy">{t("benefits.title")}</h2>
                <ul className="mt-3 space-y-2 text-sm text-body-charcoal">
                  <li>{t("benefits.item1")}</li>
                  <li>{t("benefits.item2")}</li>
                  <li>{t("benefits.item3")}</li>
                </ul>
              </article>
            </div>

            <div className="rounded-lg border border-slate/20 bg-white p-5 sm:p-8">
              <h2 className="text-lg font-bold text-deep-navy">{t("form.heading")}</h2>
              <p className="mt-2 text-sm text-body-charcoal">{t("form.intro")}</p>
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
