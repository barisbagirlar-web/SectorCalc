import { redirect } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

/** Pricing is in-product only — redirect to Audit Engine */
export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  redirect({ href: "/audit", locale });
}
