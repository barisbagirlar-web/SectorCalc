import { redirect } from "next/navigation";

/** Locale-neutral entry — English canonical path (no /en prefix). */
export default function MachineTimeCalculatorRedirectPage() {
  redirect("/tools/free/machine-time-calculator");
}
