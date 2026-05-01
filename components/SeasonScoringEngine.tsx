import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import type { ScoreBreakdownItem } from "@/lib/types";

interface SeasonScoringEngineProps {
  items: ScoreBreakdownItem[];
}

export function SeasonScoringEngine({ items }: SeasonScoringEngineProps) {
  return (
    <div>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink/60">
        Weighted rules across skin depth, undertone (cool, neutral, warm, and olive),
        chroma, contrast, eye structure, eye clarity, and hair depth and temperature.
      </p>
      <ScoreBreakdown items={items} />
    </div>
  );
}
