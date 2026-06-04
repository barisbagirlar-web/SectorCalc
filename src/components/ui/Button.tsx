import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-professional-blue text-white hover:bg-blue-700 focus-visible:ring-professional-blue",
  secondary:
    "bg-cyan text-deep-navy hover:bg-cyan/90 focus-visible:ring-cyan",
  ghost:
    "bg-transparent text-off-white hover:bg-white/10 focus-visible:ring-white",
  outline:
    "border-2 border-professional-blue text-professional-blue bg-transparent hover:bg-professional-blue/5 focus-visible:ring-professional-blue",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-4 py-2 text-sm",
  md: "min-h-[44px] px-6 py-2.5 text-base",
  lg: "min-h-[48px] px-8 py-3 text-base font-semibold",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

function buildClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string
): string {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

interface ButtonLinkProps extends SharedProps {
  href: string;
  external?: boolean;
  onClick?: () => void;
}

type ButtonNativeProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = ButtonLinkProps | ButtonNativeProps;

function isLinkProps(props: ButtonProps): props is ButtonLinkProps {
  return "href" in props && typeof props.href === "string";
}

function nativeButtonRest(
  props: ButtonNativeProps
): ButtonHTMLAttributes<HTMLButtonElement> {
  const { variant, size, className, children, ...rest } = props;
  void variant;
  void size;
  void className;
  void children;
  return rest;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", children, className = "" } = props;
  const classes = buildClasses(variant, size, className);

  if (isLinkProps(props)) {
    const { href, external, onClick } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const rest = nativeButtonRest(props as ButtonNativeProps);
  return (
    <button type={rest.type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
