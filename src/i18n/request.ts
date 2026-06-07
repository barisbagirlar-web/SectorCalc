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

function mergeMessages(
  fallback: Record<string, unknown>,
  primary: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...fallback };
  for (const [key, value] of Object.entries(primary)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      merged[key] &&
      typeof merged[key] === "object" &&
      !Array.isArray(merged[key])
    ) {
      merged[key] = mergeMessages(
        merged[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isAppLocale(locale)) {
    locale = routing.defaultLocale;
  }

  const [enMessages, localeMessages, manufacturingOsMessages] = await Promise.all([
    loadBaseMessages("en"),
    loadBaseMessages(locale),
    loadManufacturingOsMessages(locale),
  ]);

  const messages = locale === "en" ? localeMessages : mergeMessages(enMessages, localeMessages);

  return {
    locale,
    messages: {
      ...messages,
      manufacturingOs: manufacturingOsMessages,
    },
  };
});
