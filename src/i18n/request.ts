import { getRequestConfig } from "next-intl/server";
import { routing, isAppLocale } from "@/i18n/routing";

async function loadManufacturingOsMessages(locale: string) {
  try {
    return (await import(`./locales/${locale}/manufacturing-os.json`)).default;
  } catch {
    return (await import("./locales/en/manufacturing-os.json")).default;
  }
}

async function loadBaseMessages(locale: string): Promise<Record<string, unknown>> {
  try {
    return (await import(`../../messages/${locale}.json`)).default as Record<string, unknown>;
  } catch {
    return (await import("../../messages/en.json")).default as Record<string, unknown>;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isAppLocale(locale)) {
    locale = routing.defaultLocale;
  }

  const [messages, manufacturingOsMessages] = await Promise.all([
    loadBaseMessages(locale),
    loadManufacturingOsMessages(locale),
  ]);

  return {
    locale,
    messages: {
      ...messages,
      manufacturingOs: manufacturingOsMessages,
    },
  };
});
