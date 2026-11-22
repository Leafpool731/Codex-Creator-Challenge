"use client";

interface SwatchOption {
  id: string;
  hex: string;
  label: string;
}

interface SwatchPickerProps {
  label: string;
  options: SwatchOption[];
  value: string;
  onChange: (id: string) => void;
}

export function SwatchPicker({ label, options, value, onChange }: SwatchPickerProps) {
  const selected = options.find((o) => o.id === value);
  return (
    <fieldset>
      <legend className="flex w-full items-baseline justify-between gap-3 text-sm font-medium text-ink">
        <span>{label}</span>
        <span className="text-xs font-normal text-muted">{selected?.label}</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={o.label}
              title={o.label}
              onClick={() => onChange(o.id)}
              className={`grid h-9 w-9 place-items-center rounded-full transition ${
                active ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : "hover:scale-110"
              }`}
            >
              <span
                className="h-8 w-8 rounded-full shadow-[inset_0_0_0_1px_rgba(26,23,21,0.12),inset_0_-6px_10px_rgba(0,0,0,0.12),inset_0_4px_8px_rgba(255,255,255,0.18)]"
                style={{ backgroundColor: o.hex }}
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
