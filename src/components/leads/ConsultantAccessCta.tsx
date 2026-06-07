"use client";

import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";

export function ConsultantAccessCta() {
 return (
 <LeadIntentTrigger
 source="pricing"
 plan="pro"
 toolRequested="Consultant access (for-consultants)"
 className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-accent-teal px-6 py-2.5 text-base font-semibold text-text-primary hover:bg-accent-teal/90"
 >
 Request Consultant Access
 </LeadIntentTrigger>
 );
}
