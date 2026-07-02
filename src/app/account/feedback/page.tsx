export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations } from "@/lib/i18n-stub";
import { AccountFeedbackQueueClient } from "@/components/account/AccountFeedbackQueueClient";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "accountFeedbackPage" });
  return {
    ...createPageMetadata({
      title: t("meta.title"),
      description: t("meta.description"),
      path: "/account/feedback",
      locale: locale as AppLocale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function AccountFeedbackPage({ params }: PageProps) {
  const locale = "en";
  return <AccountFeedbackQueueClient />;
}
