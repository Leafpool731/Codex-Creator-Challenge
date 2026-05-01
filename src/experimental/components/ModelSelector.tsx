"use client";

import Image from "next/image";
import { useState } from "react";
import { portraitModels, usePortraitStudio } from "@/lib/portraitStudioStore";

export function ModelSelector() {
  const { state, setState } = usePortraitStudio();
  const [failedIds, setFailedIds] = useState<string[]>([]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#4f443f]">Base model</p>
      <p className="text-xs leading-5 text-[#897c74]">
        Nine photoreal anchors. Pick the face closest to yours, then refine below.
      </p>
      <div
        className="grid grid-cols-3 gap-2 sm:grid-cols-3"
        role="listbox"
        aria-label="Choose base portrait model"
      >
        {portraitModels.map((model) => {
          const failed = failedIds.includes(model.id);
          const active = model.id === state.modelId;

          return (
            <button
              key={model.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => setState({ modelId: model.id })}
              className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border text-left transition ${
                active
                  ? "border-[#3d322c] ring-2 ring-[#d7cab8]"
                  : "border-[#d9cec5] hover:border-[#9f896d]"
              }`}
            >
              {failed ? (
                <span className="grid h-full place-items-center bg-[#ece3da] px-1 text-center text-[10px] leading-3 text-[#7d7069]">
                  Add portrait to /public/models
                </span>
              ) : (
                <Image
                  src={model.src}
                  alt={model.label}
                  fill
                  sizes="120px"
                  className="object-cover object-top"
                  onError={() =>
                    setFailedIds((current) => [...new Set([...current, model.id])])
                  }
                />
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 pb-2 pt-6 text-[10px] font-semibold leading-tight text-white">
                {model.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
