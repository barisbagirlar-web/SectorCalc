import { defineRouting } from "next-intl/routing";
import { locales } from "@/i18n/locales";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  localePrefix: "never",
  localeDetection: false,
});
