import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import type { Tool } from "@/data/tools";

interface ToolsPreviewSectionProps {
  title: string;
  subtitle?: string;
  tools: Tool[];
  viewAllHref: string;
  viewAllLabel: string;
}

export function ToolsPreviewSection({
  title,
  subtitle,
  tools,
  viewAllHref,
  viewAllLabel,
}: ToolsPreviewSectionProps) {
  return (
    <section className="border-b border-technical-gray bg-industrial-matte py-6">
      <Container size="wide">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          action={
            <Link
              href={viewAllHref}
              className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-semibold text-premium-velvet transition-colors hover:text-body-charcoal"
            >
              {viewAllLabel} →
            </Link>
          }
        />
        <ToolsTileGrid tools={tools} />
      </Container>
    </section>
  );
}
