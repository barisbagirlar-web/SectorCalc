export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "@/lib/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { CONTACT_EMAILS } from "@/config/contact";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
 title: "Disclaimer",
 description:
 "SectorCalc calculators are indicative decision-support tools — not professional cost, tax, legal, or engineering advice.",
 path: "/disclaimer",
});

export default function DisclaimerPage() {
 return (
 <PageLayout>
 <PageHero
 eyebrow="Legal"
 title="Disclaimer"
 description="Please read this before relying on calculator or report outputs for business decisions."
 />
 <LegalPageContent
 title="Disclaimer"
 intro="SectorCalc helps operators and advisors explore scenarios faster. It does not replace licensed or certified professional review."
 sections={[
 {
 title: "Indicative decision support",
 paragraphs: [
 "Calculators and premium report previews on SectorCalc are indicative decision-support tools.",
 "They are designed to structure thinking — not to certify bids, margins, safety, compliance, or financial statements.",
 ],
 },
 {
 title: "Your inputs drive results",
 paragraphs: [
 "Outputs depend on the numbers and assumptions you enter.",
 "Small input changes can materially change recommendations, risk labels, and scenario tables.",
 ],
 },
 {
 title: "Not professional advice",
 paragraphs: [
 "SectorCalc is not a substitute for professional cost accounting, engineering review, tax advice, legal counsel, or industry-specific compliance review.",
 "Engage qualified professionals before committing to contracts, pricing, or capital decisions.",
 ],
 },
 {
 title: "Benchmarks and claims",
 paragraphs: [
 "Unless explicitly stated on a specific page or tool, SectorCalc does not claim independent industry benchmarks or third-party verified market data in the MVP.",
 "Do not treat example or sample reports as results for your business.",
 ],
 },
 {
 title: "No outcome guarantee",
 paragraphs: [
 "SectorCalc does not guarantee revenue, margin, win rates, safety outcomes, or client results.",
 ],
 },
 {
 title: "Contact",
 paragraphs: [`Questions: ${CONTACT_EMAILS.hello}`],
 },
 ]}
 footerNote={
 <p>
 See{" "}
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
