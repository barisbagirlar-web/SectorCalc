// SectorCalc PRO V5.3.1 — Baris Product Badge
// Server component. Renders product badge + notice for Baris tools.
import { getBarisProduct } from "@/sectorcalc/pro-commerce/baris-pro-products";

interface BarisProductBadgeProps {
  toolKey: string;
}

export function BarisProductBadge({ toolKey }: BarisProductBadgeProps) {
  const product = getBarisProduct(toolKey);
  if (!product) return null;

  const badgeClass = product.productMode === "INSTANT_PRO_CALCULATOR"
    ? "sc-premium-badge sc-premium-badge--pro"
    : "sc-premium-badge sc-premium-badge--dossier";

  return (
    <div className="baris-product-banner" style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "8px 16px",
      marginBottom: "16px",
      borderRadius: "6px",
      background: product.productMode === "INSTANT_PRO_CALCULATOR"
        ? "var(--color-surface-raised, #f5f4ef)"
        : "var(--color-surface, #e8e6de)",
      border: "1px solid var(--color-border, #d4d2ca)",
    }}>
      <span className={badgeClass} style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "4px",
        fontSize: "0.72rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        background: product.productMode === "INSTANT_PRO_CALCULATOR"
          ? "var(--color-accent, #bd5d3a)"
          : "var(--color-text, #1a1915)",
        color: "#fff",
      }}>
        {product.publicBadge}
      </span>
      <span style={{ fontSize: "0.82rem", color: "var(--color-text-secondary, #5a5955)" }}>
        <strong>${product.priceUsd}</strong> &middot; {product.publicNotice}
      </span>
    </div>
  );
}
