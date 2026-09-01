import React from "react";

import { verifyPayment, getReservation } from "../../../../lib/payments/verify";

type Props = { params: { reference?: string } };

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAmount(amount?: number | null): string {
  if (amount === undefined || amount === null) return "—";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "NGN" }).format(amount);
  } catch (e) {
    return String(amount);
  }
}

function SuccessContent({ payment, reservation, reference }: any) {
  return (
    <main style={{ padding: 24 }}>
      <div>
        <h1>Payment confirmed</h1>
        <p>Your payment was confirmed and the reservation is booked.</p>

        <section>
          <h2>Payment</h2>
          <dl>
            <div>
              <dt>Amount</dt>
              <dd>{formatAmount(payment?.amount ?? null)}</dd>
            </div>
            <div>
              <dt>Reference</dt>
              <dd style={{ fontFamily: "monospace" }}>{reference}</dd>
            </div>
            <div>
              <dt>Paid at</dt>
              <dd style={{ fontFamily: "monospace" }}>{formatDateTime(payment?.paidAt ?? null)}</dd>
            </div>
          </dl>
        </section>

        {reservation && (
          <section>
            <h2>Reservation</h2>
            <dl>
              <div>
                <dt>Guest</dt>
                <dd>{[reservation.firstName, reservation.lastName].filter(Boolean).join(" ") || "—"}</dd>
              </div>
              <div>
                <dt>Room</dt>
                <dd>{reservation.room?.roomNumber || "—"}</dd>
              </div>
              <div>
                <dt>Check-in</dt>
                <dd style={{ fontFamily: "monospace" }}>{formatDate(reservation.checkInDate)}</dd>
              </div>
              <div>
                <dt>Check-out</dt>
                <dd style={{ fontFamily: "monospace" }}>{formatDate(reservation.checkOutDate)}</dd>
              </div>
            </dl>
            <p>
              <a href={`/reservations/${reservation.id}`}>View reservation</a>
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function DeclinedContent({ payment, reference }: any) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Payment didn&apos;t go through</h1>
      <p>Your card wasn&apos;t charged. You can try again or use a different card.</p>

      <section>
        <h2>Payment</h2>
        <dl>
          <div>
            <dt>Amount</dt>
            <dd>{formatAmount(payment?.amount ?? null)}</dd>
          </div>
          <div>
            <dt>Reference</dt>
            <dd style={{ fontFamily: "monospace" }}>{reference}</dd>
          </div>
        </dl>
      </section>

      <p>
        <a href="/book">Try again</a>
      </p>
    </main>
  );
}

function ErrorContent({ message }: any) {
  return (
    <main style={{ padding: 24 }}>
      <h1>We couldn&apos;t confirm this payment</h1>
      <p>{message ?? "Something went wrong while confirming your payment."}</p>
      <p>If money left your account, it will be reconciled automatically — you don&apos;t need to pay again.</p>
      <p>
        <a href="mailto:frontdesk@yourhotel.com">Contact support</a>
      </p>
    </main>
  );
}

function UnexpectedErrorContent() {
  return (
    <main style={{ padding: 24 }}>
      <h1>We couldn&apos;t confirm this payment</h1>
      <p>Unexpected error while confirming your payment.</p>
      <p>
        <a href="mailto:frontdesk@yourhotel.com">Contact support</a>
      </p>
    </main>
  );
}

export default async function PaymentVerifyPage({ params }: Props) {
  const reference = params?.reference;

  if (!reference) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Missing payment reference</h1>
        <p>No payment reference was provided.</p>
      </main>
    );
  }

  let payment: any = null;
  let reservation: any = null;
  let errorMessage: string | undefined;
  let isUnexpectedError = false;
  let isDeclined = false;

  try {
    const verified = await verifyPayment(reference);
    const body = verified.body;

    // Success path
    if (verified.ok && body?.success) {
      payment = body.data ?? null;

      if (payment?.reservationId) {
        try {
          const resv = await getReservation(payment.reservationId);
          if (resv.ok) reservation = resv.body;
        } catch (err) {
          // non-fatal
        }
      }

      return <SuccessContent payment={payment} reservation={reservation} reference={reference} />;
    }

    // Declined (400 from API)
    if (verified.status === 400) {
      payment = body?.data ?? null;
      isDeclined = true;
      return <DeclinedContent payment={payment} reference={reference} />;
    }

    // Generic error
    errorMessage = body?.message;
  } catch (err) {
    isUnexpectedError = true;
  }

  if (isUnexpectedError) {
    return <UnexpectedErrorContent />;
  }

  return <ErrorContent message={errorMessage} />;
}
