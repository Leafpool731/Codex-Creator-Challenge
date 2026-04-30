import type { ScoreBreakdownItem } from "@/lib/types";

interface ScoreBreakdownProps {
  items: ScoreBreakdownItem[];
}

export function ScoreBreakdown({ items }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3" aria-label="Season score breakdown">
      {items.map((item) => {
        const ratio = Math.round((item.value / item.max) * 100);

        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-ink">{item.label}</span>
              <span className="text-ink/60">{ratio}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-teal"
                style={{ width: `${ratio}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
