"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { PremiumPrintableReport } from "@/components/reports/PremiumPrintableReport";
import { PremiumPrintToolbar } from "@/components/reports/PremiumReportExportActions";
import { usePremiumSchemaEntitlementBySlug } from "@/lib/entitlements/use-premium-schema-entitlement";
import { gatePremiumReportExportPayload } from "@/lib/premium-schema/premium-report-gate";
import type { PremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";

export interface PremiumPrintReportShellProps {
  payload: PremiumReportExportPayload;
  locale: string;
  backHref: string;
  legacyPaidSlug?: string;
}

export function PremiumPrintReportShell({
  payload,
  locale,
  backHref,
  legacyPaidSlug,
}: PremiumPrintReportShellProps) {
  const { entitlement, checkoutHref } = usePremiumSchemaEntitlementBySlug(
    payload.schemaSlug,
    legacyPaidSlug
  );
  const isSample = !entitlement.canExportPdf;
  const displayPayload = gatePremiumReportExportPayload(payload, entitlement);

  return (
    <PageLayout>
      <Container className="sc-print-page py-6 md:py-10">
        <PremiumPrintToolbar
          backHref={backHref}
          entitlement={entitlement}
          checkoutHref={checkoutHref}
        />
        <PremiumPrintableReport payload={displayPayload} locale={locale} isSample={isSample} />
      </Container>
    </PageLayout>
  );
}
