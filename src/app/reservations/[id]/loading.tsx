export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F6F4EE] pb-16">
      <div className="animate-pulse bg-[#1B2E28]/90">
        <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
          <div className="h-4 w-40 rounded bg-white/20" />
          <div className="mt-3 h-9 w-64 rounded bg-white/20" />
          <div className="mt-4 h-4 w-72 rounded bg-white/10" />
          <div className="mt-6 flex gap-2">
            <div className="h-7 w-24 rounded-full bg-white/20" />
            <div className="h-7 w-20 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-6">
        <div className="-mt-6 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border-b border-[#E7E2D5] px-6 py-8 last:border-b-0 sm:px-8">
              <div className="h-5 w-32 rounded bg-[#E7E2D5]" />
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div className="h-4 w-full rounded bg-[#EFECE2]" />
                <div className="h-4 w-full rounded bg-[#EFECE2]" />
                <div className="h-4 w-full rounded bg-[#EFECE2]" />
                <div className="h-4 w-full rounded bg-[#EFECE2]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
