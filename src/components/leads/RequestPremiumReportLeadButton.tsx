"use client";

import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";

const buttonClasses =
 "inline-flex min-h-[48px] items-center justify-center rounded-lg bg-accent-teal px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-black focus-visible:ring-offset-2";

export function RequestPremiumReportLeadButton() {
 return (
 <LeadIntentTrigger
 source="sample_report"
 toolRequested="Premium decision report (sample)"
 industry="CNC & Manufacturing"
 className={buttonClasses}
 >
 Request a premium report
 </LeadIntentTrigger>
 );
}
