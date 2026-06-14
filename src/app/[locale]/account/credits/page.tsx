import type { Metadata } from "next";
import { AccountCreditsPageContent } from "@/components/account/AccountCreditsPageContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Credits",
    description: "Buy SectorCalc credits for premium AI assistance and analyzer usage.",
    path: "/account/credits",
  }),
  robots: { index: false, follow: false },
};

export default function AccountCreditsPage() {
  return <AccountCreditsPageContent />;
}
