type AppLocale = "en";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { RoiPageContent } from "./RoiPageContent";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "Return on Investment Calculator and Capital Screening Reference",
    description:
      "Calculate ROI, payback period, and annualized return for industrial investment screening. Includes methodology, ROI vs NPV vs IRR comparison, scenario library, finance references, and citation formats.",
    path: "/calculators/roi",
    locale: "en" as AppLocale,
  });
}

export default function RoiCalculatorPage() {
  return <RoiPageContent />;
}
