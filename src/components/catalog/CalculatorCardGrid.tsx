import type { ReactNode } from "react";

type CalculatorCardGridProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

export function CalculatorCardGrid({ children, className }: CalculatorCardGridProps) {
  return (
    <ul className={`sc-card-grid${className ? ` ${className}` : ""}`} role="list">
      {children}
    </ul>
  );
}
