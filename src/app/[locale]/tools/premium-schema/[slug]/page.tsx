import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DynamicPremiumCalculator } from "@/components/tools/DynamicPremiumCalculator";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import {
  getPremiumSchemaBySlug,
  listPremiumSchemaSlugs,
} from "@/lib/premium-schema/schemas/index";

interface PremiumSchemaPageParams {
  slug: string;
}

interface PremiumSchemaRouteParams extends PremiumSchemaPageParams {
  locale: string;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<PremiumSchemaPageParams[]> {
  return listPremiumSchemaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PremiumSchemaRouteParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const schema = getPremiumSchemaBySlug(slug);
  if (!schema) {
    return {};
  }

  return createPageMetadata({
    title: `${schema.name} | SectorCalc`,
    description: schema.painStatement,
    path: `/tools/premium-schema/${schema.id}`,
    locale: locale as AppLocale,
  });
}

export default async function PremiumSchemaPilotPage({
  params,
}: {
  params: Promise<PremiumSchemaRouteParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const schema = getPremiumSchemaBySlug(slug);
  if (!schema) {
    notFound();
  }

  return (
    <PageLayout>
      <section className="border-b border-technical-gray bg-surface-cream">
        <Container className="py-8 sm:py-10">
          <p className="sc-ledger-eyebrow">Premium schema pilot</p>
          <h1 className="mt-2 text-2xl font-semibold text-premium-velvet sm:text-3xl">
            {schema.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-body-charcoal sm:text-base">
            {schema.painStatement}
          </p>
        </Container>
      </section>
      <Container className="pb-12 pt-6 sm:pb-16">
        <DynamicPremiumCalculator schema={schema} />
      </Container>
    </PageLayout>
  );
}
