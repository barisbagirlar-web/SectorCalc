import type { ReactNode } from "react";

export type IndustrialPanelVariant = "default" | "navy" | "terminal";

export interface IndustrialPanelProps {
  children: ReactNode;
  className?: string;
  variant?: IndustrialPanelVariant;
}

const variantClass: Record<IndustrialPanelVariant, string> = {
  default: "ind-panel",
  navy: "ind-panel-navy",
  terminal: "ind-terminal p-6",
};

export function IndustrialPanel({
  children,
  className = "",
  variant = "default",
}: IndustrialPanelProps) {
  return (
    <div className={`${variantClass[variant]} ${className}`.trim()}>{children}</div>
  );
}
