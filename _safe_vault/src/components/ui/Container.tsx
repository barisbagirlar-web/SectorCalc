import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "article" | "header" | "footer" | "nav";
  size?: "default" | "narrow" | "wide";
}

const sizeClasses = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
};

/** Dense industrial container — tight horizontal padding */
export function Container({
  children,
  className = "",
  as: Component = "div",
  size = "default",
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full px-3 sm:px-4 lg:px-5 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Component>
  );
}
