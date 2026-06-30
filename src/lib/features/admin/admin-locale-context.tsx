"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAdminCaseStudyEditorMessages,
  listAdminCaseStudyEditorLocales,
  type AdminCaseStudyEditorMessages,
} from "@/lib/infrastructure/i18n/admin-case-study-editor-messages";
import {
  getLocaleDefinition,
  isSupportedLocale,
  LOCALE_COOKIE,
  type SupportedLocale,
} from "@/lib/infrastructure/i18n/locale-config";

type AdminLocaleContextValue = {
  readonly locale: SupportedLocale;
  readonly messages: AdminCaseStudyEditorMessages;
  readonly setLocale: (locale: SupportedLocale) => void;
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

function persistLocale(locale: SupportedLocale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

type AdminLocaleProviderProps = {
  readonly initialLocale: SupportedLocale;
  readonly children: ReactNode;
};

export function AdminLocaleProvider({ initialLocale, children }: AdminLocaleProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      messages: getAdminCaseStudyEditorMessages(locale),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>;
}

export function useAdminLocale(): AdminLocaleContextValue {
  const context = useContext(AdminLocaleContext);
  if (!context) {
    throw new Error("useAdminLocale must be used within AdminLocaleProvider");
  }
  return context;
}

export function AdminLocaleSwitcher() {
  const { locale, setLocale } = useAdminLocale();
  const locales = listAdminCaseStudyEditorLocales();

  return (
    <label className="inline-flex min-h-[44px] items-center gap-2 text-sm text-text-secondary">
      <span className="sr-only">Admin UI language</span>
      <select
        value={locale}
        onChange={(event) => {
          const next = event.target.value;
          if (isSupportedLocale(next)) {
            setLocale(next);
          }
        }}
        className="min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm text-deep-navy focus:border-sc-copper focus:outline-none focus:ring-2 focus:ring-sc-copper/20"
        aria-label="Admin UI language"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {getLocaleDefinition(code).nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
