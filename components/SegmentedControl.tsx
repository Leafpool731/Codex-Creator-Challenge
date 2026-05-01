"use client";

interface SegmentedOption {
  id: string;
  label: string;
}

interface SegmentedControlProps {
  value: string;
  options: SegmentedOption[];
  onChange: (id: string) => void;
}

export function SegmentedControl({
  value,
  options,
  onChange
}: SegmentedControlProps) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl border border-[#d8ccc3] bg-[#f7f1eb] p-1 sm:grid-cols-4 sm:gap-0">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-lg px-2 py-2.5 text-xs font-medium transition sm:py-2 ${
              active
                ? "bg-[#ece2d9] text-[#2f2723] shadow-sm"
                : "text-[#74675f] hover:text-[#2f2723]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
