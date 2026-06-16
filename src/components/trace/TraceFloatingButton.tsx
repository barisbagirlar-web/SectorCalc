"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useUser";
import { FreeTraceChat } from "@/components/trace/FreeTraceChat";
import { ProTraceChat } from "@/components/trace/ProTraceChat";
import { TraceLivingAvatar } from "@/components/trace/TraceLivingAvatar";

export function TraceFloatingButton() {
  const t = useTranslations("trace");
  const { user, userRole, loading } = useUser();
  const isPro = userRole === "premium" && Boolean(user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("trace:open", openHandler);
    return () => window.removeEventListener("trace:open", openHandler);
  }, []);

  return (
    <div data-trace-assistant="true" className="sc-trace">
      {open ? (
        <div className="sc-trace__panel sc-trace__panel--open" role="dialog" aria-label={t("launcher")}>
          {isPro ? (
            <ProTraceChat onClose={() => setOpen(false)} />
          ) : (
            <FreeTraceChat onClose={() => setOpen(false)} />
          )}
        </div>
      ) : null}

      <button
        id="trace-fab"
        type="button"
        className={open ? "sc-trace__fab sc-trace__fab--open" : "sc-trace__fab"}
        aria-expanded={open}
        aria-label={t("launcher")}
        onClick={() => setOpen((value) => !value)}
        disabled={loading}
      >
        <TraceLivingAvatar size="fab" className="sc-trace__fab-avatar" />

        {open ? <X className="sc-trace__fab-close-icon" aria-hidden="true" /> : null}
      </button>
    </div>
  );
}
