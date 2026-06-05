const VALUE_CARDS = [
  {
    title: "Built for real operations",
    description:
      "Manufacturing, service and field teams — not generic spreadsheet users.",
  },
  {
    title: "Includes hidden cost drivers",
    description: "Setup time, waste, labor, capacity and margin risk.",
  },
  {
    title: "Fast reports, lower overhead",
    description: "Get practical decision support without heavy software.",
  },
] as const;

export function HomeOperationsValueSection() {
  return (
    <section className="mc-home-operations" aria-labelledby="home-operations-heading">
      <div className="container">
        <h2 id="home-operations-heading">Built for real operations</h2>
        <div className="mc-home-operations-grid">
          {VALUE_CARDS.map((card) => (
            <article key={card.title} className="mc-home-operations-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
