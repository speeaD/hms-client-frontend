export type PaymentData = {
  status: string;
  amount?: number;
  paidAt?: string;
  reservationId?: string;
};

export type VerifyResponseBody = {
  success: boolean;
  message?: string;
  data?: PaymentData;
};

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function verifyPayment(reference: string) {
  const url = `${API_BASE}/api/reservations/verify-payment/${encodeURIComponent(reference)}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  let body: VerifyResponseBody | null = null;
  try {
    body = await res.json();
  } catch (err) {
    // ignore JSON parse errors — will handle below
  }

  return { ok: res.ok, status: res.status, body };
}

export async function getReservation(reservationId: string) {
  const url = `${API_BASE}/api/reservations/${encodeURIComponent(reservationId)}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  let body: any = null;
  try {
    body = await res.json();
  } catch (err) {
    // ignore
  }
  return { ok: res.ok, status: res.status, body };
}
