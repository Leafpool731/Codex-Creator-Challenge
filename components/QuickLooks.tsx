"use client";

import Image from "next/image";
import { useState } from "react";
import { quickLookOptions, usePortraitStudio } from "@/lib/portraitStudioStore";

export function QuickLooks() {
  const { state, setState } = usePortraitStudio();
  const [failedIds, setFailedIds] = useState<string[]>([]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#4f443f]">Quick looks</p>
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Quick look presets">
        {quickLookOptions.map((look) => {
          const failed = failedIds.includes(look.id);
          const active = look.id === state.modelId;

          return (
            <button
              key={look.id}
              type="button"
              onClick={() => setState(look.state)}
              aria-label={`Apply ${look.label} preset`}
              aria-pressed={active}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border bg-[#ece3da] transition ${
                active
                  ? "border-[#3d322c] ring-2 ring-[#d7cab8]"
                  : "border-[#d9cec5] hover:border-[#9f896d]"
              }`}
              title={look.label}
            >
              {failed ? (
                <span className="grid h-full place-items-center px-1 text-center text-[10px] leading-3 text-[#7d7069]">
                  Missing
                </span>
              ) : (
                <Image
                  src={look.src}
                  alt={look.label}
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                  onError={() =>
                    setFailedIds((current) => [...new Set([...current, look.id])])
                  }
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
