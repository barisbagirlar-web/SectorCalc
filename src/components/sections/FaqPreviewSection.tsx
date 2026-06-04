import { CONTACT_EMAILS } from "@/config/contact";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HOME_FAQ } from "@/data/faq";

export function FaqPreviewSection() {
  return (
    <section className="border-t border-slate/10 bg-[#f4f6f8] py-16 md:py-24 lg:py-28">
      <Container size="narrow">
        <SectionHeader
          eyebrow="FAQ"
          title="Common questions"
          align="center"
        />
        <dl className="space-y-4">
          {HOME_FAQ.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate/15 bg-off-white p-6"
            >
              <dt className="font-semibold text-deep-navy">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate">{item.answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-center text-sm text-slate">
          More questions?{" "}
          <a
            href={`mailto:${CONTACT_EMAILS.hello}`}
            className="font-semibold text-professional-blue hover:underline"
          >
            Contact support
          </a>
        </p>
      </Container>
    </section>
  );
}
