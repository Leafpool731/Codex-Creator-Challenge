import { Suspense } from "react";
import { AppHeader } from "@/components/AppHeader";
import { VirtualModel } from "@/components/VirtualModel";
import { getInitialSelections } from "@/lib/attributes";
import { seasons } from "@/lib/scoring";
import StudioClient from "./StudioClient";

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-paper">
      <AppHeader />
      <Suspense
        fallback={
          <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-2xl p-6">
              <VirtualModel
                selections={getInitialSelections()}
                palette={seasons[0].palette}
              />
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <p className="text-sm font-semibold text-ink/70">Loading studio...</p>
            </div>
          </section>
        }
      >
        <StudioClient />
      </Suspense>
    </main>
  );
}
