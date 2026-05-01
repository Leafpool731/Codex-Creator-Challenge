import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import type { ScoreBreakdownItem } from "@/lib/types";

interface SeasonScoringEngineProps {
  items: ScoreBreakdownItem[];
  intro: string;
}

export function SeasonScoringEngine({ items, intro }: SeasonScoringEngineProps) {
  return (
    <div>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink/60">{intro}</p>
      <ScoreBreakdown items={items} />
    </div>
  );
}
