import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import type { ScoreBreakdownItem } from "@/lib/types";

interface SeasonScoringEngineProps {
  items: ScoreBreakdownItem[];
}

export function SeasonScoringEngine({ items }: SeasonScoringEngineProps) {
  return (
    <div>
      <p className="mb-4 text-sm leading-6 text-ink/60">
        Weighted rules across skin depth, undertone (cool, neutral, warm, and olive),
        chroma, contrast, eye structure, eye clarity, and hair depth and temperature.
      </p>
      <ScoreBreakdown items={items} />
    </div>
  );
}
