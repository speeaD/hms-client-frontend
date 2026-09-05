import "server-only";
import type { Reservation } from "./types";

// Server-side only — never exposed to the browser, so no NEXT_PUBLIC_ prefix.
// Set this in .env.local / your host's env settings. See .env.example.
const API_BASE_URL = process.env.BACKEND_URL;

export class ReservationFetchError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ReservationFetchError";
    this.status = status;
  }
}

/**
 * Fetches a single reservation (with its room) from the Express API.
 * Returns null for a 404 (caller should call notFound()); throws for any
 * other failure so the route's error.tsx boundary can handle it.
 *
 * Uses cache: "no-store" because this page confirms a payment result —
 * it must always reflect the latest status, never a stale cached copy.
 */
export async function getReservationById(id: string): Promise<Reservation | null> {
  if (!API_BASE_URL) {
    throw new ReservationFetchError(
      "API_BASE_URL is not configured. Set it in your environment — see .env.example."
    );
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/reservation/${encodeURIComponent(id)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ReservationFetchError("Could not reach the reservations service.");
  }

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new ReservationFetchError(
      `Reservations service responded with ${res.status}.`,
      res.status
    );
  }

  const data = (await res.json()) as Reservation;
  return data;
}
