type AppLocale = "en";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { NpvPageContent } from "./NpvPageContent";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "Net Present Value Calculator and Capital Budgeting Reference",
    description:
      "Calculate NPV, IRR, and payback metrics for industrial investment screening. Includes methodology, scenario library, finance references, and citation formats.",
    path: "/calculators/npv",
    locale: "en" as AppLocale,
  });
}

export default function NpvCalculatorPage() {
  return <NpvPageContent />;
}
