import { getRequestConfig } from "next-intl/server";
import { routing, isAppLocale } from "@/i18n/routing";

export default getRequestConfig(async () => {
  const locale = "en";

  const [
    enMessages,
    manufacturingOsMessages,
    seoAuthorityMessages,
    leadMagnetMessages,
  ] = await Promise.all([
    import("../../messages/en.json").then((m) => m.default),
    import("./locales/en/manufacturing-os.json").then((m) => m.default),
    import("./locales/en/seo-authority.json").then((m) => m.default),
    import("./locales/en/lead-magnet.json").then((m) => m.default),
  ]);

  return {
    locale,
    messages: {
      ...enMessages,
      manufacturingOs: manufacturingOsMessages,
      seoAuthority: seoAuthorityMessages,
      leadMagnet: leadMagnetMessages,
    },
  };
});

