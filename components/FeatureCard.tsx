interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-[#e2d8cf] bg-[#f8f2ec] px-4 py-3 shadow-[0_8px_24px_rgba(85,63,50,0.06)]">
      <p className="text-sm font-semibold text-[#3f3530]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#766861]">{description}</p>
    </div>
  );
}
