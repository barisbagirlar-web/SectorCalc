import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountReportsPageContent } from "@/components/reports/AccountReportsPageContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Saved Reports",
    description:
      "View saved SectorCalc Pro verdict reports linked to your account.",
    path: "/account/reports",
  }),
  robots: { index: false, follow: false },
};

export default function AccountReportsPage() {
  return (
    <Suspense fallback={null}>
      <AccountReportsPageContent />
    </Suspense>
  );
}
