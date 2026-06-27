import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";

const LOCALE = "en";

const T = {
  en: {
    eyebrow: "Legal",
    title: "Refund Policy",
    description: "Last updated for SectorCalc. Our 7-day refund guarantee policy for calculator credits and subscriptions.",
    intro: "SectorCalc provides engineering-grade decision support. We stand behind our results with a 7-day refund policy.",
    sections: [
      {
        title: "7-Day Satisfaction Guarantee",
        paragraphs: [
          "If your purchased calculator credit does not produce a usable result, or if you are unsatisfied with the quality of the premium decision report, contact us within 7 days of purchase.",
          "We will restore the credit to your account or issue a full refund, no questions asked."
        ]
      },
      {
        title: "Subscription Cancellations",
        paragraphs: [
          "Pro subscriptions can be canceled at any time. Upon cancellation, you will retain premium access until the end of your billing cycle.",
          "Canceled subscriptions do not renew automatically."
        ]
      },
      {
        title: "How to Request a Refund",
        paragraphs: [
          "To request a refund or credit restoration, please send an email to hello@sectorcalc.com.",
          "Include your account email address, the reference number of the transaction, and the name of the calculator you used."
        ]
      }
    ],
    metaTitle: "Refund Policy | SectorCalc",
    metaDescription: "Our 7-day refund guarantee policy for calculator credits and subscriptions.",
    seeAlso: "See also"
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const t = T[LOCALE as keyof typeof T] || T.en;
  return createPageMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/refund-policy",
    locale: LOCALE as "en",
  });
}

export default async function RefundPolicyPage() {
  const t = T[LOCALE as keyof typeof T] || T.en;

  return (
    <PageLayout>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      />
      <LegalPageContent
        title={t.title}
        intro={t.intro}
        sections={t.sections}
        footerNote={
          <p>
            {t.seeAlso}{" "}
            <Link href="/terms" className="font-semibold text-deep-navy hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-deep-navy hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        }
      />
    </PageLayout>
  );
}
