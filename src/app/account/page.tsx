export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
 ...createPageMetadata({
 title: "Account",
 description:
 "Manage your SectorCalc Pro access, premium decision tools and saved verdict reports.",
 path: "/account",
 }),
 robots: { index: false, follow: false },
};

export default function AccountPage() {
 return <AccountDashboard />;
}
