interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-[#e2d8cf] bg-[#fbf6f1]/82 px-5 py-4 shadow-[0_8px_24px_rgba(85,63,50,0.06)]">
      <p className="text-base font-semibold text-[#3f3530]">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-[#766861]">{description}</p>
    </div>
  );
}
