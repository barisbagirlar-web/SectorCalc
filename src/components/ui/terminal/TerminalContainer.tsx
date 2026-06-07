import type { ReactNode } from "react";
import { Activity, CircleDot } from "lucide-react";
import { IndustrialBadge } from "@/components/ui/industrial";

export interface TerminalContainerProps {
  title: string;
  children: ReactNode;
  status?: string;
  className?: string;
}

export const TerminalContainer = ({
  title,
  children,
  status = "ACTIVE_MONITORING",
  className = "",
}: TerminalContainerProps) => (
  <div className={`ind-terminal p-6 ${className}`.trim()}>
    <div className="ind-terminal-header">
      <div className="flex min-w-0 items-center gap-3">
        <Activity className="h-4 w-4 shrink-0 text-amber" aria-hidden />
        <h2 className="truncate text-sm font-bold uppercase tracking-widest text-amber">
          {title}
        </h2>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <CircleDot className="h-3 w-3 text-emerald-400" aria-hidden />
        <IndustrialBadge tone="stable">{status}</IndustrialBadge>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{children}</div>
  </div>
);

/** @deprecated Use {@link TerminalContainer}. */
export const IndustrialContainer = TerminalContainer;

export type IndustrialContainerProps = TerminalContainerProps;
