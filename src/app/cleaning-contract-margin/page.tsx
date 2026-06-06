import type { Metadata } from "next";
import { SectorMarginLanding } from "@/components/launch/SectorMarginLanding";
import { CLEANING_CONTRACT_MARGIN_LANDING } from "@/data/sector-landing-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cleaning Contract Margin — Bid Optimizer",
  description:
    "Stop cleaning contracts that lose money every month. Free cost check and premium bid verdict reports for office cleaning.",
  path: "/cleaning-contract-margin",
});

export default function CleaningContractMarginPage() {
  return <SectorMarginLanding config={CLEANING_CONTRACT_MARGIN_LANDING} />;
}
