"use client";

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}

export function SliderControl({
  label,
  value,
  onChange,
  minLabel,
  maxLabel
}: SliderControlProps) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[#4f443f]">{label}</span>
        <span className="text-xs text-[#7e7069]">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d9cec6]"
      />
      <div className="flex justify-between text-xs text-[#8f8178]">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </label>
  );
}
