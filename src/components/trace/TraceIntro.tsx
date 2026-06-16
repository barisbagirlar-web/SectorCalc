"use client";

import { ArrowRight, Route, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { TRACE_BRAND } from "@/config/trace";

export function openTraceChat(): void {
  if (typeof window === "undefined") {
    return;
  }

  const fab = document.getElementById("trace-fab");
  if (fab) {
    if (fab.getAttribute("aria-expanded") !== "true") {
      fab.click();
    }
    return;
  }

  window.dispatchEvent(new CustomEvent("trace:open"));
}

export function TraceIntro() {
  const t = useTranslations("trace");

  return (
    <section className="sc-trace-intro" aria-labelledby="trace-intro-heading">
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <div className="sc-trace-intro__card">
          <div className="sc-trace-intro__inner">
            <div className="sc-trace-intro__avatar-wrap">
              <Image
                src={TRACE_BRAND.avatar}
                alt={t("title")}
                width={80}
                height={80}
                className="sc-trace-intro__avatar-image"
              />
            </div>

            <div className="sc-trace-intro__copy">
              <div className="sc-trace-intro__badge-row">
                <Route className="sc-trace-intro__badge-icon" aria-hidden />
                <span className="sc-trace-intro__badge">{t("intro.badge")}</span>
              </div>

              <h2 id="trace-intro-heading" className="sc-trace-intro__title">
                {t("intro.title")}
              </h2>

              <p className="sc-trace-intro__description">{t("intro.description")}</p>

              <ul className="sc-trace-intro__features">
                <li className="sc-trace-intro__feature">
                  <Sparkles className="sc-trace-intro__feature-icon" aria-hidden />
                  <span>{t("intro.feature1")}</span>
                </li>
                <li className="sc-trace-intro__feature">
                  <Route className="sc-trace-intro__feature-icon" aria-hidden />
                  <span>{t("intro.feature2")}</span>
                </li>
              </ul>

              <button type="button" className="sc-cta-primary sc-trace-intro__cta" onClick={openTraceChat}>
                <span>{t("intro.cta")}</span>
                <ArrowRight className="sc-trace-intro__cta-icon" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
