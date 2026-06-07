"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { PremiumPrintableReport } from "@/components/reports/PremiumPrintableReport";
import { PremiumPrintToolbar } from "@/components/reports/PremiumReportExportActions";
import type { PremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";

export interface PremiumPrintReportShellProps {
  payload: PremiumReportExportPayload;
  locale: string;
  backHref: string;
}

export function PremiumPrintReportShell({
  payload,
  locale,
  backHref,
}: PremiumPrintReportShellProps) {
  return (
    <PageLayout>
      <Container className="sc-print-page py-6 md:py-10">
        <PremiumPrintToolbar backHref={backHref} />
        <PremiumPrintableReport payload={payload} locale={locale} />
      </Container>
    </PageLayout>
  );
}
