import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { PaletteSwatches } from "@/components/PaletteSwatches";
import { VirtualModel } from "@/components/VirtualModel";
import { getInitialSelections } from "@/lib/attributes";
import { seasons } from "@/lib/scoring";

const demoSeason = seasons.find((season) => season.id === "bright-spring") ?? seasons[0];

const stats = [
  { label: "Season categories", value: "16" },
  { label: "Model attributes", value: "6" },
  { label: "Image uploads", value: "0" }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="hero-field relative min-h-[82svh] overflow-hidden">
        <AppHeader />
        <div className="absolute inset-x-0 bottom-0 h-2 season-ribbon" aria-hidden="true" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pb-14 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-12">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-ink/10 bg-paper/70 px-4 py-2 text-sm font-semibold text-ink/70 shadow-sm backdrop-blur">
              Image-free color analysis
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal text-ink sm:text-6xl lg:text-7xl">
              ShadeSeason
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
              A beauty-tech studio for exploring 16-season color analysis with a
              customizable virtual model, transparent scoring, and polished
              recommendations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/studio"
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-teal"
              >
                Start analysis
              </Link>
              <Link
                href="/results"
                className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-paper/80 px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-teal/40 hover:bg-white"
              >
                View sample result
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-ink/10 bg-paper/70 p-4 shadow-sm backdrop-blur"
                >
                  <dt className="text-xs font-medium leading-5 text-ink/60">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute left-4 right-4 top-2 h-4 rounded-full season-ribbon opacity-70 blur-sm" />
            <VirtualModel
              selections={getInitialSelections()}
              palette={demoSeason.palette}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-paper px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-teal">
              Competition-ready architecture
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-ink sm:text-4xl">
              Every recommendation is data-backed and inspectable.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "JSON season profiles drive palettes, makeup, jewelry, and rationale.",
              "A reusable TypeScript engine scores every season with the same weighted rules.",
              "Responsive components keep the flow fast, accessible, and demo-friendly."
            ].map((item) => (
              <article
                key={item}
                className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
              >
                <p className="text-sm leading-6 text-ink/70">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-[#f4efe8] px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-rose">
              Sample palette
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-ink">
              {demoSeason.name}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink/70">
              {demoSeason.headline}. The same palette component appears again
              on the result page with makeup and jewelry guidance.
            </p>
          </div>
          <PaletteSwatches palette={demoSeason.palette} />
        </div>
      </section>
    </main>
  );
}
