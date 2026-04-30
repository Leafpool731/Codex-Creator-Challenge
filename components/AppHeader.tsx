import Link from "next/link";

export function AppHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <Link
        href="/"
        className="group inline-flex items-center gap-3 rounded-full text-ink"
        aria-label="ShadeSeason home"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-paper shadow-sm transition group-hover:border-teal/40">
          <span className="h-5 w-5 rounded-full season-ribbon" aria-hidden="true" />
        </span>
        <span className="text-base font-semibold tracking-normal">ShadeSeason</span>
      </Link>

      <nav aria-label="Primary navigation" className="flex items-center gap-2">
        <Link
          href="/studio"
          className="rounded-full border border-ink/10 bg-paper/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-teal/40 hover:bg-white"
        >
          Studio
        </Link>
      </nav>
    </header>
  );
}
