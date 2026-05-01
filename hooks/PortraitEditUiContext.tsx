"use client";

import { createContext, useContext } from "react";
import type { PortraitEditUiState } from "@/hooks/usePortraitEdit";

const PortraitEditUiContext = createContext<PortraitEditUiState | null>(null);

export function PortraitEditUiProvider({
  value,
  children
}: {
  value: PortraitEditUiState;
  children: React.ReactNode;
}) {
  return (
    <PortraitEditUiContext.Provider value={value}>{children}</PortraitEditUiContext.Provider>
  );
}

export function usePortraitEditUi(): PortraitEditUiState {
  const context = useContext(PortraitEditUiContext);

  if (!context) {
    throw new Error("usePortraitEditUi requires PortraitEditUiProvider");
  }

  return context;
}
