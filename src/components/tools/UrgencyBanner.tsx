"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function UrgencyBanner() {
  const t = useTranslations("freeTool");
  const [count, setCount] = useState(47);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-emerald/20 bg-emerald/10 px-4 py-2 text-center">
      <p className="text-sm font-medium text-emerald">
        {t("urgencyBanner", { count })}
      </p>
    </div>
  );
}
