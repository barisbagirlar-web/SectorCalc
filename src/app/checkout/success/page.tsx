import { getTranslations } from "next-intl/server";
// @ts-nocheck
import type { Metadata } from "next";
import Link  from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import { resolveSafeReturnPath } from "@/lib/billing/billing-config";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ return?: string; session_id?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return createPageMetadata({
    title: "successTitle",
    description: "successText",
    path: "/checkout/success",
    locale: locale as "en",
  });
}

export default async function CheckoutSuccessPage({ params, searchParams }: PageProps) {
  const locale = "en";
  const { return: returnParam, session_id: sessionId } = await searchParams;
  
  const t = await getTranslations();
  const returnPath = resolveSafeReturnPath(returnParam);
  const hasSessionReference = typeof sessionId === "string" && sessionId.trim().length > 0;

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container max-w-xl">
          <p className="sc-pro-eyebrow">{"successEyebrow"}</p>
          <h1 className="sc-pro-title sc-pro-title--compact">{"successTitle"}</h1>
          <p className="sc-pro-lead mt-4 text-sm leading-relaxed">{"successText"}</p>
          {hasSessionReference ? (
            <p className="mt-3 text-xs text-[var(--sc-text-muted)]">{"successRefreshNote"}</p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={returnPath} className="sc-cta-primary inline-flex min-h-[48px] items-center justify-center">
              {"successPrimaryCta"}
            </Link>
            <Link
              href="/premium-tools"
              className="sc-cta-secondary inline-flex min-h-[48px] items-center justify-center"
            >
              {"successPremiumCta"}
            </Link>
            <Link
              href="/pricing"
              className="sc-cta-secondary inline-flex min-h-[48px] items-center justify-center"
            >
              {"successSecondaryCta"}
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
