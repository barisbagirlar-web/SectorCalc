import { useTranslations } from "next-intl";
import Link from "@/lib/navigation/next-link";
import { ReportPreviewCard } from "@/components/cards/ReportPreviewCard";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import type { Tool } from "@/data/tools";

interface McProductExtensionsProps {
 freeTools: Tool[];
 premiumTools: Tool[];
}

export function McProductExtensions({ freeTools, premiumTools }: McProductExtensionsProps) {
 const t = useTranslations("mcProductExtensions");
 return (
 <>
 <section className="tenth-tab">
 <div className="container">
 <h2>{t("reportPreviewTitle")}</h2>
 <p className="mc-tenth-lead">{t("reportPreviewDesc")}</p>
 <ReportPreviewCard />
 <p className="mc-tenth-link">
 <Link href="/reports/sample-decision-report">{t("openFullReport")}</Link>
 </p>
 </div>
 </section>

 <section className="seventh-tab" id="tool-finder">
 <div className="container">
 <h2>{t("freeToolsTitle")}</h2>
 <p>{t("freeToolsDesc")}</p>
 <ToolsTileGrid tools={freeTools} className="mt-6" />
 <p className="mc-section-link">
 <Link href="/free-tools">{t("viewAllFreeTools")}</Link>
 </p>
 </div>
 </section>

 <section className="seventh-tab seventh-tab--muted">
 <div className="container">
 <h2>{t("premiumToolsTitle")}</h2>
 <p>{t("premiumToolsDesc")}</p>
 <ToolsTileGrid tools={premiumTools} className="mt-6" />
 <p className="mc-section-link">
 <Link href="/pricing">{t("viewPricing")}</Link>
 </p>
 </div>
 </section>
 </>
 );
}
