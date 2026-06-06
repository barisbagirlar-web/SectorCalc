"use client";

import { usePathname } from "next/navigation";
import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";

type FreeToolEmailCaptureButtonProps = {
  toolTitle: string;
  className?: string;
};

export function FreeToolEmailCaptureButton({
  toolTitle,
  className = "inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/20 bg-white px-5 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue",
}: FreeToolEmailCaptureButtonProps) {
  const pathname = usePathname();

  return (
    <LeadIntentTrigger
      source="premium_unlock"
      plan="single_report"
      toolRequested={`${toolTitle} — free check follow-up`}
      pagePath={pathname}
      className={className}
    >
      Send result to my email
    </LeadIntentTrigger>
  );
}
