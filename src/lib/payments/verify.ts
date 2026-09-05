export type PaymentData = {
  status: string;
  amount?: number;
  paidAt?: string;
  reservationId?: string;
};



const API_BASE = process.env.BACKEND_URL || "http://localhost:5001/v1";

export async function verifyPayment(reference: string) {
  const url = `${API_BASE}reservation/verify-payment/${encodeURIComponent(reference)}`;
  console.log(url);
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  let body: any = null;
  console.log(res)
  try {
    body = await res.json();
    console.log(body)
  } catch (err) {
    // ignore JSON parse errors — will handle below
  }

  return { ok: res.ok, status: res.status, body };
}

export async function getReservation(reservationId: string) {
  const url = `${API_BASE}/reservation/${encodeURIComponent(reservationId)}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  let body: any = null;
  try {
    body = await res.json();
  } catch (err) {
    // ignore
  }
  return { ok: res.ok, status: res.status, body };
}
