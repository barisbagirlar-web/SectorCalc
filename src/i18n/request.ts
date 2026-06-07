import { getRequestConfig } from "next-intl/server";
import { routing, isAppLocale } from "@/i18n/routing";

async function loadManufacturingOsMessages(locale: string) {
 try {
 return (await import(`./locales/${locale}/manufacturing-os.json`)).default;
 } catch {
 return (await import("./locales/en/manufacturing-os.json")).default;
 }
}

export default getRequestConfig(async ({ requestLocale }) => {
 let locale = await requestLocale;

 if (!locale || !isAppLocale(locale)) {
 locale = routing.defaultLocale;
 }

 const [baseMessages, manufacturingOsMessages] = await Promise.all([
 import(`../../messages/${locale}.json`),
 loadManufacturingOsMessages(locale),
 ]);

 return {
 locale,
 messages: {
 ...baseMessages.default,
 manufacturingOs: manufacturingOsMessages,
 },
 };
});
