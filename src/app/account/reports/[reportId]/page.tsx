import type { Metadata } from "next";
import { SavedReportDetailContent } from "@/components/reports/SavedReportDetailContent";
import { createPageMetadata } from "@/lib/metadata";

interface SavedReportPageParams {
 reportId: string;
}

export async function generateMetadata({
 params,
}: {
 params: Promise<SavedReportPageParams>;
}): Promise<Metadata> {
 const { reportId } = await params;

 return {
 ...createPageMetadata({
 title: "Saved Report",
 description: "View a saved SectorCalc Pro verdict report.",
 path: `/account/reports/${reportId}`,
 }),
 robots: { index: false, follow: false },
 };
}

export default async function SavedReportPage({
 params,
}: {
 params: Promise<SavedReportPageParams>;
}) {
 const { reportId } = await params;
 return <SavedReportDetailContent reportId={reportId} />;
}
