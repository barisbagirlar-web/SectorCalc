"use client";

import { usePathname } from "next/navigation";
import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";

type FreeToolEmailCaptureButtonProps = {
 toolTitle: string;
 className?: string;
 label?: string;
};

export function FreeToolEmailCaptureButton({
 toolTitle,
 className = "sc-btn-secondary inline-flex w-full sm:w-auto",
 label = "Email me this risk breakdown",
}: FreeToolEmailCaptureButtonProps) {
 const pathname = usePathname();

 return (
 <LeadIntentTrigger
 source="premium_unlock"
 plan="single_report"
 toolRequested={`${toolTitle} — free check risk breakdown`}
 pagePath={pathname}
 className={className}
 >
 {label}
 </LeadIntentTrigger>
 );
}
