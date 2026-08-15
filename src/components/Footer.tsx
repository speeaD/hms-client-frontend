export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center md:px-12">
        <div>
          <p className="mb-0.5 font-display text-base">Hotelierre</p>
          <p className="text-xs text-faint">14 Brook Street, Victoria Island, Lagos, Nigeria</p>
        </div>
        <p className="text-[11px] text-[#ccc]">© {year} Hotelierre</p>
      </div>
    </footer>
  );
}
