"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FmeaRpnLegacyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/calculators/fmea-rpn");
  }, [router]);
  return null;
}
