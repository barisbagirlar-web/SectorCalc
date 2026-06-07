import type { Metadata } from "next";
import { SectorMarginLanding } from "@/components/launch/SectorMarginLanding";
import { CONSTRUCTION_BID_MARGIN_LANDING } from "@/data/sector-landing-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
 title: "Construction Bid Margin — Change Order Risk",
 description:
 "Protect construction project margin before you sign change orders. Free bid check and premium change-order verdict reports.",
 path: "/construction-bid-margin",
});

export default function ConstructionBidMarginPage() {
 return <SectorMarginLanding config={CONSTRUCTION_BID_MARGIN_LANDING} />;
}
