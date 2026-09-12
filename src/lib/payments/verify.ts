import type { Reservation } from "../types";

export type PaymentData = {
  status: string;
  amount?: string | number;
  paidAt?: string;
  reservationId?: string;
};

type VerificationBody = {
  success?: boolean;
  data?: PaymentData;
  message?: string;
};

const API_BASE = (process.env.BACKEND_URL || "http://localhost:5001/v1").replace(/\/$/, "");

export async function verifyPayment(reference: string): Promise<{
  ok: boolean;
  status: number;
  body: VerificationBody | null;
}> {
  const url = `${API_BASE}/reservation/verify-payment/${encodeURIComponent(reference)}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  let body: VerificationBody | null = null;
  try {
    body = (await res.json()) as VerificationBody;
  } catch {
    // The caller handles an empty or invalid response as a failed verification.
  }

  return { ok: res.ok, status: res.status, body };
}

export async function getReservation(reservationId: string): Promise<{
  ok: boolean;
  status: number;
  body: Reservation | null;
}> {
  const url = `${API_BASE}/reservation/${encodeURIComponent(reservationId)}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  let body: Reservation | null = null;
  try {
    body = (await res.json()) as Reservation;
  } catch {
    // The caller can still render payment details without reservation data.
  }
  return { ok: res.ok, status: res.status, body };
}
