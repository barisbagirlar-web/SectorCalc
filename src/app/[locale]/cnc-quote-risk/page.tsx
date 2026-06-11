import type { Metadata } from "next";
import { CncQuoteRiskLanding } from "@/components/launch/CncQuoteRiskLanding";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
 title: "CNC Quote Risk Calculator",
 description:
 "Spot underpriced CNC jobs before they kill your margin. Run a free machine time check, then unlock safe price verdicts with SectorCalc Pro.",
 path: "/cnc-quote-risk",
});

export default function CncQuoteRiskPage() {
 return <CncQuoteRiskLanding />;
}
