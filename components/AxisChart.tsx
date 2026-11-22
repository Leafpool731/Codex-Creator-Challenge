"use client";

import { useTranslations } from "next-intl";
import { axes, type Axis } from "@/lib/analysis";
import type { Coordinates } from "@/lib/profile";

const trackGradient: Record<Axis, string> = {
  temperature: "linear-gradient(90deg,#9db4d6,#e9e3dc 50%,#e2b071)",
  value: "linear-gradient(90deg,#f3ece4,#3b2f29)",
  chroma: "linear-gradient(90deg,#b7aba3,#d9405a)",
  contrast: "linear-gradient(90deg,#d8cfc7,#d8cfc7 30%,#1a1715)"
};

function position(axis: Axis, v: number): number {
  return axis === "temperature" ? ((v + 1) / 2) * 100 : v * 100;
}

interface AxisChartProps {
  profile: Coordinates;
  season?: Coordinates;
  compact?: boolean;
}

export function AxisChart({ profile, season, compact = false }: AxisChartProps) {
  const t = useTranslations("axes");
  return (
    <dl className={compact ? "space-y-3" : "space-y-5"}>
      {axes.map((axis) => (
        <div key={axis}>
          <dt className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-ink">{t(axis)}</span>
            <span className="text-faint">
              {t(`${axis}Min`)} — {t(`${axis}Max`)}
            </span>
          </dt>
          <dd className="relative mt-2 h-2 rounded-full" style={{ background: trackGradient[axis] }}>
            {season && (
              <span
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-transparent"
                style={{ left: `${position(axis, season[axis])}%` }}
                aria-hidden="true"
              />
            )}
            <span
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_2px_#fffdfb] transition-[left] duration-300"
              style={{ left: `${position(axis, profile[axis])}%` }}
              aria-label={`${t(axis)} ${Math.round(position(axis, profile[axis]))}%`}
            />
          </dd>
        </div>
      ))}
    </dl>
  );
}
