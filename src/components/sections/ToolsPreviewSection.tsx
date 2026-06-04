import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolCard } from "@/components/cards/ToolCard";
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
  white: "bg-white border-y border-slate/10",
  "off-white": "bg-off-white",
  muted: "bg-[#f4f6f8] border-y border-slate/10",
  dark: "bg-dark-navy border-y border-white/5",
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
                dark ? "text-cyan hover:text-white" : "text-professional-blue hover:underline"
              }`}
            >
              {viewAllLabel} →
            </Link>
          }
        />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} onDark={dark} />
          ))}
        </div>
      </Container>
    </section>
  );
}
