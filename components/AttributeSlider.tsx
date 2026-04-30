"use client";

interface AttributeSliderProps {
  id: string;
  label: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function AttributeSlider({
  id,
  label,
  minLabel,
  maxLabel,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange
}: AttributeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-stone-900">
          {label}
        </label>
        <span className="text-xs font-medium text-stone-500">{Math.round(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-stone-300 via-[#d8b9ad] to-[#9b6759] accent-[#7b4f47]"
      />
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
