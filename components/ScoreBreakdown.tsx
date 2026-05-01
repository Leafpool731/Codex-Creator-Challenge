import type { ScoreBreakdownItem } from "@/lib/types";

interface ScoreBreakdownProps {
  items: ScoreBreakdownItem[];
}

export function ScoreBreakdown({ items }: ScoreBreakdownProps) {
  return (
    <div className="space-y-5" aria-label="Season score breakdown">
      {items.map((item) => {
        const ratio = Math.round((item.value / item.max) * 100);

        return (
          <div key={item.label} className="space-y-2">
            <div className="flex min-w-0 items-center justify-between gap-4 text-sm sm:text-[15px]">
              <span className="min-w-0 truncate font-medium text-ink" title={item.label}>
                {item.label}
              </span>
              <span className="shrink-0 tabular-nums text-ink/60">{ratio}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
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
