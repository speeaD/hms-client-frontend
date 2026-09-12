import React from "react";

import { verifyPayment, getReservation } from "../../../../lib/payments/verify";
import type { PaymentData } from "../../../../lib/payments/verify";
import type { Reservation } from "../../../../lib/types";
import {
  formatCurrency,
  formatDate,
  formatGuestCount,
  nightsBetween,
} from "../../../../lib/format";

type Props = {
  params: Promise<{ reference: string }>;
};

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

function CheckIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10.3 4.3L2.7 17.2C2 18.4 2.9 20 4.3 20H19.7C21.1 20 22 18.4 21.3 17.2L13.7 4.3C13 3.1 11 3.1 10.3 4.3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 9V13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="info-row">
      <dt>{label}</dt>
      <dd className={mono ? "mono" : ""}>{value}</dd>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .payment-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(16, 185, 129, 0.08), transparent 30%),
            radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.06), transparent 32%),
            #f8fafc;
          padding: 48px 20px;
          color: #0f172a;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .payment-container {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .brand {
          text-align: center;
          margin-bottom: 28px;
        }

        .brand-name {
          margin: 0;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f172a;
        }

        .brand-subtitle {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .payment-card {
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          box-shadow:
            0 24px 60px rgba(15, 23, 42, 0.08),
            0 8px 24px rgba(15, 23, 42, 0.04);
        }

        .status-section {
          text-align: center;
          padding: 42px 32px 34px;
        }

        .status-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .status-icon.success {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-icon.declined {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-icon.warning {
          background: #fef3c7;
          color: #d97706;
        }

        .status-title {
          margin: 0;
          font-size: 30px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .status-description {
          max-width: 560px;
          margin: 12px auto 0;
          font-size: 15px;
          line-height: 1.65;
          color: #64748b;
        }

        .content-section {
          padding: 0 32px 32px;
        }

        .section-card {
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
          background: #ffffff;
        }

        .section-header {
          padding: 17px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .section-title {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          color: #334155;
          letter-spacing: 0.01em;
        }

        .details {
          margin: 0;
          padding: 4px 20px;
        }

        .info-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 17px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-row:last-child {
          border-bottom: 0;
        }

        .info-row dt {
          color: #64748b;
          font-size: 13px;
          flex: 0 0 auto;
        }

        .info-row dd {
          margin: 0;
          text-align: right;
          color: #0f172a;
          font-size: 14px;
          font-weight: 650;
          word-break: break-word;
        }

        .mono {
          font-family:
            "SFMono-Regular",
            Consolas,
            "Liberation Mono",
            Menlo,
            monospace;
          font-size: 12px !important;
          font-weight: 500 !important;
        }

        .reservation-card {
          margin-top: 18px;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          padding: 0 32px 34px;
        }

        .button {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 18px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 750;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;
        }

        .button:hover {
          transform: translateY(-1px);
        }

        .button-primary {
          color: #ffffff;
          background: #0f172a;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
        }

        .button-primary:hover {
          background: #1e293b;
        }

        .button-secondary {
          color: #334155;
          background: #ffffff;
          border: 1px solid #cbd5e1;
        }

        .button-secondary:hover {
          background: #f8fafc;
        }

        .support-message {
          margin: 18px 0 0;
          padding: 14px 16px;
          border-radius: 12px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 13px;
          line-height: 1.6;
        }

        .footer {
          text-align: center;
          margin-top: 20px;
          color: #94a3b8;
          font-size: 12px;
        }

        .footer a {
          color: #64748b;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .payment-page {
            padding: 24px 14px;
          }

          .payment-card {
            border-radius: 20px;
          }

          .status-section {
            padding: 34px 20px 28px;
          }

          .content-section,
          .actions {
            padding-left: 20px;
            padding-right: 20px;
          }

          .status-title {
            font-size: 25px;
          }

          .status-description {
            font-size: 14px;
          }

          .info-row {
            flex-direction: column;
            gap: 5px;
          }

          .info-row dd {
            text-align: left;
          }

          .actions {
            flex-direction: column;
          }

          .button {
            width: 100%;
          }
        }
      `}</style>

      <main className="payment-page">
        <div className="payment-container">
          <div className="brand">
            <p className="brand-name">Hotelliere</p>
            <p className="brand-subtitle">Secure payment confirmation</p>
          </div>

          {children}

          <div className="footer">
            Need help?{" "}
            <a href="mailto:frontdesk@yourhotel.com">
              Contact front desk
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

function SuccessContent({
  payment,
  reservation,
  reference,
}: {
  payment: PaymentData | null;
  reservation: Reservation | null;
  reference: string;
}) {
  return (
    <PageShell>
      <div className="payment-card">
        <section className="status-section">
          <div className="status-icon success">
            <CheckIcon />
          </div>

          <h1 className="status-title">Payment confirmed</h1>

          <p className="status-description">
            Your payment was confirmed successfully and your reservation is
            booked.
          </p>
        </section>

        <div className="content-section">
          <section className="section-card">
            <div className="section-header">
              <h2 className="section-title">Payment details</h2>
            </div>

            <dl className="details">
              <InfoRow
                label="Amount"
                value={formatCurrency(payment?.amount)}
              />

              <InfoRow
                label="Reference"
                value={reference}
                mono
              />

              <InfoRow
                label="Paid at"
                value={formatDateTime(payment?.paidAt ?? null)}
                mono
              />
            </dl>
          </section>

          {reservation && (
            <section className="section-card reservation-card">
              <div className="section-header">
                <h2 className="section-title">Reservation details</h2>
              </div>

              <dl className="details">
                <InfoRow
                  label="Guest"
                  value={
                    [reservation.firstName, reservation.lastName]
                      .filter(Boolean)
                      .join(" ") || "—"
                  }
                />

                <InfoRow
                  label="Room"
                  value={
                    reservation.room
                      ? `${reservation.room.roomNumber} · ${reservation.room.name}`
                      : "—"
                  }
                />

                <InfoRow
                  label="Check-in"
                  value={formatDate(reservation.checkInDate)}
                />

                <InfoRow
                  label="Check-out"
                  value={formatDate(reservation.checkOutDate)}
                />

                <InfoRow
                  label="Guests"
                  value={formatGuestCount(reservation.numberOfGuests)}
                />

                <InfoRow
                  label="Nights"
                  value={nightsBetween(reservation.checkInDate, reservation.checkOutDate)}
                />

                <InfoRow
                  label="Total"
                  value={formatCurrency(reservation.totalAmount)}
                />
              </dl>
            </section>
          )}
        </div>

        {reservation && (
          <div className="actions">
            <a
              href={`/reservations/${reservation.id}`}
              className="button button-primary"
            >
              View reservation
              <ArrowRightIcon />
            </a>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function DeclinedContent({
  payment,
  reference,
}: { payment: PaymentData | null; reference: string }) {
  return (
    <PageShell>
      <div className="payment-card">
        <section className="status-section">
          <div className="status-icon declined">
            <CloseIcon />
          </div>

          <h1 className="status-title">Payment didn&apos;t go through</h1>

          <p className="status-description">
            Your card wasn&apos;t charged. You can try again or use a
            different payment method.
          </p>
        </section>

        <div className="content-section">
          <section className="section-card">
            <div className="section-header">
              <h2 className="section-title">Payment details</h2>
            </div>

            <dl className="details">
              <InfoRow
                label="Amount"
                value={formatCurrency(payment?.amount)}
              />

              <InfoRow
                label="Reference"
                value={reference}
                mono
              />
            </dl>
          </section>
        </div>

        <div className="actions">
          <a href="/book" className="button button-primary">
            Try again
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </PageShell>
  );
}

function ErrorContent({
  message,
}: any) {
  return (
    <PageShell>
      <div className="payment-card">
        <section className="status-section">
          <div className="status-icon warning">
            <WarningIcon />
          </div>

          <h1 className="status-title">
            We couldn&apos;t confirm this payment
          </h1>

          <p className="status-description">
            {message ??
              "Something went wrong while confirming your payment."}
          </p>
        </section>

        <div className="content-section">
          <div className="support-message">
            If money left your account, it will be reconciled
            automatically. You don&apos;t need to pay again.
          </div>
        </div>

        <div className="actions">
          <a
            href="mailto:frontdesk@yourhotel.com"
            className="button button-primary"
          >
            Contact support
          </a>

          <a href="/book" className="button button-secondary">
            Return to booking
          </a>
        </div>
      </div>
    </PageShell>
  );
}

function UnexpectedErrorContent() {
  return (
    <PageShell>
      <div className="payment-card">
        <section className="status-section">
          <div className="status-icon warning">
            <WarningIcon />
          </div>

          <h1 className="status-title">
            We couldn&apos;t confirm this payment
          </h1>

          <p className="status-description">
            An unexpected error occurred while confirming your payment.
          </p>
        </section>

        <div className="content-section">
          <div className="support-message">
            If money left your account, it will be reconciled
            automatically. You don&apos;t need to pay again.
          </div>
        </div>

        <div className="actions">
          <a
            href="mailto:frontdesk@yourhotel.com"
            className="button button-primary"
          >
            Contact support
          </a>

          <a href="/book" className="button button-secondary">
            Return to booking
          </a>
        </div>
      </div>
    </PageShell>
  );
}

export default async function PaymentVerifyPage({
  params,
}: Props) {
  const { reference } = await params;

  if (!reference) {
    return (
      <PageShell>
        <div className="payment-card">
          <section className="status-section">
            <div className="status-icon warning">
              <WarningIcon />
            </div>

            <h1 className="status-title">
              Missing payment reference
            </h1>

            <p className="status-description">
              No payment reference was provided.
            </p>
          </section>
        </div>
      </PageShell>
    );
  }

  let payment: PaymentData | null = null;
  let reservation: Reservation | null = null;
  let errorMessage: string | undefined;
  let isUnexpectedError = false;
  let isSuccessful = false;
  let isDeclined = false;

  try {
    const verified = await verifyPayment(reference);
    const body = verified.body;
    console.log("Payment verification response:", verified, body);

    // Success path
    if (verified.ok && body?.success) {
      payment = body.data ?? null;
      isSuccessful = true;

      if (payment?.reservationId) {
        try {
          const resv = await getReservation(payment.reservationId);

          if (resv.ok) {
            reservation = resv.body;
          }
        } catch {
          // Non-fatal: payment can still be shown without reservation data.
        }
      }
    } else if (verified.status === 400) {
      // Declined (400 from API)
      payment = body?.data ?? null;
      isDeclined = true;
    } else {
      // Generic error
      errorMessage = body?.message;
    }
  } catch {
    isUnexpectedError = true;
  }

  if (isSuccessful) {
    return (
      <SuccessContent
        payment={payment}
        reservation={reservation}
        reference={reference}
      />
    );
  }

  if (isDeclined) {
    return (
      <DeclinedContent
        payment={payment}
        reference={reference}
      />
    );
  }

  if (isUnexpectedError) {
    return <UnexpectedErrorContent />;
  }

  return <ErrorContent message={errorMessage} />;
}
