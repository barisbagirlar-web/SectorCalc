export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "@/lib/navigation/next-link";
import { Coins } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { LegalContactBlock } from "@/components/legal/LegalContactBlock";
import { Container } from "@/components/ui/Container";
import { CREDIT_PACKAGE_OPTIONS } from "@/lib/credits/credit-packages";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

const ENTRY_PRICE_USD = CREDIT_PACKAGE_OPTIONS[0]?.priceUsd ?? 1.99;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "creditsPricing.meta" });

  const base = createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/pricing",
    locale: locale as AppLocale,
  });

  return {
    ...base,
    other: {
      "product:price:amount": ENTRY_PRICE_USD.toFixed(2),
      "product:price:currency": "USD",
    },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("creditsPricing");
  const tCommon = await getTranslations("legalCommon");

  return (
    <PageLayout>
      <section className="bg-white py-16 sm:py-24">
        <Container size="wide">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-2 text-text-secondary">{t("subtitle")}</p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {CREDIT_PACKAGE_OPTIONS.map((pkg) => {
                const isPopular = pkg.credits === 15;
                const perCredit = (pkg.priceUsd / pkg.credits).toFixed(2);

                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${
                      isPopular
                        ? "border-deep-navy ring-1 ring-deep-navy"
                        : "border-border-subtle"
                    }`}
                  >
                    {isPopular ? (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-deep-navy px-3 py-0.5 text-xs font-medium text-white">
                        {t("popular")}
                      </span>
                    ) : null}
                    <div className="text-center">
                      <Coins
                        className="mx-auto h-8 w-8 text-gray-700"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                        {t("creditsLabel", { count: pkg.credits })}
                      </h2>
                      <p className="mt-2 text-3xl font-bold text-text-primary">
                        ${pkg.priceUsd.toFixed(2)}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        ${perCredit} {t("perCredit")}
                      </p>
                      <Link
                        href="/account/credits"
                        className="mt-4 inline-block min-h-[44px] w-full rounded-full bg-deep-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                      >
                        {t("buyNow")}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-8 text-center text-xs text-text-secondary">{t("legalNote")}</p>

            <div className="mt-12 border-t border-border-subtle pt-8 text-center text-sm text-text-secondary">
              <LegalContactBlock />
              <p className="mt-4">
                <Link href="/terms" className="font-semibold text-deep-navy hover:underline">
                  {tCommon("readTerms")}
                </Link>
                {" · "}
                <Link href="/privacy" className="font-semibold text-deep-navy hover:underline">
                  {tCommon("readPrivacy")}
                </Link>
                {" · "}
                <Link
                  href="/refund-policy"
                  className="font-semibold text-deep-navy hover:underline"
                >
                  {tCommon("readRefund")}
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
