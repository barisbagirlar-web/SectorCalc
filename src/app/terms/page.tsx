import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { CONTACT_EMAILS } from "@/config/contact";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Use",
  description:
    "Terms for using SectorCalc calculators and premium previews. Indicative tools only — not professional advice.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        subtitle="By using SectorCalc you agree to these terms for the current MVP release."
      />
      <LegalPageContent
        title="Terms of Use"
        intro="SectorCalc provides sector-specific calculators and premium decision-report previews. These terms apply to the public MVP."
        sections={[
          {
            title: "Indicative tools only",
            paragraphs: [
              "Calculators and reports on SectorCalc are indicative decision-support tools. They are not a substitute for professional financial, accounting, legal, engineering, or tax advice.",
              "You are responsible for how you use outputs in bids, pricing, operations, and client work.",
            ],
          },
          {
            title: "No guarantees",
            paragraphs: [
              "We do not guarantee accuracy, completeness, or fitness for a particular purpose.",
              "Results depend on the inputs you provide and assumptions baked into each tool.",
              "SectorCalc does not guarantee business outcomes.",
            ],
          },
          {
            title: "Use at your own risk",
            paragraphs: [
              "You use the site and tools at your own risk. To the extent permitted by law, SectorCalc is not liable for decisions you make based on calculator or report outputs.",
            ],
          },
          {
            title: "Preview features",
            paragraphs: [
              "Premium unlock, export (PDF, Excel, Word), payment, and some plan features may be shown as previews or “coming soon” in the MVP.",
              "Until billing and export ship, those flows record interest only and do not provide paid deliverables.",
            ],
          },
          {
            title: "Acceptable use",
            paragraphs: [
              "Do not misuse forms, scrape the service abusively, or attempt to disrupt the platform.",
              "We may update or remove tools and pages as the product evolves.",
            ],
          },
          {
            title: "Contact",
            paragraphs: [`Questions: ${CONTACT_EMAILS.hello}`],
          },
        ]}
        footerNote={
          <p>
            Read our{" "}
            <Link
              href="/disclaimer"
              className="font-semibold text-professional-blue hover:underline"
            >
              Disclaimer
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-professional-blue hover:underline"
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
