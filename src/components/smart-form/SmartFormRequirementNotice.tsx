"use client";

import { useTranslations } from "@/lib/i18n-stub";

type SmartFormRequirementNoticeProps = {
  readonly missingCount: number;
  readonly invalidCount: number;
  readonly blocked?: boolean;
};

export function SmartFormRequirementNotice({
  missingCount,
  invalidCount,
  blocked = false,
}: SmartFormRequirementNoticeProps) {
  const t = useTranslations("smartForm.notices");
  const tValidation = useTranslations("smartForm.validation");

  if (missingCount === 0 && invalidCount === 0 && !blocked) {
    return (
      <p className="sc-smart-form-notice sc-smart-form-notice--ok text-sm text-body-charcoal" role="status">
        {t("validatedInputSet")}
      </p>
    );
  }

  return (
    <div className="sc-smart-form-notice sc-smart-form-notice--warn space-y-1" role="alert">
      <p className="text-sm font-semibold text-premium-velvet">{t("calculationBlocked")}</p>
      <p className="text-sm text-body-charcoal">{t("requiredInputReason")}</p>
      {missingCount > 0 ? (
        <p className="text-sm text-body-charcoal">
          {tValidation("missingInputs", { count: missingCount })}
        </p>
      ) : null}
    </div>
  );
}
