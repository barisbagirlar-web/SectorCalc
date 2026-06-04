"use client";

import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";

export function ConsultantAccessCta() {
  return (
    <LeadIntentTrigger
      source="pricing"
      plan="pro"
      toolRequested="Consultant access (for-consultants)"
      className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-cyan px-6 py-2.5 text-base font-semibold text-deep-navy hover:bg-cyan/90"
    >
      Request Consultant Access
    </LeadIntentTrigger>
  );
}
