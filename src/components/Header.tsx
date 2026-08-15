const NAV_LINKS = ["Rooms", "Dining", "Spa", "Contact"] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-hairline bg-white/95 px-6 backdrop-blur-md md:px-12">
      <span className="font-display text-lg tracking-[0.04em] text-ink">
        Hotelierre
      </span>

      <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="text-[13px] tracking-[0.02em] text-muted transition-colors hover:text-ink"
          >
            {label}
          </a>
        ))}
      </nav>

      <a
        href="#rooms"
        className="rounded-sm border border-ink px-4 py-2 text-[10px] uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white"
      >
        Reserve
      </a>
    </header>
  );
}
