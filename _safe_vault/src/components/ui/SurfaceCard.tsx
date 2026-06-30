import type { ReactNode } from "react";

type SurfaceCardProps = {
 children: ReactNode;
 className?: string;
 interactive?: boolean;
};

export function SurfaceCard({
 children,
 className = "",
 interactive = false,
}: SurfaceCardProps) {
 return (
 <div
 className={`sc-card ${interactive ? "sc-card-interactive" : ""} ${className}`}
 >
 {children}
 </div>
 );
}
