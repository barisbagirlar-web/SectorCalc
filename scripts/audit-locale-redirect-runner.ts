import {
  COUNTRY_TO_LOCALE,
  resolveRootVisitLocale,
  shouldRedirectLocaleLessPublicRoute,
  shouldRedirectRootToLocale,
  shouldRedirectUnlocalizedPath,
} from "../src/lib/i18n/locale-routing";

const checks = [
  {
    name: "TR country resolves tr",
    pass:
      resolveRootVisitLocale({
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: "en-US,en;q=0.9",
      }) === "tr",
  },
  {
    name: "cf country TR resolves tr",
    pass:
      resolveRootVisitLocale({
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }) === "tr",
  },
  {
    name: "Accept-Language tr-TR resolves tr",
    pass:
      resolveRootVisitLocale({
        cookieLocale: undefined,
        countryCode: null,
        acceptLanguage: "tr-TR,tr;q=0.9,en;q=0.8",
      }) === "tr",
  },
  {
    name: "implicit en cookie ignored for TR country",
    pass:
      resolveRootVisitLocale({
        cookieLocale: "en",
        manualCookie: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }) === "tr",
  },
  {
    name: "manual en cookie honored",
    pass:
      resolveRootVisitLocale({
        cookieLocale: "en",
        manualCookie: "1",
        countryCode: "TR",
        acceptLanguage: null,
      }) === "en",
  },
  {
    name: "Accept-Language en resolves en",
    pass:
      resolveRootVisitLocale({
        cookieLocale: undefined,
        countryCode: null,
        acceptLanguage: "en-US,en;q=0.9",
      }) === "en",
  },
  {
    name: "root TR redirect target",
    pass:
      shouldRedirectRootToLocale({
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }) === "tr",
  },
  {
    name: "locale-less /free-tools TR redirect",
    pass:
      shouldRedirectLocaleLessPublicRoute({
        pathname: "/free-tools",
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }) === "tr",
  },
  {
    name: "locale-less /free-tools EN no redirect",
    pass:
      shouldRedirectLocaleLessPublicRoute({
        pathname: "/free-tools",
        cookieLocale: undefined,
        countryCode: null,
        acceptLanguage: "en-US,en;q=0.9",
      }) === null,
  },
  {
    name: "unlocalized tool path TR redirect",
    pass:
      shouldRedirectUnlocalizedPath({
        pathname: "/tools/generated/margin-calculator",
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }) === "tr",
  },
  {
    name: "prefixed tool path TR no redirect",
    pass:
      shouldRedirectUnlocalizedPath({
        pathname: "/tr/tools/generated/margin-calculator",
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }) === null,
  },
];

console.log(JSON.stringify({ checks, countryTr: COUNTRY_TO_LOCALE.TR }));
