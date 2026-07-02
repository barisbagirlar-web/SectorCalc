"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n-stub";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPwaPrompt() {
  const t = useTranslations("fieldMode");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) {
      return;
    }
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <div data-pwa-install-prompt="true" className="flex items-center justify-between gap-3">
      <p className="text-sm text-body-charcoal">{t("offlineReady")}</p>
      {deferred && !installed ? (
        <button
          type="button"
          onClick={install}
          className="min-h-[44px] rounded-lg bg-copper px-4 text-sm font-semibold text-white"
        >
          {t("install")}
        </button>
      ) : null}
    </div>
  );
}
