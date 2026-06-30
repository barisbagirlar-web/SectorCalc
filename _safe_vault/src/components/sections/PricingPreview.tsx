import Link from "@/lib/navigation/next-link";
import { Container } from "@/components/ui/Container";

export function PricingPreview() {
  return (
    <section className="border-b border-technical-gray bg-white p-3">
      <Container className="p-0">
        <div className="ind-os-panel flex items-center justify-between gap-2 px-4 py-3">
          <p className="text-xs font-medium text-body-charcoal">Intelligence Layer · Pro gate</p>
          <Link
            href="/pro-tools"
            className="text-xs font-semibold text-premium-velvet transition-colors hover:text-body-charcoal"
          >
            Open →
          </Link>
        </div>
      </Container>
    </section>
  );
}
