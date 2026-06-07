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
  searchParams: Promise<{ return?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkoutPages" });
  return createPageMetadata({
    title: t("cancelTitle"),
    description: t("cancelText"),
    path: "/checkout/cancel",
    locale: locale as AppLocale,
  });
}

export default async function CheckoutCancelPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { return: returnParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("checkoutPages");
  const returnPath = resolveSafeReturnPath(returnParam);

  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container max-w-xl">
          <p className="sc-pro-eyebrow">{t("cancelEyebrow")}</p>
          <h1 className="sc-pro-title sc-pro-title--compact">{t("cancelTitle")}</h1>
          <p className="sc-pro-lead mt-4 text-sm leading-relaxed">{t("cancelText")}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/pricing" className="sc-cta-primary inline-flex min-h-[48px] items-center justify-center">
              {t("cancelPricingCta")}
            </Link>
            <Link
              href={returnPath}
              className="sc-cta-secondary inline-flex min-h-[48px] items-center justify-center"
            >
              {t("cancelReturnCta")}
            </Link>
            <Link
              href="/free-tools"
              className="sc-cta-secondary inline-flex min-h-[48px] items-center justify-center"
            >
              {t("cancelFreeCta")}
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
