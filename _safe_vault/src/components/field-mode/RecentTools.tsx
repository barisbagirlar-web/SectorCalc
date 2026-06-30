"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getRecentTools } from "@/lib/field-mode/recent-tools";
import type { RecentToolEntry } from "@/lib/field-mode/types";

export function RecentTools() {
  const t = useTranslations("fieldMode");
  const [tools, setTools] = useState<readonly RecentToolEntry[]>([]);

  useEffect(() => {
    setTools(getRecentTools());
  }, []);

  return (
    <div>
      <h3 className="text-sm font-semibold text-navy">{t("recentTools")}</h3>
      {tools.length === 0 ? (
        <p className="mt-1 text-sm text-body-charcoal">{t("noRecentTools")}</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {tools.map((tool) => (
            <li key={tool.slug} className="text-sm">
              <a href={tool.href} className="text-copper hover:underline">
                {tool.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
