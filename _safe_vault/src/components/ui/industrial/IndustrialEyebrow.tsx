import type { ReactNode } from "react";

export interface IndustrialEyebrowProps {
  children: ReactNode;
  className?: string;
  mono?: boolean;
}

export function IndustrialEyebrow({
  children,
  className = "",
  mono = false,
}: IndustrialEyebrowProps) {
  return (
    <p
      className={
        mono
          ? `ind-mono-label text-amber ${className}`.trim()
          : `ind-eyebrow ${className}`.trim()
      }
    >
      {children}
    </p>
  );
}
