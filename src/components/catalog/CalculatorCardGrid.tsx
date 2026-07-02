import type { ReactNode } from "react";

type CalculatorCardGridProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

/** Text-based tool grid - 3-4 equal columns, symmetric. */
export function CalculatorCardGrid({ children, className }: CalculatorCardGridProps) {
  return (
    <ul
      className={`grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4${className ? ` ${className}` : ""}`}
      role="list"
    >
      {children}
    </ul>
  );
}
