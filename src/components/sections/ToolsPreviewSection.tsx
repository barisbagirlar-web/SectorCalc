import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import type { Tool } from "@/data/tools";

type SectionVariant = "white" | "off-white" | "muted" | "dark";

interface ToolsPreviewSectionProps {
  title: string;
  subtitle?: string;
  tools: Tool[];
  viewAllHref: string;
  viewAllLabel: string;
  variant?: SectionVariant;
}

const surfaceClasses: Record<SectionVariant, string> = {
  white: "bg-white border-y border-border-subtle",
  "off-white": "bg-bg-subtle",
  muted: "bg-[#f4f6f8] border-y border-border-subtle",
  dark: "bg-bg-primary border-y border-border-subtle",
};

export function ToolsPreviewSection({
  title,
  subtitle,
  tools,
  viewAllHref,
  viewAllLabel,
  variant = "white",
}: ToolsPreviewSectionProps) {
  const dark = variant === "dark";

  return (
    <section className={`py-16 md:py-24 lg:py-28 ${surfaceClasses[variant]}`}>
      <Container size="wide">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          dark={dark}
          action={
            <Link
              href={viewAllHref}
              className={`shrink-0 text-sm font-semibold min-h-[44px] inline-flex items-center ${
                dark ? "text-accent-teal hover:text-white" : "text-accent-teal hover:underline"
              }`}
            >
              {viewAllLabel} →
            </Link>
          }
        />
        <ToolsTileGrid tools={tools} onDark={dark} />
      </Container>
    </section>
  );
}
