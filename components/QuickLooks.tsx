"use client";

import Image from "next/image";
import { useState } from "react";
import { quickLookOptions } from "@/lib/portraitStudioStore";

export function QuickLooks() {
  const [failedIds, setFailedIds] = useState<string[]>([]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#4f443f]">Quick looks</p>
      <div className="grid grid-cols-4 gap-2">
        {quickLookOptions.map((look) => {
          const failed = failedIds.includes(look.id);
          return (
            <div
              key={look.id}
              className="overflow-hidden rounded-xl border border-[#d9cec5] bg-[#ece3da]"
              title={look.label}
            >
              {failed ? (
                <div className="grid h-16 place-items-center text-[10px] text-[#7d7069]">
                  Missing
                </div>
              ) : (
                <Image
                  src={look.src}
                  alt={look.label}
                  width={90}
                  height={78}
                  className="h-16 w-full object-cover"
                  onError={() =>
                    setFailedIds((current) => [...new Set([...current, look.id])])
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
