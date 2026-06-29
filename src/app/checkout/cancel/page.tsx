export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";
import Link  from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import { resolveSafeReturnPath } from "@/lib/billing/billing-config";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ return?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return createPageMetadata({
    title: "cancelTitle",
    description: "cancelText",
    path: "/checkout/cancel",
    locale: locale as "en",
  });
}

export default async function CheckoutCancelPage({ params, searchParams }: PageProps) {
  const locale = "en";
  const { return: returnParam } = await searchParams;
  
  const t = await getTranslations();
  const returnPath = resolveSafeReturnPath(returnParam);

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container max-w-xl">
          <p className="sc-pro-eyebrow">{"cancelEyebrow"}</p>
          <h1 className="sc-pro-title sc-pro-title--compact">{"cancelTitle"}</h1>
          <p className="sc-pro-lead mt-4 text-sm leading-relaxed">{"cancelText"}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/pricing" className="sc-cta-primary inline-flex min-h-[48px] items-center justify-center">
              {"cancelPricingCta"}
            </Link>
            <Link
              href={returnPath}
              className="sc-cta-secondary inline-flex min-h-[48px] items-center justify-center"
            >
              {"cancelReturnCta"}
            </Link>
            <Link
              href="/free-tools"
              className="sc-cta-secondary inline-flex min-h-[48px] items-center justify-center"
            >
              {"cancelFreeCta"}
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
