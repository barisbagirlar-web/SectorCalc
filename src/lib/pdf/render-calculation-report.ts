import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { CalculationReport } from "@/lib/pdf/CalculationReport";
import type { CalculationReportProps } from "@/lib/pdf/calculation-report-types";

export async function renderCalculationReportPdf(
  props: CalculationReportProps,
): Promise<Buffer> {
  const element = React.createElement(CalculationReport, props);
  return renderToBuffer(element as React.ReactElement<DocumentProps>);
}
