"use client";

import ProToolForm from "./ProToolForm";

interface ProToolClientWrapperProps {
  tool: any;
  locale: string;
}

export default function ProToolClientWrapper({ tool, locale }: ProToolClientWrapperProps) {
  if (!tool) {
    return <div style={{ padding: 40, textAlign: "center", color: "rgba(26,25,21,0.4)" }}>Tool not found.</div>;
  }
  return <ProToolForm tool={tool} locale={locale} />;
}
