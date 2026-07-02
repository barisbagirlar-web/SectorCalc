"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/core/cn";

export interface SectorCardProps {
  title: string;
  href: string;
  actionLabel?: string;
  className?: string;
}

export function SectorCard({ title, href, actionLabel, className }: SectorCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "ind-os-module group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-premium-velvet",
        className,
      )}
    >
      <span className="ind-os-module__title">{title}</span>
      <span className="ind-os-module__action">
        {actionLabel ?? "Open"}
        <ChevronRight className="h-3 w-3" aria-hidden />
      </span>
    </Link>
  );
}
