import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "risk";
type ButtonSize = "sm" | "md" | "lg" | "cta";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "ind-os-btn-action",
  secondary: "ind-os-btn-secondary",
  ghost:
    "inline-flex items-center justify-center rounded-none border border-transparent bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-body-charcoal hover:bg-industrial-matte",
  outline: "ind-os-btn-secondary",
  risk: "ind-os-btn-action",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "!min-h-[32px] !px-3 !text-xs",
  md: "",
  lg: "!min-h-[40px] !px-6 !text-sm",
  cta: "!min-h-[40px] !px-6 !text-sm",
};

const baseClasses =
  "inline-flex items-center justify-center font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-premium-velvet disabled:pointer-events-none disabled:opacity-50";

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
