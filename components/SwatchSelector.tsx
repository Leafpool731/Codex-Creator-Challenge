"use client";

interface SwatchOption {
  id: string;
  label: string;
  hex: string;
}

interface SwatchSelectorProps {
  value: string;
  options: SwatchOption[];
  onChange: (value: string) => void;
}

export function SwatchSelector({ value, options, onChange }: SwatchSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`h-8 w-8 rounded-full border-2 transition ${
              active
                ? "border-[#9f896d] ring-2 ring-[#d7cab8]"
                : "border-white/80 hover:border-[#b89f84]"
            }`}
            style={{ backgroundColor: option.hex }}
            aria-label={option.label}
            title={option.label}
          />
        );
      })}
    </div>
  );
}
