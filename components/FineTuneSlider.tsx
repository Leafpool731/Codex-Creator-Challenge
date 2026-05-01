"use client";

interface FineTuneSliderProps {
  label: string;
  /** Left end label */
  minLabel: string;
  /** Right end label */
  maxLabel: string;
  /** -50 … +50, 0 = center */
  value: number;
  onChange: (value: number) => void;
}

export function FineTuneSlider({
  label,
  minLabel,
  maxLabel,
  value,
  onChange
}: FineTuneSliderProps) {
  const slider = value + 50;

  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[#4f443f]">{label}</span>
        <span className="tabular-nums text-xs text-[#7e7069]">
          {value === 0 ? "0" : value > 0 ? `+${value}` : `${value}`}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={slider}
        onChange={(event) => onChange(Number(event.target.value) - 50)}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d9cec6]"
      />
      <div className="flex justify-between text-xs text-[#8f8178]">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </label>
  );
}
