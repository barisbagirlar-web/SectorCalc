import { redirect } from "next/navigation";

/** Locale-neutral entry — routes to English pilot page (i18n lives under /[locale]). */
export default function MachineTimeCalculatorRedirectPage() {
  redirect("/en/tools/free/machine-time-calculator");
}
