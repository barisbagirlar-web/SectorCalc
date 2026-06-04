import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { CONTACT_EMAILS } from "@/config/contact";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How SectorCalc handles information you submit, including lead intent forms. No payment data is collected in the MVP.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last updated for the SectorCalc MVP. This policy describes how we handle information you choose to submit."
      />
      <LegalPageContent
        title="Privacy Policy"
        intro="SectorCalc is an English-first decision-support platform. This MVP does not process payments and does not require an account to use free tools."
        sections={[
          {
            title: "Information we collect",
            paragraphs: [
              "SectorCalc collects information that users voluntarily submit in forms — for example, when requesting a premium decision report or unlock intent.",
              "Lead intent data may include your name, email address, company or business name, industry, the tool or report requested, intended use, an optional message, and contextual fields such as page path, plan interest, and source.",
            ],
          },
          {
            title: "How we use information",
            paragraphs: [
              "We use submitted information to understand product demand, improve SectorCalc, and prepare to respond to report requests in future releases.",
              "We do not sell personal data.",
            ],
          },
          {
            title: "Payment and account data",
            paragraphs: [
              "The MVP does not collect payment card data or run checkout.",
              "Full authentication and billing are not live in this release.",
            ],
          },
          {
            title: "Storage",
            paragraphs: [
              "Depending on configuration, lead intents may be stored in your browser (localStorage) and, when Firebase is enabled, in a Firestore collection named leadIntents.",
              "Operational access to stored leads should be restricted before broad production use.",
            ],
          },
          {
            title: "Your choices",
            paragraphs: [
              "You may request deletion of information you submitted by contacting us. We will honor reasonable requests as the product matures.",
            ],
          },
          {
            title: "Contact",
            paragraphs: [
              `Privacy inquiries: ${CONTACT_EMAILS.privacy}`,
              `General contact: ${CONTACT_EMAILS.hello}`,
            ],
          },
        ]}
        footerNote={
          <p>
            See also{" "}
            <Link href="/terms" className="font-semibold text-professional-blue hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/disclaimer"
              className="font-semibold text-professional-blue hover:underline"
            >
              Disclaimer
            </Link>
            .
          </p>
        }
      />
    </PageLayout>
  );
}
