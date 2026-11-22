"use client";

import { useId } from "react";

interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
  /** CSS background for the track, e.g. a gradient of real skin colours. */
  track?: string;
  /** Colour shown inside the thumb. */
  thumb?: string;
  hint?: string;
  valueLabel?: string;
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  minLabel,
  maxLabel,
  track,
  thumb,
  hint,
  valueLabel
}: RangeFieldProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {valueLabel && <span className="text-xs tabular-nums text-muted">{valueLabel}</span>}
      </div>
      <input
        id={id}
        type="range"
        className="range mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--track" as string]: track, ["--thumb" as string]: thumb }}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      <div className="mt-1 flex justify-between text-[11px] font-medium text-faint">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
