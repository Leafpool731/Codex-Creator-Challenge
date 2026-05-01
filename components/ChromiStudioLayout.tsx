"use client";

import { SkinProfilePanel } from "@/components/SkinProfilePanel";
import { PortraitStudio } from "@/components/portrait/PortraitStudio";

export function ChromiStudioLayout() {
  return (
    <>
      <PortraitStudio />
      <SkinProfilePanel />
    </>
  );
}
