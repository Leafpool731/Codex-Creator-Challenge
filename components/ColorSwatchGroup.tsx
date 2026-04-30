"use client";

import type { ColorOption, SkinToneOption } from "@/lib/modelState";

interface ColorSwatchGroupProps {
  label: string;
  options: Array<ColorOption | SkinToneOption>;
  value: string;
  onChange: (value: string) => void;
  columns?: "compact" | "wide";
}

export function ColorSwatchGroup({
  label,
  options,
  value,
  onChange,
  columns = "wide"
}: ColorSwatchGroupProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-stone-900">{label}</legend>
      <div
        className={
          columns === "compact"
            ? "grid grid-cols-4 gap-2"
            : "grid grid-cols-2 gap-2 sm:grid-cols-3"
        }
      >
        {options.map((option) => {
          const selected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex min-h-14 items-center gap-3 rounded-xl border bg-white/74 px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#9b786f] ${
                selected
                  ? "border-[#7b4f47] ring-2 ring-[#7b4f47]/15"
                  : "border-stone-200"
              }`}
              aria-pressed={selected}
            >
              <span
                className="h-7 w-7 shrink-0 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: option.hex }}
                aria-hidden="true"
              />
              <span className="min-w-0 text-xs font-semibold leading-4 text-stone-800">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
