import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getReservationById } from "@/lib/reservations";
import { StatusBadge } from "@/components/StatusBadge";
import { PrintButton } from "@/components/PrintButton";
import {
  formatCurrency,
  formatDate,
  formatDateShort,
  formatGuestCount,
  nightsBetween,
  formatRoomType,
  formatBedType,
} from "@/lib/format";

export const metadata: Metadata = {
  title: "Reservation confirmation",
};

// This page always fetches fresh data server-side (see cache: "no-store"
// in lib/reservations.ts) — it's confirming a payment result, so it must
// never show a stale/cached status. No client-side fetching happens here.
export default async function ReservationConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const reservation = await getReservationById(params.id);

  if (!reservation) {
    notFound();
  }

  const { room } = reservation;
  const nights = nightsBetween(reservation.checkInDate, reservation.checkOutDate);
  const guestName = `${reservation.firstName} ${reservation.lastName}`;

  // Prefer the matching transaction's own amount/reference if your API
  // includes `transactions` (see README); otherwise fall back to the
  // reservation's own totals so the page still works either way.
  const latestTransaction = reservation.transactions?.length
    ? [...reservation.transactions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : undefined;

  return (
    <main className="min-h-screen bg-[#F6F4EE] pb-16 print:bg-white print:pb-0">
      {/* Confirmation header */}
      <header className="bg-[#1B2E28] text-[#F6F4EE] print:border-b print:border-black print:bg-white print:text-black">
        <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
          <p className="text-sm text-[#B8935F] print:text-black">
            Booking reference {reservation.id}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Reservation confirmed</h1>
          <p className="mt-3 max-w-md text-[#F6F4EE]/75 print:text-black">
            Thanks, {reservation.firstName}. Here&rsquo;s a summary of your stay — keep this page
            for your records.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <StatusBadge status={reservation.status} kind="reservation" />
            <StatusBadge status={reservation.paymentStatus} kind="payment" />
          </div>
        </div>
      </header>

      {/* Folio document */}
      <div className="mx-auto max-w-2xl px-6">
        <div className="-mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 print:mt-0 print:rounded-none print:shadow-none print:ring-0">
          <div className="flex items-center justify-between border-b border-[#E7E2D5] px-6 py-4 sm:px-8 print:border-black">
            <p className="text-sm text-[#6B6558] print:text-black">
              Confirmed {formatDate(reservation.createdAt)}
            </p>
            <PrintButton />
          </div>

          {/* Guest information */}
          <section className="border-b border-[#E7E2D5] px-6 py-8 sm:px-8 print:border-black print:py-6">
            <h2 className="font-serif text-xl text-[#1B2E28]">Guest details</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-[#8A8575]">Name</dt>
                <dd className="mt-0.5 text-[#1B2E28]">{guestName}</dd>
              </div>
              <div>
                <dt className="text-sm text-[#8A8575]">Guests</dt>
                <dd className="mt-0.5 text-[#1B2E28]">{formatGuestCount(reservation.numberOfGuests)}</dd>
              </div>
              <div>
                <dt className="text-sm text-[#8A8575]">Email</dt>
                <dd className="mt-0.5 break-all text-[#1B2E28]">{reservation.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-[#8A8575]">Phone</dt>
                <dd className="mt-0.5 text-[#1B2E28]">{reservation.phone}</dd>
              </div>
            </dl>
          </section>

          {/* Stay information */}
          <section className="border-b border-[#E7E2D5] px-6 py-8 sm:px-8 print:border-black print:py-6">
            <h2 className="font-serif text-xl text-[#1B2E28]">Stay details</h2>

            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Room key-card motif */}
              <div className="flex shrink-0 items-center gap-4 rounded-xl border border-[#1B2E28]/10 bg-[#1B2E28] px-5 py-4 text-[#F6F4EE] print:border-black print:bg-white print:text-black">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#B8935F] print:text-black">
                    Room
                  </p>
                  <p className="font-serif text-2xl leading-none">{room.roomNumber}</p>
                </div>
                <div className="h-8 w-px bg-white/15 print:bg-black" />
                <div>
                  <p className="text-sm">{formatRoomType(room.type)}</p>
                  <p className="text-xs text-[#F6F4EE]/70 print:text-black">
                    {formatBedType(room.bedType)} · Floor {room.floor}
                  </p>
                </div>
              </div>

              <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-[#8A8575]">Check-in</dt>
                  <dd className="mt-0.5 text-[#1B2E28]">{formatDateShort(reservation.checkInDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[#8A8575]">Check-out</dt>
                  <dd className="mt-0.5 text-[#1B2E28]">{formatDateShort(reservation.checkOutDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[#8A8575]">Nights</dt>
                  <dd className="mt-0.5 text-[#1B2E28]">{nights}</dd>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <dt className="text-sm text-[#8A8575]">Room</dt>
                  <dd className="mt-0.5 text-[#1B2E28]">
                    {room.name} · Sleeps {room.capacity}
                  </dd>
                </div>
                {room.amenities?.length > 0 && (
                  <div className="col-span-2 sm:col-span-3">
                    <dt className="text-sm text-[#8A8575]">Amenities</dt>
                    <dd className="mt-0.5 text-[#1B2E28]">{room.amenities.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          {/* Payment summary */}
          <section className="px-6 py-8 sm:px-8 print:py-6">
            <h2 className="font-serif text-xl text-[#1B2E28]">Payment summary</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-[#8A8575]">Total paid</dt>
                <dd className="mt-0.5 text-lg text-[#1B2E28]">
                  {formatCurrency(latestTransaction?.amount ?? reservation.totalAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-[#8A8575]">Payment status</dt>
                <dd className="mt-0.5">
                  <StatusBadge status={reservation.paymentStatus} kind="payment" />
                </dd>
              </div>
              {latestTransaction?.paystackReference && (
                <div>
                  <dt className="text-sm text-[#8A8575]">Payment reference</dt>
                  <dd className="mt-0.5 font-mono text-sm text-[#1B2E28]">
                    {latestTransaction.paystackReference}
                  </dd>
                </div>
              )}
              {latestTransaction?.paidAt && (
                <div>
                  <dt className="text-sm text-[#8A8575]">Paid on</dt>
                  <dd className="mt-0.5 text-[#1B2E28]">{formatDate(latestTransaction.paidAt)}</dd>
                </div>
              )}
            </dl>

            {reservation.paymentStatus !== "paid" && (
              <p className="mt-6 rounded-lg bg-[#F3E6DC] px-4 py-3 text-sm text-[#8A4E22] print:border print:border-black print:bg-transparent print:text-black">
                {reservation.paymentStatus === "pending"
                  ? "We haven't received payment for this reservation yet. If you already paid, this can take a few minutes to update."
                  : "There's an issue with the payment on this reservation. Contact us if you need help."}
              </p>
            )}
          </section>
        </div>

        <p className="mt-6 text-center text-sm text-[#8A8575] print:hidden">
          Questions about your booking? Reply to your confirmation email or contact the front desk.
        </p>
      </div>
    </main>
  );
}
