export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { CustomerSignInFromNextParam } from "@/components/billing/CustomerSignInPanel";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "loginPage" });
  return {
    ...createPageMetadata({
      title: t("meta.title"),
      description: t("meta.description"),
      path: "/login",
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations("loginPage");

  return (
    <PageLayout>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <section className="py-12">
        <Container size="narrow">
          <Suspense fallback={null}>
            <CustomerSignInFromNextParam defaultMode="signup" />
          </Suspense>
        </Container>
      </section>
    </PageLayout>
  );
}
