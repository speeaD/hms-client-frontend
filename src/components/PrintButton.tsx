"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 rounded-full border border-[#1B2E28]/15 px-4 py-2 text-sm font-medium text-[#1B2E28] transition-colors hover:bg-[#1B2E28] hover:text-[#F6F4EE]"
    >
      Print confirmation
    </button>
  );
}
