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
 <div
 className="rounded-sm border border-border-subtle bg-bg-subtle px-4 py-2 text-center"
 aria-hidden="true"
 >
 <p className="text-sm font-medium text-deep-navy">
 {t("urgencyBanner", { count })}
 </p>
 </div>
 );
}
