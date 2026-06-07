import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/routing";

type IndustrialButtonVariant = "primary" | "secondary" | "risk";

const variantClass: Record<IndustrialButtonVariant, string> = {
  primary: "ind-btn ind-btn-primary",
  secondary: "ind-btn ind-btn-secondary",
  risk: "ind-btn ind-btn-risk",
};

interface IndustrialButtonBaseProps {
  children: ReactNode;
  variant?: IndustrialButtonVariant;
  className?: string;
}

type IndustrialButtonAsButton = IndustrialButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type IndustrialButtonAsLink = IndustrialButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type IndustrialButtonProps = IndustrialButtonAsButton | IndustrialButtonAsLink;

export function IndustrialButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: IndustrialButtonProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
