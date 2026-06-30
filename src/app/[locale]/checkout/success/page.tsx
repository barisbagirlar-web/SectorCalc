export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import { resolveSafeReturnPath } from "@/lib/billing/billing-config";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ return?: string; session_id?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkoutPages" });
  return createPageMetadata({
    title: t("successTitle"),
    description: t("successText"),
    path: "/checkout/success",
    locale: locale as AppLocale,
  });
}

export default async function CheckoutSuccessPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { return: returnParam, session_id: sessionId } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("checkoutPages");
  const returnPath = resolveSafeReturnPath(returnParam);
  const hasSessionReference = typeof sessionId === "string" && sessionId.trim().length > 0;

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container max-w-xl">
          <p className="sc-pro-eyebrow">{t("successEyebrow")}</p>
          <h1 className="sc-pro-title sc-pro-title--compact">{t("successTitle")}</h1>
          <p className="sc-pro-lead mt-4 text-sm leading-relaxed">{t("successText")}</p>
          {hasSessionReference ? (
            <p className="mt-3 text-xs text-[var(--sc-text-muted)]">{t("successRefreshNote")}</p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={returnPath} className="sc-cta-primary inline-flex min-h-[48px] items-center justify-center">
              {t("successPrimaryCta")}
            </Link>
            <Link
              href="/pro-tools"
              className="sc-cta-secondary inline-flex min-h-[48px] items-center justify-center"
            >
              {t("successPremiumCta")}
            </Link>
            <Link
              href="/pricing"
              className="sc-cta-secondary inline-flex min-h-[48px] items-center justify-center"
            >
              {t("successSecondaryCta")}
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
