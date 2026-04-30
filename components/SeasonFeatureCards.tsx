const features = [
  {
    title: "16-Season System",
    body: "Maps your visible coloring across light, warm, cool, soft, bright, and deep seasonal families."
  },
  {
    title: "Transparent Scoring",
    body: "Every match comes from weighted undertone, contrast, chroma, hair, eye, and skin-depth rules."
  },
  {
    title: "Personalized Recommendations",
    body: "Receive palettes, makeup direction, jewelry guidance, and alternate season possibilities."
  }
];

export function SeasonFeatureCards() {
  return (
    <div className="grid gap-3">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="rounded-2xl border border-white/70 bg-white/62 p-4 shadow-[0_16px_42px_rgba(87,64,53,0.08)] backdrop-blur"
        >
          <h3 className="text-sm font-semibold text-stone-950">{feature.title}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">{feature.body}</p>
        </article>
      ))}
    </div>
  );
}
