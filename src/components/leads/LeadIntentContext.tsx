"use client";

import {
 createContext,
 useCallback,
 useContext,
 useMemo,
 useState,
 type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { LeadModalOpenContext } from "@/lib/features/leads/types";

interface LeadIntentContextValue {
 isOpen: boolean;
 context: LeadModalOpenContext | null;
 openLeadModal: (ctx: LeadModalOpenContext) => void;
 closeLeadModal: () => void;
}

const LeadIntentContext = createContext<LeadIntentContextValue | null>(null);

export function LeadIntentProvider({ children }: { children: ReactNode }) {
 const pathname = usePathname();
 const [isOpen, setIsOpen] = useState(false);
 const [context, setContext] = useState<LeadModalOpenContext | null>(null);

 const openLeadModal = useCallback(
 (ctx: LeadModalOpenContext) => {
 setContext({
 ...ctx,
 pagePath: ctx.pagePath ?? pathname ?? "/",
 });
 setIsOpen(true);
 },
 [pathname]
 );

 const closeLeadModal = useCallback(() => {
 setIsOpen(false);
 }, []);

 const value = useMemo(
 () => ({
 isOpen,
 context,
 openLeadModal,
 closeLeadModal,
 }),
 [isOpen, context, openLeadModal, closeLeadModal]
 );

 return (
 <LeadIntentContext.Provider value={value}>
 {children}
 </LeadIntentContext.Provider>
 );
}

export function useLeadIntent(): LeadIntentContextValue {
 const ctx = useContext(LeadIntentContext);
 if (!ctx) {
 throw new Error("useLeadIntent must be used within LeadIntentProvider");
 }
 return ctx;
}

export function useLeadIntentOptional(): LeadIntentContextValue | null {
 return useContext(LeadIntentContext);
}
