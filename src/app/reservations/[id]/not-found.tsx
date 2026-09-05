import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F4EE] px-6">
      <div className="max-w-md text-center">
        <p className="text-sm text-[#B8935F]">Reservation not found</p>
        <h1 className="mt-2 font-serif text-3xl text-[#1B2E28]">We can&rsquo;t find that booking</h1>
        <p className="mt-3 text-[#6B6558]">
          The reservation link may be incorrect, or the booking may have been cancelled. Check the
          link in your confirmation email, or contact the front desk for help.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1B2E28] px-5 py-2.5 text-sm font-medium text-[#F6F4EE] transition-colors hover:bg-[#16241F]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
