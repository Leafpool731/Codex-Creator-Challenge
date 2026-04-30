"use client";

import type { AttributeKey, ModelAttributeGroup } from "@/lib/types";

interface AttributeControlProps {
  group: ModelAttributeGroup;
  value: string;
  onChange: (key: AttributeKey, value: string) => void;
}

export function AttributeControl({
  group,
  value,
  onChange
}: AttributeControlProps) {
  const helperId = `${group.id}-helper`;

  return (
    <fieldset className="space-y-3">
      <div>
        <legend className="text-base font-semibold text-ink">{group.label}</legend>
        <p id={helperId} className="mt-1 text-sm leading-6 text-ink/60">
          {group.helper}
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        role="radiogroup"
        aria-describedby={helperId}
      >
        {group.options.map((option) => {
          const checked = value === option.id;

          return (
            <label
              key={option.id}
              className={`choice-tile flex min-h-20 cursor-pointer items-start gap-3 rounded-lg p-3 ${
                checked
                  ? "border-teal/60 bg-white shadow-soft ring-2 ring-teal/15"
                  : "hover:bg-white/80"
              }`}
            >
              <input
                type="radio"
                name={group.id}
                value={option.id}
                checked={checked}
                onChange={() => onChange(group.id, option.id)}
                className="sr-only"
              />
              <span
                className="mt-1 h-5 w-5 shrink-0 rounded-full border border-ink/15 shadow-inner"
                style={{ backgroundColor: option.hex ?? "#fffaf4" }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-5 text-ink">
                  {option.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-ink/60">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
