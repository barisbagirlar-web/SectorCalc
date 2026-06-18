import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageLayout } from "@/components/layout/PageLayout";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { TrustTraceVerificationCard } from "@/components/trust-trace/TrustTraceVerificationCard";
import { createPageMetadata } from "@/lib/metadata";
import { redirect, type AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string; hash: string }>;
};

const HASH_PATTERN = /^[a-f0-9]{64}$/;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "verify" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/verify",
    locale: locale as AppLocale,
  });
}

export default async function VerifyHashPage({ params }: PageProps) {
  const { locale, hash } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "verify" });

  if (!HASH_PATTERN.test(hash)) {
    redirect({ href: "/verify", locale: locale as AppLocale });
  }

  return (
    <PageLayout>
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
        <Container>
          {/* Header */}
          <div className="mx-auto mb-8 max-w-xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              {t("eyebrow")}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {t("description")}
            </p>
          </div>

          {/* Verification card */}
          <TrustTraceVerificationCard hash={hash} />

          {/* Legal */}
          <div className="mx-auto mt-10 max-w-lg">
            <DecisionToolLegalDisclaimer />
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
