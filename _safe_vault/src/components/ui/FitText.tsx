"use client";

import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { useFitText } from "@/hooks/use-fit-text";

type FitTextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

/**
 * Renders children in a single-line container that auto-shrinks
 * font-size to prevent overflow. Never wraps, never overflows.
 */
export function FitText<T extends ElementType = "span">({
  as,
  children,
  className,
  htmlFor,
  ...rest
}: FitTextProps<T>) {
  const { ref } = useFitText();
  const Tag = (as ?? (htmlFor ? "label" : "span")) as ElementType;

  return (
    <Tag ref={ref} className={className} htmlFor={htmlFor} {...rest}>
      {children}
    </Tag>
  );
}
