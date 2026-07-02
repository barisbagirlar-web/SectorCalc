"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { cn } from "@/lib/core/cn";

export interface SectorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: "primary" | "secondary" | "outline" | "ghost" | "risk";
 size?: "sm" | "md" | "lg";
 loading?: boolean;
 fullWidth?: boolean;
 children: ReactNode;
}

function ButtonSpinner({ className }: { className?: string }) {
 return (
 <svg
 className={cn("animate-spin", className)}
 xmlns="http://www.w3.org/2000/svg"
 fill="none"
 viewBox="0 0 24 24"
 aria-hidden
 >
 <circle
 className="opacity-25"
 cx="12"
 cy="12"
 r="10"
 stroke="currentColor"
 strokeWidth="4"
 />
 <path
 className="opacity-75"
 fill="currentColor"
 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
 />
 </svg>
 );
}

export function SectorButton({
 variant = "primary",
 size = "md",
 loading = false,
 fullWidth = false,
 children,
 className,
 disabled,
 type = "button",
 ...props
}: SectorButtonProps) {
 const t = useTranslations("common");

 return (
 <button
 type={type}
 className={cn(
 "inline-flex min-h-[44px] items-center justify-center rounded-sm font-semibold transition-colors duration-150",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
 "disabled:cursor-not-allowed disabled:opacity-50",
 size === "sm" && "px-4 py-2 text-sm",
 size === "md" && "px-6 py-3 text-base",
 size === "lg" && "px-8 py-4 text-lg",
 variant === "primary" && [
 "border border-deep-navy bg-deep-navy text-white hover:bg-black",
 "focus-visible:ring-deep-navy",
 ],
 variant === "secondary" && [
 "border border-deep-navy bg-transparent text-deep-navy hover:bg-deep-navy/[0.04]",
 "focus-visible:ring-deep-navy",
 ],
 variant === "outline" && [
 "border border-border-subtle text-text-primary hover:bg-bg-subtle",
 "focus-visible:ring-deep-navy",
 ],
 variant === "ghost" && [
 "border border-transparent text-text-secondary hover:bg-bg-subtle",
 "focus-visible:ring-deep-navy",
 ],
 variant === "risk" && [
 "border border-amber/40 bg-amber text-deep-navy hover:bg-amber/90",
 "focus-visible:ring-amber",
 ],
 fullWidth && "w-full",
 className
 )}
 disabled={disabled || loading}
 aria-busy={loading || undefined}
 {...props}
 >
 {loading ? (
 <>
 <ButtonSpinner className="mr-2 h-4 w-4" />
 {t("loading")}
 </>
 ) : (
 children
 )}
 </button>
 );
}
