export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { AccountFeedbackQueueClient } from "@/components/account/AccountFeedbackQueueClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Feedback Queue",
    description: "Review tool feedback, formula objections, and improvement requests.",
    path: "/account/feedback",
  }),
  robots: { index: false, follow: false },
};

export default function AccountFeedbackPage() {
  return <AccountFeedbackQueueClient />;
}
