"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F4EE] px-6">
      <div className="max-w-md text-center">
        <p className="text-sm text-[#B54834]">Something went wrong</p>
        <h1 className="mt-2 font-serif text-3xl text-[#1B2E28]">We couldn&rsquo;t load your reservation</h1>
        <p className="mt-3 text-[#6B6558]">
          This is usually temporary. Try again, or contact the front desk if the problem continues.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1B2E28] px-5 py-2.5 text-sm font-medium text-[#F6F4EE] transition-colors hover:bg-[#16241F]"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
