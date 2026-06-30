"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";
import { useLeadIntent } from "@/components/leads/LeadIntentContext";
import type { LeadModalOpenContext, LeadPlan, LeadSource } from "@/lib/features/leads/types";

interface LeadIntentTriggerProps
 extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> {
 children: ReactNode;
 source: LeadSource;
 toolRequested?: string;
 industry?: string;
 plan?: LeadPlan;
 pagePath?: string;
 onBeforeOpen?: () => void;
}

export function LeadIntentTrigger({
 children,
 source,
 toolRequested,
 industry,
 plan,
 pagePath,
 onBeforeOpen,
 className = "",
 ...rest
}: LeadIntentTriggerProps) {
 const { openLeadModal } = useLeadIntent();

 const handleClick = () => {
 onBeforeOpen?.();
 const ctx: LeadModalOpenContext = {
 source,
 toolRequested,
 industry,
 plan,
 pagePath,
 };
 openLeadModal(ctx);
 };

 return (
 <button
 type="button"
 className={className}
 onClick={handleClick}
 {...rest}
 >
 {children}
 </button>
 );
}
