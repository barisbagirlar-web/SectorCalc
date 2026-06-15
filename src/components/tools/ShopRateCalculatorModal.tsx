"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { DynamicToolForm } from "@/components/tools/DynamicToolForm";
import { extractShopRateSavedRates } from "@/lib/shop-rate/extract-rates";
import { runGeneratedToolCalculation } from "@/lib/generated-tools/use-tool-schema";
import type { ShopRateSavedRates } from "@/lib/shop-rate/types";
import { SHOP_RATE_MODAL_SLUG } from "@/lib/shop-rate/types";
import { useShopRateModalTool } from "@/lib/shop-rate/use-shop-rate-modal-tool";

export type ShopRateCalculatorModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (rates: ShopRateSavedRates) => void;
};

export function ShopRateCalculatorModal({
  isOpen,
  onClose,
  onSave,
}: ShopRateCalculatorModalProps) {
  const t = useTranslations("generatedTool.shopRateModal");
  const { schema, calculator, zodSchema, loading, error } = useShopRateModalTool(isOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (values: Record<string, unknown>) => {
    if (!calculator) {
      return;
    }

    const result = runGeneratedToolCalculation(calculator, values);
    const rates = extractShopRateSavedRates(values, result);
    onSave(rates);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-rate-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(90vh,820px)] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="shop-rate-modal-title" className="text-lg font-semibold text-premium-velvet">
              {t("title")}
            </h2>
            <p className="mt-1 text-sm text-body-charcoal">{t("description")}</p>
          </div>
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] rounded-lg px-3 text-sm text-body-charcoal hover:bg-surface-cream"
            onClick={onClose}
          >
            {t("close")}
          </button>
        </div>

        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-body-charcoal">{t("loading")}</p>
          ) : error || !schema || !calculator || !zodSchema ? (
            <p className="text-sm text-red-700" role="alert">
              {error ?? t("loadError")}
            </p>
          ) : (
            <DynamicToolForm
              slug={SHOP_RATE_MODAL_SLUG}
              schema={schema}
              zodSchema={zodSchema}
              layout="standard"
              calculateLabel={t("applyToForm")}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
