import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    step: "01",
    title: "Choose your sector",
    description:
      "Select an industry pack aligned with your business — construction, cleaning, restaurant, e-commerce, or CNC manufacturing.",
  },
  {
    step: "02",
    title: "Run the calculator",
    description:
      "Enter your operational inputs. Free tools deliver fast estimates; premium tools add scenario depth and risk signals.",
  },
  {
    step: "03",
    title: "Get the decision",
    description:
      "Review findings, compare scenarios, and export a decision report with clear recommendations for your team or clients.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-off-white py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="How it works"
          title="From numbers to decisions in three steps"
          align="center"
        />
        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="relative rounded-2xl border border-slate/15 bg-white p-8 shadow-card"
            >
              <span className="text-4xl font-bold text-professional-blue/20">
                {item.step}
              </span>
              <h3 className="mt-4 text-xl font-bold text-deep-navy">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{item.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
